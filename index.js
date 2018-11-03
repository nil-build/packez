
const start = require('./start');
const build = require('./build');
const server = require('./server');

function packez(entry, output, opts = {}) {
    return start(entry, output, opts);
}

packez.start = start;
packez.build = build;
packez.server = server;

module.exports = packez;