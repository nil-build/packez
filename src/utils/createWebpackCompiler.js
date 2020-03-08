import webpack from "webpack";
import _ from "lodash";
import chalk from "chalk";
import forkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import printCompileMessages from "./printCompileMessages";
import typescriptFormatter from "./typescriptFormatter";
import webpackConfigFactory from "../webpack/webpack.config";
import log from "./logger";

export default function createCompiler(options) {
	const config = webpackConfigFactory(options);
	const useTypeScript = options.useTypeScript;

	log("Starting compile...\n");

	let compiler;
	try {
		compiler = webpack(config);
	} catch (err) {
		console.log(chalk.red("Failed to compile."));
		console.log();
		console.log(err.message || err);
		console.log();
		process.exit(1);
	}

	let isFirstCompile = true;
	let tsMessagesPromise;
	let tsMessagesResolver;

	if (useTypeScript) {
		compiler.hooks.beforeCompile.tap("beforeCompile", () => {
			if (!isFirstCompile) {
				log("Compiling...\n");
			}
			tsMessagesPromise = new Promise(resolve => {
				tsMessagesResolver = msgs => resolve(msgs);
			});
		});

		forkTsCheckerWebpackPlugin
			.getCompilerHooks(compiler)
			.receive.tap("afterTypeScriptCheck", (diagnostics, lints) => {
				const allMsgs = [...diagnostics, ...lints];
				const format = message =>
					`${message.file}\n${typescriptFormatter(message, true)}`;

				tsMessagesResolver({
					errors: allMsgs
						.filter(msg => msg.severity === "error")
						.map(format),
					warnings: allMsgs
						.filter(msg => msg.severity === "warning")
						.map(format),
				});
			});
	}

	compiler.hooks.done.tap("done", async stats => {
		const statsData = stats.toJson({
			all: false,
			warnings: true,
			errors: true,
		});

		if (useTypeScript && statsData.errors.length === 0) {
			const delayedMsg = setTimeout(() => {
				console.log(
					chalk.yellow(
						"Files successfully emitted, waiting for typecheck results...\n"
					)
				);
			}, 100);

			const messages = await tsMessagesPromise;
			clearTimeout(delayedMsg);

			stats.compilation.errors.push(...messages.errors);

			stats.compilation.warnings.push(...messages.warnings);
		}

		isFirstCompile = false;

		printCompileMessages(stats, config);
	});

	return compiler;
}
