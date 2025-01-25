import JSON5 from "json5";
import Plugin from "../../model/Plugin.js";
import manifest from "./manifest.json?raw";
import "./style.css";
export class TestButton extends Plugin {
	onload() {
		this.manifest = JSON5.parse(manifest);
		this.els = [];
		// MARK welcome page
		// const statusBarItem = this.addStatusBarLeftItem();
		// statusBarItem.innerHTML = "welcome";
		// statusBarItem.addEventListener("click", () => {
		// 	this.moko.workspace.openWelcome();
		// });
		// MARK open workspace json file
		const statusBarItem5 = this.addStatusBarLeftItem();
		statusBarItem5.innerHTML = "loadJson";
		statusBarItem5.addEventListener("click", async () => {
			const options = {
				properties: ["openFile"],
				message: "请选library json文件",
				filters: [{ name: "*", extensions: ["json"] }],
			};
			const paths = await this.moko.FileManager.showOpenDialog(options);
			// const JSON5 = window.require("json5");
			if (!paths || !paths.length) return;
			const t = await this.moko.adapter.read(paths[0]);
			const j = JSON5.parse(t);
			console.log(j);
		});
		// MARK prewview file
		// const statusBarItem = this.addStatusBarLeftItem();
		// statusBarItem.innerHTML = "preview-file";
		// statusBarItem.addEventListener("click", () => {
		// 	this.moko.adapter.ipcRenderer.send("preview-file", "/Users/wxm/test/test.jpg");  //需要传入绝对地址
		// });
		// MARK vibrancy menu
		const statusBarItem = this.addStatusBarLeftItem();
		statusBarItem.innerHTML = "vibrancy menu";
		statusBarItem.addEventListener("click", async () => {
			const a = await this.moko.adapter.ipcRenderer.invoke("menu:showVibrancyMenu"); // vibrancy?: ('appearance-based' 完全透明 | 'titlebar' | 'selection' | 'menu' | 'popover' | 'sidebar' | 'header' | 'sheet' | 'window' | 'hud' | 'fullscreen-ui' | 'tooltip' | 'content' | 'under-window' | 'under-page');
			console.log("menu:showVibrancyMenu :", a);
		});
		// MARK context menu
		// const statusBarItem2 = this.addStatusBarLeftItem();
		// statusBarItem2.innerHTML = "contextMenu";
		// statusBarItem2.addEventListener("click", () => {
		// 	this.moko.adapter.ipcRenderer.send("show-context-menu"); // vibrancy?: ('appearance-based' 完全透明 | 'titlebar' | 'selection' | 'menu' | 'popover' | 'sidebar' | 'header' | 'sheet' | 'window' | 'hud' | 'fullscreen-ui' | 'tooltip' | 'content' | 'under-window' | 'under-page');
		// 	console.log("show-context-menu");
		// });
		// MARK modal window
		// const statusBarItem2 = this.addStatusBarLeftItem();
		// statusBarItem2.innerHTML = "open-settings";
		// statusBarItem2.addEventListener("click", () => {
		// 	this.moko.adapter.ipcRenderer.send("open-settings");
		// 	console.log("open-settings");
		// });
		// MARK ZEN mode
		const statusBarItem2 = this.addStatusBarLeftItem();
		statusBarItem2.innerHTML = "Zen";
		statusBarItem2.addEventListener("click", () => {
			this.moko.toggleZen();
		});
		// MARK title get cm color mode
		// const statusBarItem5 = this.addStatusBarLeftItem();
		// statusBarItem5.innerHTML = "setTitleColor";
		// statusBarItem5.addEventListener("click", () => {
		// 	this.moko.titleBar.setColorFromCm();
		// });
		// MARK show notification
		// const statusBarItem5 = this.addStatusBarLeftItem();
		// statusBarItem5.innerHTML = "sysNotification";
		// statusBarItem5.addEventListener("click", () => {
		// 	this.moko.adapter.showNotification();
		// });

		// MARK ZOOM
		// const statusBarItem3 = this.addStatusBarLeftItem();
		// statusBarItem3.innerHTML = "Zoom";
		// statusBarItem3.addEventListener("click", () => {
		// 	this.moko.adapter.ipcRenderer.send("set-zoom-level", 0);
		// });
		// const statusBarItem4 = this.addStatusBarLeftItem();
		// statusBarItem4.innerHTML = "Zoom Level";
		// this.moko.adapter.ipcRenderer.on("zoom-level-reply", (event, zoomLevel) => {
		// 	console.log("Zoom Level:", zoomLevel);
		// 	statusBarItem4.innerHTML = `ZoomLevel: ${zoomLevel}`;
		// });
		// this.moko.workspace.on("editor-cursorActivity", () => {
		// 	this.moko.adapter.ipcRenderer.send("get-zoom-level");
		// });
		// const statusBarItem5 = this.addStatusBarLeftItem();
		// statusBarItem5.innerHTML = "Zoom Factor";
		// this.moko.adapter.ipcRenderer.on("zoom-factor-reply", (event, zoomLevel) => {
		// 	console.log("Zoom Factor:", zoomLevel);
		// 	statusBarItem5.innerHTML = `ZoomFactor: ${zoomLevel}`;
		// });
		// this.moko.workspace.on("editor-cursorActivity", () => {
		// 	this.moko.adapter.ipcRenderer.send("get-zoom-factor");
		// });
	}
	onunload() {}
}

export default TestButton;
