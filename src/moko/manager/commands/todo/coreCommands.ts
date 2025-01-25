import { Command } from "../../../utils/moko";
import { newHotkey } from "../../../utils/moko";

export const coreCommands: Command[] = [
	{
		id: "workspace:open-in-editor",
		name: "open in editor",
		// icon: "plus",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.newFile(), !0;
		},
		hotkeys: [newHotkey(["Mod", "Alt"], "N")],
	},
	{
		id: "app:go-back",
		name: "Go Back",
		// icon: "arrow_left",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.history.back(), !0;
		},
		hotkeys: [newHotkey(["Mod", "Alt"], "ArrowLeft")],
	},
	{
		id: "app:go-forward",
		name: "Go Forward",
		// icon: "arrow_right",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.history.forward(), !0;
		},
		hotkeys: [newHotkey(["Mod", "Alt"], "ArrowRight")],
	},
	{
		id: "window:zoom-in",
		name: "Zoom In",
		// icon: "maximize",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.view.zoomIn(), !0;
		},
		hotkeys: [newHotkey(["Mod", "Alt"], "ArrowUp")],
	},
	{
		id: "window:zoom-out",
		name: "Zoom Out",
		// icon: "minimize",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.view.zoomOut(), !0;
		},
		hotkeys: [newHotkey(["Mod", "Alt"], "ArrowDown")],
	},
	{
		id: "app:new-file",
		name: "New File",
		// icon: "plus",
		checkCallback: function () {
			// const n = e.workspace.activeLeaf;
			// if (n && n.view.navigation) return t || n.view.zoomOut(), !0;
		},
		hotkeys: [newHotkey(["Mod"], "N")],
	},
	{
		id: "editor:undo",
		name: "Undo",
		// icon: "undo",
		checkCallback: function () {},
		hotkeys: [newHotkey(["Mod"], "Z")],
	},
	{
		id: "editor:redo",
		name: "Redo",
		// icon: "redo",
		checkCallback: function () {},
		hotkeys: [newHotkey(["Mod", "Shift"], "Z")],
	},
	{
		id: "editor:toggle-bold",
		name: "Toggle Bold",
		// icon: "bold",
		checkCallback: function () {},
		hotkeys: [newHotkey(["Mod"], "B")],
	},
	// {
	// 	id: "file-explorer:open",
	// 	name: "Open",
	// 	// icon: "underline",
	// 	checkCallback: function () {},
	// 	hotkeys: [newHotkey(["Mod"], "U")],
	// },
	// {
	// 	id: "editor:toggle-italic",
	// 	name: "Toggle Italic",
	// 	icon: "italic",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "I")],
	// },
	// {
	// 	id: "editor:toggle-strike",
	// 	name: "Toggle Strike",
	// 	icon: "strikethrough",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "S")],
	// },
	// {
	// 	id: "editor:toggle-code",
	// 	name: "Toggle Code",
	// 	icon: "code",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "C")],
	// },
	// {
	// 	id: "editor:toggle-blockquote",
	// 	name: "Toggle Blockquote",
	// 	icon: "quote",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "Q")],
	// },
	// {
	// 	id: "editor:toggle-link",
	// 	name: "Toggle Link",
	// 	icon: "link",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "L")],
	// },
	// {
	// 	id: "editor:toggle-image",
	// 	name: "Toggle Image",
	// 	icon: "image",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "M")],
	// },
	// {
	// 	id: "editor:toggle-code-block",
	// 	name: "Toggle Code Block",
	// 	icon: "code_block",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "K")],
	// },
	// {
	// 	id: "editor:toggle-task-list",
	// 	name: "Toggle Task List",
	// 	icon: "list_checks",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "T")],
	// },
	// {
	// 	id: "editor:toggle-ordered-list",
	// 	name: "Toggle Ordered List",
	// 	icon: "list_ordered",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "O")],
	// },
	// {
	// 	id: "editor:toggle-unordered-list",
	// 	name: "Toggle Unordered List",
	// 	icon: "list_unordered",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod"], "U")],
	// },
	// {
	// 	id: "editor:toggle-task-list-item",
	// 	name: "Toggle Task List Item",
	// 	icon: "list_checks",
	// 	checkCallback: function (_t) {},
	// 	hotkeys: [newHotkey(["Mod", "Shift"], "T")],
	// },
];
