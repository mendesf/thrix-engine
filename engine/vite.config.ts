import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	root: path.resolve(__dirname),
	build: {
		lib: {
			entry: path.resolve(__dirname, "index.ts"),
			name: "Thrix",
			fileName: (format) => `thrix.${format}.js`,
		},
		emptyOutDir: true,
	},
	resolve: {
		alias: {
			thrix: path.resolve(__dirname),
		},
	},
});
