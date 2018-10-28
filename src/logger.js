module.exports = function (msg, ...rest) {
    const date = (new Date()).toISOString();
    console.log('[' + date + '] - ' + msg, ...rest);
}