import program from "commander";
import path from "path";
import os from "os";
import fs from "fs-extra";
import _ from "lodash";
import pkg from "../package.json";
import * as packez from "./index";
import log from "./utils/logger";

program
	.version(pkg.version)
	.option("-w, --watch", "是否监控文件改变")
	.option("-d, --outDir [outDir]", "输出到指定目录，默认为 dist", "dist")
	.option(
		"-t, --target [target]",
		"转换目标格式：web | node 默认为 web",
		/^node|web$/,
		"web"
	)
	.option("-c, --clean", "转换前清空输出目录")
	.option("-p, --publicPath [publicPath]", "publicPath", "")
	.option("--config [config]", "configFile", "./packez.config.js")
	.option("--state [state]", "state", "")
	.parse(process.argv);

const options = {
	watch: _.get(program, "watch", false),
	target: _.get(program, "target", "web"),
	clean: _.get(program, "clean", false),
	publicPath: _.get(program, "publicPath", ""),
	state: _.get(program, "state", ""),
};

const validExecutors = ["start", "build", "server", "analyzer", "bundle"];
const args = program.args;
const outputDir = _.get(program, "outDir", "dist");
let entry = "./src/index.js";
let executor = "start";

if (args[0] === "init") {
	const pkgFile = process.cwd() + "/package.json";
	let userPkg = {};
	if (fs.existsSync(pkgFile)) {
		userPkg = require(pkgFile);
	}

	const scripts = userPkg.scripts || {};

	userPkg.scripts = scripts;

	if (!fs.existsSync(path.resolve(process.cwd(), "packez.config.js"))) {
		fs.writeFileSync(
			path.resolve(process.cwd(), "packez.config.js"),
			fs.readFileSync(__dirname + "/packez.config.template.js")
		);
	}

	if (!scripts.start) {
		scripts.start = "packez start ./src/index.js -w -c";
		log(`add scripts.start = ${scripts.start} successfully.`);
	}

	if (!scripts.build) {
		scripts.build = "packez build ./src/index.js -c";
		log(`add scripts.build = ${scripts.build} successfully.`);
	}

	if (!scripts.server) {
		scripts.server = "packez server ./src/index.js -c";
		log(`add scripts.server = ${scripts.server} successfully.`);
	}

	if (!scripts.analyzer) {
		scripts.analyzer = "packez analyzer ./src/index.js -c";
		log(`add scripts.analyzer = ${scripts.analyzer} successfully.`);
	}

	log(`add packez.config.js successfully.`);

	fs.writeFileSync(pkgFile, JSON.stringify(userPkg, null, 2) + os.EOL);

	process.exit(1);
}

let isShortCmd = false;

if (args.length === 1) {
	if (validExecutors.indexOf(args[0]) === -1) {
		entry = args[0];
	} else {
		isShortCmd = true;
	}
} else if (args.length > 1) {
	executor = args[0];
	entry = args[1];
}

if (validExecutors.indexOf(executor) === -1) {
	throw new Error(
		`packez method ${executor} not exists! you may use start,build,server,analyzer,bundle`
	);
}

if (!isShortCmd) {
	if (!fs.existsSync(entry)) {
		throw new Error(`entry file [${entry}] not exists!`);
	}

	const stats = fs.statSync(entry);

	if (stats.isDirectory()) {
		const entries = {};
		const results = fs.readdirSync(entry);
		results.forEach((file) => {
			if (/\.(js|mjs|jsx|ts|tsx)$/.test(file)) {
				entries[file] = path.resolve(entry, file);
			}
		});

		entry = entries;
	}
}

packez[executor](entry, outputDir, {
	configFile: program.config,
	method: executor,
	publicPath: options.publicPath,
	watch: options.watch,
	target: options.target,
	clean: options.clean,
	state: options.state,
	program,
});
