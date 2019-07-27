import webpack from "webpack";
import _ from "lodash";
import chalk from "chalk";
import formatWebpackMessages from "./formatWebpackMessages";
import printBuildError from "./printBuildError";
import printFileSizesAfterBuild from "./printFileSizesAfterBuild";
import printCompileMessages from "./printCompileMessages";
import log from "./logger";

export default function(config) {
    const watch = config.watch;
    const watchOptions = config.watchOptions;

    delete config.watch;
    delete config.watchOptions;

    log("Starting compile...\n");

    let compiler = webpack(config);

    const printError = err => {
        log(chalk.red("Failed to compile.\n"));
        printBuildError(err);
    };

    const compilerCb = (err, stats) => {
        if (err) {
            if (!err.message) {
                printError(err);
            } else {
                printError(new Error(err.message));
            }
            return;
        }

        printCompileMessages(stats, config);
    };

    if (watch) {
        compiler.watch(watchOptions, compilerCb);
    } else {
        compiler.run(compilerCb);
    }
}
