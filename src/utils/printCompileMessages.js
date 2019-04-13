import chalk from "chalk";
import formatWebpackMessages from './formatWebpackMessages';
import printFileSizesAfterBuild from "./printFileSizesAfterBuild";
import printBuildError from './printBuildError';
import log from "./logger";
import _ from "lodash";

const printError = err => {
    log(chalk.red('Failed to compile.\n'));
    printBuildError(err);
}

export default (stats, config) => {
    let messages = formatWebpackMessages(
        stats.toJson({ all: false, warnings: true, errors: true })
    );

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

        printFileSizesAfterBuild(stats, config)
    }
}