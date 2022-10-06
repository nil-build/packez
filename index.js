var { build, server } = require("./lib");

function packez(entry, output, opts = {}) {
  return server(entry, output, opts);
}

packez.build = build;
packez.server = server;

module.exports = packez;
