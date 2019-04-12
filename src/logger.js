export default function (msg, ...rest) {
    const date = (new Date()).toLocaleString();
    console.log('[' + date + '] - ' + msg, ...rest);
}