import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: path.resolve(__dirname),
	build: {
		lib: {
			entry: path.resolve(__dirname, "index.ts"),
			name: "PixiPlugin",
			fileName: (format) => `pixi-plugin.${format}.js`,
		},
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			thrix: path.resolve(__dirname, "..", "..", "engine"),
		},
	},
});
