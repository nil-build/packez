
var {
    start,
    build,
    server,
    analyzer,
} = require('./lib');

function packez(entry, output, opts = {}) {
    return start(entry, output, opts);
}

packez.start = start;
packez.build = build;
packez.server = server;
packez.analyzer = analyzer;

module.exports = packez;