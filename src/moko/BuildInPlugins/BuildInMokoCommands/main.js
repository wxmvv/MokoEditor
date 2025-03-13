import Plugin from "../../model/Plugin";

const buildInMokoCommands = [
	{
		command: "show-command-palette",
		commandHandler: () => window.moko.CommandPalette.showCommandPalette(),
		options: {
			hotkeys: ["command+shift+p"],
		},
	},
	{
		command: "show-file-palette",
		commandHandler: () => window.moko.CommandPalette.showFilePalette(),
		options: {
			hotkeys: ["command+p"],
		},
	},
	{
		command: "open-in-editor",
		commandHandler: function () {},
		options: {
			hotkeys: "command+o",
		},
	},
	{
		command: "go-back",
		commandHandler: function () {},
		options: {
			hotkeys: "command+left",
		},
	},
	{
		command: "go-forward",
		commandHandler: function () {},
		options: {
			hotkeys: "command+right",
		},
	},
	{
		command: "zoom-in",
		commandHandler: function () {},
		options: {
			hotkeys: "command+up",
		},
	},
	{
		command: "zoom-out",
		commandHandler: function () {},
		options: {
			hotkeys: "command+down",
		},
	},
	{
		command: "new-file",
		commandHandler: function () {},
		options: {
			hotkeys: "command+n",
		},
	},
];
export class BuildInMokoCommands extends Plugin {
	async onload() {
		this.manifest = {
			id: "moko",
		};
		for (const command of buildInMokoCommands) {
			this.registerCommand(command.command, command.commandHandler, command.options);
		}
	}

	async onunload() {}
}

export default BuildInMokoCommands;
