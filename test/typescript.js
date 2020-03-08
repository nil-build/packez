const packez = require("../lib");

const dist = __dirname + "/dist-typescript";
packez.start(
	{
		app: require.resolve("./src/index.ts"),
	},
	dist,
	{
		useTypeScript: true,
	}
);
