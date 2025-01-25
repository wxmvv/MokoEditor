import { Plugin } from "../../model/Plugin.js";
import FilePanelBtnSvg from "../../icons/project.svg?raw";
import { FilE_PANEL_VIEW, FilePanelView } from "./FilePanelView.jsx";
import { Svg } from "../../model/Svg.js";

import manifest from "./manifest.json?raw";
import JSON5 from "json5";

import "./tree/tree-style.css";
import "./style.css";

class FileExplorer extends Plugin {
	async onload() {
		this.manifest = JSON5.parse(manifest);
		this.icon = FilePanelBtnSvg;
		const toggleCommand = {
			command: "open-file-panel",
			commandHandler: () => window.moko.workspace.togglePanel(FilE_PANEL_VIEW),
			options: { hotkeys: ["command+shift+e", "ctrl+shift+e"] }, //[newHotkey(["Mod", "Shift"], "E")],
		};
		const { panel } = this.moko.workspace;
		//注册View
		this.registerView(FilE_PANEL_VIEW, () => new FilePanelView(panel));
		//注册statusBar图标
		const item = this.addStatusBarLeftItem();
		item.innerHTML = Svg({ id: "FileExplorer", svgRaw: this.icon, clickable: true });
		item.addEventListener("click", toggleCommand.commandHandler.bind(this)); // item.addEventListener("click", moko.commands.executeCommand("fileExplorer:open-file-panel"));
		// 注册命令
		this.registerCommand(toggleCommand.command, toggleCommand.commandHandler, toggleCommand.options);
	}
}

export default FileExplorer;
