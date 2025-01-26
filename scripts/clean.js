import fg from "fast-glob";
import { rimraf } from "rimraf";

const paths = fg.sync(["../**/dist", "../!**/node_modules/**"], { onlyDirectories: true });

for (const path of paths) {
	rimraf.sync(path);
}
