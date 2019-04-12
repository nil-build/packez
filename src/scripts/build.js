import start from './start';

export default function (entry, output, opts = {}) {
    start(entry, output, {
        ...opts,
        mode: "production",
        watch: false,
    })
}