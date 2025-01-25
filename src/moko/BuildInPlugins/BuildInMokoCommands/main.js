import Plugin from "../../model/Plugin";
// import { newHotkey } from "../../utils/moko";

const buildInMokoCommands = [
	{
		command: "show-command-palette",
		commandHandler: () => window.moko.CommandPalette.showCommandPalette(),
		options: { hotkeys: ["command+shift+p"] }, // ["ctrl+shift+p", "command+shift+p"]
	},
	{
		command: "show-file-palette",
		commandHandler: () => window.moko.CommandPalette.showFilePalette(),
		options: { hotkeys: ["command+p"] }, // ["ctrl+p", "command+p"]
	},
	{
		command: "open-in-editor",
		commandHandler: function () {},
		options: {
			hotkeys: "command+o", // [newHotkey(["Mod", "Alt"], "N")],
		},
	},
	{
		command: "go-back",
		commandHandler: function () {},
		options: {
			hotkeys: "command+left", // [newHotkey(["Mod", "Alt"], "ArrowLeft")]
		},
	},
	{
		command: "go-forward",
		commandHandler: function () {},
		options: {
			hotkeys: "command+right", // [newHotkey(["Mod", "Alt"], "ArrowRight")]
		},
	},
	{
		command: "zoom-in",
		commandHandler: function () {},
		options: {
			hotkeys: "command+up", // [newHotkey(["Mod", "Alt"], "ArrowUp")]
		},
	},
	{
		command: "zoom-out",
		commandHandler: function () {},
		options: {
			hotkeys: "command+down", // [newHotkey(["Mod", "Alt"], "ArrowDown")]
		},
	},
	{
		command: "new-file",
		commandHandler: function () {},
		options: {
			hotkeys: "command+n", // [newHotkey(["Mod"], "N")],
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
