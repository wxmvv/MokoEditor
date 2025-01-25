class DevLogger {
	constructor() {}

	static get instance() {
		if (!this._instance) {
			this._instance = new DevLogger();
		}
		return this._instance;
	}

	LogMokoTitle() {
		console.log(
			`%c
███╗   ███╗ ██████╗ ██╗  ██╗ ██████╗
████╗ ████║██╔═══██╗██║ ██╔╝██╔═══██╗
██╔████╔██║██║   ██║█████╔╝ ██║   ██║
██║╚██╔╝██║██║   ██║██╔═██╗ ██║   ██║
██║ ╚═╝ ██║╚██████╔╝██║  ██╗╚██████╔╝
╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝	v0.0.1
`,
			"color:rgba(43, 91, 122, 0.9);font-family: monospace;"
		);
		console.log("%c[DevTools] Hello World", "color:rgba(43, 91, 122, 0.9); font-size:12px; font-weight:bold;font-family: zed-sans;");
	}
	LogPackageInfo() {
		// console.log("%c[Doc] Codemirror5 https://codemirror.net/5", "color:#df5d61; font-size:12px; font-weight:bold;font-family: zed-sans;");
		// console.log("%c[Doc] Electron https://www.electronjs.org", "color:#afe8f7; font-size:12px; font-weight:bold;font-family: zed-sans;");
		// console.log("%c[Doc] Obsidian https://docs.obsidian.md/Home", "color:#7143e2; font-size:12px; font-weight:bold;font-family: zed-sans;");
	}
	LogMokoInitDone() {
		console.log("%cMoko Initial Done", "color:#a7dbde; font-size:18px; font-weight:bold;font-family: zed-sans,monospace;");
	}
}

export default DevLogger;
export { DevLogger };
