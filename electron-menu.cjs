/* eslint-disable @typescript-eslint/no-require-imports */

const { app, Menu, shell, BrowserWindow, dialog } = require("electron");

const isMac = process.platform === "darwin";

// function createAboutWindow() {
// 	const aboutWindow = new BrowserWindow({
// 		width: 300,
// 		height: 200,
// 		resizable: false,
// 		maximizable: false,
// 		minimizable: false,
// 		title: "",
// 	});

// 	aboutWindow.loadFile("about.html");
// }

async function showAboutBox(mainWindow) {
	if (!mainWindow) mainWindow = BrowserWindow.getAllWindows()[0];
	return await dialog.showMessageBox(mainWindow, {
		title: "moko",
		message: "Moko Editor",
		detail: `version: 0.0.1\nelectron:${process.versions.electron}\nchromium:${process.versions.chrome}\nnode:${process.versions.node}\nv8:${process.versions.v8}\nOS:${process.platform}`,
	});
}
async function showUpdateBox(mainWindow) {
	if (!mainWindow) mainWindow = BrowserWindow.getAllWindows()[0];
	return await dialog.showMessageBox(mainWindow, {
		title: "moko",
		message: "There are currently no updates available.",
	});
}

// type string (optional) - Can be normal, separator, submenu, checkbox or radio.
// https://www.electronjs.org/docs/latest/api/menu-item
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const testMenu = [
	{
		label: "testMenu",
		submenu: [
			{ type: "checkbox", label: "isTest", checked: true },
			{ role: "undo" },
			{ role: "redo" },
			{ role: "about" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			{ role: "pasteAndMatchStyle" },
			{ role: "selectAll" },
			{ role: "delete" },
			{ role: "minimize" },
			{ role: "close" },
			{ role: "quit" },
			{ role: "reload" },
			{ role: "forceReload" },
			{ role: "toggleDevTools" },
			{ role: "togglefullscreen" },
			{ role: "resetZoom" },
			{ role: "zoomIn" },
			{ role: "zoomOut" },
			{ role: "toggleSpellChecker" },
			{ role: "fileMenu" },
			{ role: "editMenu" },
			{ role: "viewMenu" },
			{ role: "windowMenu" },
		],
	},
	{
		label: "testMacMenu",
		submenu: [
			{ role: "appMenu" },
			{ role: "hide" },
			{ role: "hideOthers" },
			{ role: "unhide" },
			{ role: "showSubstitutions" },
			{ role: "toggleSmartQuotes" },
			{ role: "toggleSmartDashes" },
			{ role: "toggleTextReplacement" },
			{ role: "startSpeaking" },
			{ role: "stopSpeaking" },
			{ role: "front" },
			{ role: "zoom" },
			{ role: "toggleTabBar" },
			{ role: "selectNextTab" },
			{ role: "selectPreviousTab" },
			{ role: "showAllTabs" },
			{ role: "mergeAllWindows" },
			{ role: "moveTabToNewWindow" },
			{ role: "window" },
			{ role: "help" },
			{ role: "services" },
			{ role: "recentDocuments" },
			{ role: "clearRecentDocuments" },
			// { role: "shareMenu", sharingItem: "test" }, //会报错
		],
	},
];
// const menu = Menu.buildFromTemplate(testMenu);
// module.exports = testMenu;
const AppMenu = [
	// moko
	{
		label: app.name,
		submenu: [
			{ label: "About Moko Editor", click: async () => await showAboutBox() },
			{ label: "Check for Updates...", click: async () => await showUpdateBox() },
			{ type: "separator" },
			{ label: "Preferences", submenu: [{ label: "Settings" }] }, // TODO
			{ type: "separator" },
			{ role: "services" },
			{ type: "separator" },
			{ role: "hide" },
			{ role: "hideOthers" },
			{ role: "unhide" },
			{ type: "separator" },
			{ role: "quit" },
		],
	},
	// file
	{
		// DOING
		// label: "File",
		role: "fileMenu",
		submenu: [
			{ label: "open" },
			{ label: "save" },
			{ label: "saveAs" },
			{ type: "separator" },
			{ label: "Close Workspace" },
			{ label: "Close Editor" },
			isMac ? { role: "close" } : { role: "quit" },
		],
	},
	{
		label: "Edit",
		submenu: [
			{ role: "undo" },
			{ role: "redo" },
			{ type: "separator" },
			{ role: "cut" },
			{ role: "copy" },
			{ role: "paste" },
			...(isMac
				? [
						{ role: "pasteAndMatchStyle" },
						{ role: "delete" },
						{ role: "selectAll" },
						{ type: "separator" },
						{
							label: "Speech",
							submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
						},
				  ]
				: [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
		],
	},
	{
		label: "View",
		submenu: [
			{ role: "reload" },
			{ role: "forceReload" },
			{ role: "toggleDevTools" },
			{ type: "separator" },
			{ role: "resetZoom" },
			{ role: "zoomIn" },
			{ role: "zoomOut" },
			{ type: "separator" },
			{ role: "togglefullscreen" },
		],
	},
	{ role: "windowMenu" },
	{
		role: "help",
		submenu: [
			{ label: "Electron Documentation", click: async () => await shell.openExternal("https://electronjs.org") },
			{ label: "CodeMirror Documentation", click: async () => await shell.openExternal("https://codemirror.net/5/doc/manual.html") },
			{ label: "Obsidian Documentation", click: async () => await shell.openExternal("https://docs.obsidian.md/Home") },
			{ label: "Vscode Documentation", click: async () => await shell.openExternal("https://code.visualstudio.com/api") },
			{ type: "separator" },
			{ label: "Toggle DevTools", click: async (menuItem, window) => toggleDevTools(window), accelerator: "CmdOrCtrl+Option+i" }, // { role: "toggleDevTools" },
		],
	},
];

function toggleDevTools(window) {
	if (!window) {
		BrowserWindow.getAllWindows().forEach((win) => {
			if (win.webContents.isDevToolsFocused()) return win.webContents.closeDevTools();
		});
		BrowserWindow.getAllWindows().forEach((win) => {
			if (win.webContents.isDevToolsOpened()) return win.webContents.closeDevTools();
		});
		return console.log("no focused window");
	} else {
		if (window.webContents.isDevToolsOpened()) window.webContents.closeDevTools();
		else window.webContents.openDevTools({ mode: "detach" }); //left, right, bottom, undocked, detach
		// else window.webContents.openDevTools(); //left, right, bottom, undocked, detach
	}
}

const menu = Menu.buildFromTemplate(AppMenu);
Menu.setApplicationMenu(menu);
module.exports = AppMenu;

// click  menuItem, window, event
{
	/* <ref *1> MenuItem {
  label: 'Toggle DevTools',
  click: [Function (anonymous)],
  submenu: null,
  type: 'normal',
  role: null,
  accelerator: null,
  icon: null,
  sublabel: '',
  toolTip: '',
  enabled: true,
  visible: true,
  checked: false,
  acceleratorWorksWhenHidden: true,
  registerAccelerator: true,
  commandId: 58,
  userAccelerator: [Getter],
  menu: Menu {
    commandsMap: {
      '52': [MenuItem],
      '53': [MenuItem],
      '54': [MenuItem],
      '55': [MenuItem],
      '56': [MenuItem],
      '57': [MenuItem],
      '58': [Circular *1]
    },
    groupsMap: {},
    items: [
      [MenuItem],
      [MenuItem],
      [MenuItem],
      [MenuItem],
      [MenuItem],
      [MenuItem],
      [Circular *1]
    ]
  }
} BrowserWindow {
  setBounds: [Function (anonymous)],
  _events: [Object: null prototype] {
    blur: [Function (anonymous)],
    focus: [Function (anonymous)],
    show: [Function: visibilityChanged],
    hide: [Function: visibilityChanged],
    minimize: [Function: visibilityChanged],
    maximize: [Function: visibilityChanged],
    restore: [Function: visibilityChanged],
    closed: [ [Function (anonymous)], [Function (anonymous)] ],
    close: [Function (anonymous)]
  },
  _eventsCount: 9,
  _browserViews: [],
  devToolsWebContents: [Getter]
} {
  shiftKey: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
  triggeredByAccelerator: false
} */
}
