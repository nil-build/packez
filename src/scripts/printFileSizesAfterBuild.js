import filesize from 'filesize';
import stripAnsi from 'strip-ansi';
const chalk = require('chalk');

export default function printFileSizesAfterBuild(stats) {
    const assets = stats
        .toJson({ all: false, assets: true })
        .assets
        .filter(assest => /\.(?:css|js)$/.test(assest.name))
        .map(asset => {
            return {
                ...asset,
                sizeLabel: filesize(asset.size)
            }
        });

    assets
        .sort((a, b) => b.size - a.size)

    var longestSizeLabelLength = Math.max.apply(
        null,
        assets.map(a => stripAnsi(a.sizeLabel).length)
    );

    assets.forEach(asset => {
        var sizeLabel = asset.sizeLabel;
        var sizeLength = stripAnsi(sizeLabel).length;
        if (sizeLength < longestSizeLabelLength) {
            var rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
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