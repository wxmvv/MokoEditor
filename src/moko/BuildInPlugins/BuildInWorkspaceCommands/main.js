import Plugin from "../../model/Plugin";

const buildInWorkspaceCommands = [
	{
		command: "undo",
		commandHandler: () => window.moko.workspace.undo(),
		options: { hotkeys: ["ctrl+z", "command+z"] },
	},
	{
		command: "redo",
		commandHandler: () => window.moko.workspace.redo(),
		options: { hotkeys: ["ctrl+shift+z", "command+shift+z"] },
	},
	{
		command: "save",
		commandHandler: () => window.moko.workspace.save(),
		options: { hotkeys: ["ctrl+s", "command+s"] },
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
