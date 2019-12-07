const packez = require("../lib");

const dist = __dirname + "/dist";
const distBuild = __dirname + "/dist-build";
// start build analyzer server
packez.start(
    {
        index: [
            require.resolve("./src/boot.js"),
            require.resolve("./src/index.js")
        ],
        app: require.resolve("./src/news.js")
    },
    dist,
    {
        //runtimeChunk: true,
    }
);

// packez.build(
//     {
//         index: [
//             require.resolve('./src/boot.js'),
//             require.resolve('./src/index.js')
//         ],
//         app: require.resolve('./src/news.js')
//     },
//     distBuild,
//     {
//         //runtimeChunk: true,
//     }
// );
