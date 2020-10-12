var { start, build, server, analyzer, bundle } = require("./lib");

function packez(entry, output, opts = {}) {
	return start(entry, output, opts);
}

packez.start = start;
packez.build = build;
packez.server = server;
packez.analyzer = analyzer;
packez.bundle = bundle;

module.exports = packez;
