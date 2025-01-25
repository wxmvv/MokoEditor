import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	define: {
		// __filename: JSON.stringify(path.resolve(__dirname)),
		// __dirname: JSON.stringify(path.resolve(__dirname)),
		// __filenameshort: 		path.basename(filePath);
		// __filenameshort: JSON.stringify(path.basename(__filename)),
	},
	resolve: {
		alias: [
			// { find: "codemirrorjs", replacement: "/lib/codemirror.js" },
			// "@"
		],
	},
	build: {
		// target: "esnext",
		outDir: "app",
		assetsDir: "assets",
		rollupOptions: {
			// input: {
			// 	app: path.resolve(__dirname, "src/main.jsx"),
			// },
			external: "/lib/cm/codemirror.js",
			// plugins: [copy({ targets: [{ src: "lib", dest: "mobile/lib" }] })],
		},
	},
	publicDir: "public",
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: "lib",
					dest: "",
				},
			],
		}),
	],
});
