import path from "node:path";
import { defineConfig } from "vite";

const base = path.resolve(__dirname, "..", "..");

export default defineConfig({
	root: path.resolve(__dirname),
	build: {
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			thrix: path.resolve(base, "engine"),
			plugins: path.resolve(base, "plugins"),
		},
	},
});
