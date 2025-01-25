import Plugin from "../../model/Plugin";

const buildInWorkspaceCommands = [
	{
		command: "undo",
		commandHandler: () => window.moko.workspace.undo(),
		options: { hotkeys: ["ctrl+z", "command+z"] }, //newHotkey(["Mod"], "Z")
	},
	{
		command: "redo",
		commandHandler: () => window.moko.workspace.redo(),
		options: { hotkeys: ["ctrl+shift+z", "command+shift+z"] }, //newHotkey(["Mod", "Shift"], "Z")
	},
];
export class BuildInWorkspaceCommands extends Plugin {
	async onload() {
		this.manifest = {
			id: "workspace",
		};
		for (const command of buildInWorkspaceCommands) {
			this.registerCommand(command.command, command.commandHandler, command.options);
		}
	}

	async onunload() {}
}

export default BuildInWorkspaceCommands;
