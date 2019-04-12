
import webpack from "webpack";
import chalk from "chalk";
import formatWebpackMessages from './formatWebpackMessages';
import printBuildError from './printBuildError';
import printFileSizesAfterBuild from "./printFileSizesAfterBuild";
import log from "../logger";
import _ from "lodash";

export default function (config) {
    const watch = config.watch;
    const watchOptions = config.watchOptions;

    delete config.watch;
    delete config.watchOptions;

    log('Starting compile...\n');

    let compiler = webpack(config);

    const printError = err => {
        log(chalk.red('Failed to compile.\n'));
        printBuildError(err);
    }

    const compilerCb = (err, stats) => {
        let messages;
        if (err) {
            if (!err.message) {
                printError(err);
                return;
            }
            messages = formatWebpackMessages({
                errors: [err.message],
                warnings: [],
            });
        } else {
            messages = formatWebpackMessages(
                stats.toJson({ all: false, warnings: true, errors: true })
            );
        }
        if (messages.errors.length) {
            // Only keep the first error. Others are often indicative
            // of the same problem, but confuse the reader with noise.
            if (messages.errors.length > 1) {
                messages.errors.length = 1;
            }
            printError(new Error(messages.errors.join('\n\n')));
            return;
        }

        const warnings = messages.warnings;

        if (warnings.length) {
            log(chalk.yellow('Compiled with warnings.\n'));
            console.log(warnings.join('\n\n'));
            console.log(
                '\nSearch for the ' +
                chalk.underline(chalk.yellow('keywords')) +
                ' to learn more about each warning.'
            );
            console.log(
                'To ignore, add ' +
                chalk.cyan('// eslint-disable-next-line') +
                ' to the line before.\n'
            );
        } else {
            log(chalk.green('Compiled successfully.\n'));

            printFileSizesAfterBuild(stats)
        }
    };

    if (watch) {
        compiler.watch(watchOptions, compilerCb);
    } else {
        compiler.run(compilerCb);
    }
}