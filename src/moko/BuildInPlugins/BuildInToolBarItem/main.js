import Plugin from "../../model/Plugin";
import FilePathItem from "./FilePathItem";
import EditorButtonGroup from "./EditorButtonGroup";
import NavButtonGroup from "./NavButtonGroup";
import TabGroup from "./TabGroup";
import TabBarButtonGroup from "./TabBarButtonGroup";

export class BuildInToolBarItems extends Plugin {
	async onload() {
		this.registerToolbarItem("file-path", (toolbar) => new FilePathItem(toolbar, "file-path"));
		this.registerToolbarItem("editor-button-group", (toolbar) => new EditorButtonGroup(toolbar, "editor-button-group"));
		this.registerToolbarItem("nav-button-group", (toolbar) => new NavButtonGroup(toolbar, "nav-button-group"));
		this.registerToolbarItem("tab-group", (toolbar) => new TabGroup(toolbar, "tab-group"));
		this.registerToolbarItem("tab-bar-button-group", (toolbar) => new TabBarButtonGroup(toolbar, "tab-bar-button-group"));
	}

	async onunload() {}
}

export default BuildInToolBarItems;
