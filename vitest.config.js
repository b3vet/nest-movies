import swc from "unplugin-swc";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		root: "./",
		coverage: {
			exclude: [
				...configDefaults.exclude,
				"**/*module.ts",
				"**/*dto.ts",
				"**/*entity.ts",
				"**/*table.ts",
				"**/main.ts",
				"**/*moduleDefinition.ts",
				"**/*decorator.ts",
			],
		},
	},
	plugins: [
		swc.vite({
			module: { type: "es6" },
		}),
	],
});
