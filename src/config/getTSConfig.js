import path from "path";
import fs from "fs-extra";

const tsConfigPath = "../tsconfig/tsconfig.json";

export function getTSConfigFilePath(options) {
	let filePath = path.resolve(options.cwd, "tsconfig.json");

	if (!fs.existsSync(filePath)) {
		filePath = path.resolve(__dirname, tsConfigPath);
	}

	return filePath;
}
