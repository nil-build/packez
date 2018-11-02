
const start = require('./start');

module.exports = function (entry, output, opts = {}) {
    return start(entry, output, Object.assign(opts, {
        mode: "production"
    }));
}