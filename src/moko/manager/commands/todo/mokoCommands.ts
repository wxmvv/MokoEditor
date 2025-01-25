/* eslint-disable @typescript-eslint/no-explicit-any */
import { Command } from "../../../utils/moko";
import { newHotkey } from "../../../utils/moko";
// import moko from "../../moko";

export const mokoCommands: Command[] = [
	{
		id: "moko:open-in-current-tab",
		name: "open in current tab",
		callback: async function () {
			await window.moko.FileManager.openFile()
				.then((result: any) => {
					console.log(result);
				})
				.catch((err: any) => {
					console.log(err);
				});
		},
		hotkeys: [newHotkey([], "left")],
	},
	// {
	// 	id: "moko:open-in-new-tab",
	// 	name: "open in new tab",
	// 	checkCallback: function () {},
	// 	hotkeys: [newHotkey(["Mod"], "V")],
	// },
	// {
	// 	id: "moko:open-in-new-window",
	// 	name: "open in new window",
	// 	checkCallback: function () {},
	// },
];
