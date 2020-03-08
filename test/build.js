const packez = require("../lib");

const dist = __dirname + "/dist-build";
packez.build(
	{
		index: [
			require.resolve("./src/boot.js"),
			require.resolve("./src/index.js"),
		],
		app: require.resolve("./src/news.js"),
	},
	dist,
	{
		useTypeScript: false,
	}
);
