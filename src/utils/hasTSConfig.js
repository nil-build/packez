import path from "path";
import fs from "fs-extra";
export default () => {
	const filePath = path.resolve(process.cwd(), "tsconfig.json");

	return fs.existsSync(filePath);
};
