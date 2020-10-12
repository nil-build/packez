import start from "./start";

export default function (entry, output, opts = {}) {
	start(entry, output, {
		watch: false,
		...opts,
		mode: "production",
	});
}
