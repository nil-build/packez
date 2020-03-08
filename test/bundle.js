const packez = require("../lib");

const dist = __dirname + "/dist-bundle";
packez.bundle(
	{
		app: require.resolve("./src/news.js"),
	},
	dist,
	{
		useTypeScript: false,
	}
);
