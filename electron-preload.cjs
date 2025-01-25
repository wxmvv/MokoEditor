// eslint-disable-next-line @typescript-eslint/no-require-imports
const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
	// MARK 判断系统
	const platform = process.platform;
	let className = "";
	if (platform === "darwin") {
		className = "mod-macos";
	} else if (platform === "win32") {
		className = "mod-windows";
	} else if (platform === "linux") {
		className = "mod-linux";
	}
	if (className) {
		document.body.classList.add(className);
		document.body.classList.add("electron");
	}
	// MARK 黑暗模式
	// contextBridge.exposeInMainWorld("electronTheme",{});
	window.electronTheme = {
		onThemeChange: (callback) =>
			ipcRenderer.on("theme-changed", (event, isDarkMode) => {
				callback(isDarkMode);
			}),
	};
});
