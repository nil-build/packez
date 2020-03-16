import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import build from "./build";

export default function(entry, output, opts = {}) {
    opts.plugins = opts.plugins || [];
    opts.plugins.push(new BundleAnalyzerPlugin());
    build(entry, output, opts);
}
