

const packez = require("../lib")

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
//console.log(require.resolve('./src/index.js'));

const dist = __dirname + '/dist';
// start build analyzer server
packez.server(
    {
        index: [
            require.resolve('./src/boot.js'),
            require.resolve('./src/index.js')
        ],
        app: require.resolve('./src/news.js')
    },
    dist,
    {
        //runtimeChunk: true,
    }
);

// const webpackConfig = getWebpackConfig(
//     [require.resolve('./src/boot.js'),
//     require.resolve('./src/index.js')],
//     dist,
//     ({
//         runtimeChunk: true,
//         //   publicPath: "../abc"
//     })
// );

// fs.ensureDirSync(dist);


// fs.emptyDirSync(dist);

// const compiler = webpack(webpackConfig);

// const compilerCb = function (err, stats) {
//     if (err) {
//         return log(err);
//     }

//     const msg = stats.toJson({ all: false, assets: true, warnings: true, errors: true });
//     console.log(msg);

//     // log(stats.toString({
//     //     chunks: false,
//     //     colors: true,
//     // }));
// }
// if (1) {
//     compiler.watch({
//         aggregateTimeout: 300,
//         poll: undefined
//     }, compilerCb);
// } else {
//     compiler.run(compilerCb);
// }

