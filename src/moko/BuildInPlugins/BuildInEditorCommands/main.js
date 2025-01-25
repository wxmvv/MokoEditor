import Plugin from "../../model/Plugin";

const buildInEditorCommands = [
	{
		command: "toggle-bold",
		commandHandler: () => console.log("toggle-bold"),
		options: { hotkeys: "ctrl+b" }, //newHotkey(["Mod"], "B")
	},
];

export class BuildInEditorCommands extends Plugin {
	onload() {
		this.manifest = {
			id: "editor",
		};
		for (const command of buildInEditorCommands) {
			this.registerCommand(command.command, command.commandHandler, command.options);
		}
	}
	onunload() {}
}

export default BuildInEditorCommands;
