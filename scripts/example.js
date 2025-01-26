import { execSync } from "node:child_process";

const name = process.argv[2];

if (!name) {
	console.error('Please provide an example name, e.g. "npm run example bunny"');
	process.exit(1);
}

execSync(`vite --config examples/${name}/vite.config.ts`, { stdio: "inherit" });
