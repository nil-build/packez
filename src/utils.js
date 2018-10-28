const path = require('path');
const fs = require('fs-extra');

function resolveCwd(relativePath) {
    const appRoot = fs.realpathSync(process.cwd());
    return path.resolve(appRoot, relativePath);
}

module.exports = {
    resolveCwd,
}