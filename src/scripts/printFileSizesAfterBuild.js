import filesize from 'filesize';
import fs from 'fs-extra';
import path from 'path';
import stripAnsi from 'strip-ansi';
import chalk from 'chalk';
import gzipSize from 'gzip-size';

export default function printFileSizesAfterBuild(stats, config) {
    const root = config.output.path;

    const assets = stats
        .toJson({ all: false, assets: true })
        .assets
        .filter(assest => /\.(?:css|js|html?)$/.test(assest.name))
        .map(asset => {
            const fileContents = fs.readFileSync(path.join(root, asset.name));
            const gsize = chalk.green(filesize(gzipSize.sync(fileContents)));
            return {
                ...asset,
                gsizeLabel: 'gzip:' + gsize,
                sizeLabel: filesize(asset.size) + `(${gsize})`
            }
        });

    assets
        .sort((a, b) => b.size - a.size)

    var longestSizeLabelLength = Math.max.apply(
        null,
        assets.map(a => stripAnsi(a.sizeLabel).length)
    );

    assets.forEach(asset => {
        let sizeLabel = asset.sizeLabel;
        let sizeLength = stripAnsi(sizeLabel).length;
        if (sizeLength < longestSizeLabelLength) {
            let rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
            sizeLabel += rightPadding;
        }

        console.log(
            '  ' +
            sizeLabel +
            '  ' +
            //chalk.dim(asset.folder + path.sep) +
            chalk.cyan(asset.name)
        );

    });

    console.log();

}