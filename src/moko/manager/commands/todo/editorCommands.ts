import { Command } from "../../../utils/moko";
import { newHotkey } from "../../../utils/moko";

export const editorCommands: Command[] = [
	{
		id: "editor:copy",
		name: "copy",
		checkCallback: function () {},
		hotkeys: [newHotkey(["Mod"], "C")],
	},
	{
		id: "editor:paste",
		name: "paste",
		checkCallback: function () {},
		hotkeys: [newHotkey(["Mod"], "V")],
	},
	{
		id: "editor:cut",
		name: "cut",
		checkCallback: function () {},
	},
];
