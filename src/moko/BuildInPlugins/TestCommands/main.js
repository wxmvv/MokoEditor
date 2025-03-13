import Plugin from "../../model/Plugin";
// import { newHotkey } from "../../utils/moko";

const testCommands = [
	// MARK
	{
		command: "showOpenDialog",
		commandHandler: () => {
			window.moko.FileManager.showOpenDialog();
		},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
		},
	},
	{
		command: "showSaveDialog",
		commandHandler: () => {
			window.moko.FileManager.showSaveDialog();
		},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
		},
	},
	{
		command: "showSaveConfirmDialog",
		commandHandler: () => {
			window.moko.FileManager.showSaveConfirmDialog();
		},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
		},
	},
	{
		command: "showMessageBox",
		commandHandler: () => {
			window.moko.FileManager.showMessageBox();
		},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
		},
	},
	{
		command: "showErrorBox",
		commandHandler: () => {
			window.moko.FileManager.showErrorBox();
		},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
		},
	},
];
export class TestCommands extends Plugin {
	async onload() {
		this.manifest = {
			id: "test",
		};
		for (const command of testCommands) {
			this.registerCommand(command.command, command.commandHandler, command.options);
		}
	}

	async onunload() {}
}

export default TestCommands;
