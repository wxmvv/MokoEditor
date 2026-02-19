const {
	Tray,
	powerMonitor,
	app,
	BrowserWindow,
	ipcMain,
	nativeTheme,
	dialog,
	Menu,
	globalShortcut,
	Notification
} = require('electron');
const path = require('node:path');
const fs = require('original-fs');
const menutemp = require('./electron-menu.cjs');
const process = require('process');
const platform = process.platform;
const isMac = platform === 'darwin';
const isWin = platform === 'win32';

// const isLinux = platform === "linux";
if (platform === 'darwin') {
	console.log('当前平台是 macOS'); // 在这里添加 macOS 特定的代码
} else if (platform === 'win32') {
	console.log('当前平台是 Windows'); // 在这里添加 Windows 特定的代码
} else if (platform === 'linux') {
	console.log('当前平台是 Linux'); // 在这里添加 Linux 特定的代码
} else {
	console.log('未知平台:', platform); // 在这里添加未知平台的处理代码
}

// 禁用GPU复合 为了解决报错
// https://github.com/electron/electron/issues/43415
// https://www.electronjs.org/zh/docs/latest/api/command-line-switches
app.commandLine.appendSwitch('disable-gpu-compositing');
// const a = app.commandLine.hasSwitch("disable-gpu");
// console.log("app.commandLine.hasSwitch('disable-gpu')", a);
// app.commandLine.appendSwitch("disable-gpu");
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'; // 关闭CSP警告

// MARK 初始化
console.log('Hello from Electron 👋');
let mainWindow;
// let devToolsWindow = null;
// let settingsWindow;
const winIpcHandles = {};
const winIpcOns = {};
const appIpcHandles = {};
const appIpcOns = {};
let vibrancy;

// MARK 入口
app.once('ready', function () {
	getInfo();
	createWindow();
	// MARK app IpcMain
	for (const handle in appIpcHandles) appIpcHandles[handle](app);
	for (const on in appIpcOns) appIpcOns[on](app);
	genHotkey();
});

// MARK 初始化热键
function genHotkey() {
	// 	const hk1 = globalShortcut.register("CommandOrControl+X", () => console.log("CommandOrControl+X is pressed")); // 注册一个'CommandOrControl+X' 快捷键监听器
	// 	if (!hk1) console.log("registration failed");
	// 	console.log(globalShortcut.isRegistered("CommandOrControl+X")); // 检查快捷键是否注册成功
	// 	globalShortcut.register("CommandOrControl+W", () => console.log("CommandOrControl+W is pressed"));
	// 	console.log(globalShortcut.isRegistered("CommandOrControl+W")); // 检查快捷键是否注册成功
}

// MARK app 事件
app.on('web-contents-created', (event, contents) => {
	contents.on('ipc-message', (event, channel, message) => {
		if (channel === 'set-theme') {
			nativeTheme.themeSource = message; // 'light', 'dark', 'system'
		}
	});
}); // 处理主题切换请求
app.on('window-all-closed', function () {
	// Quit when all windows are closed.
	if (process.platform !== 'darwin') app.quit(); // On macOS it is common for applications and their menu bar // to stay active until the user quits explicitly with Cmd + Q
});
app.on('activate', function () {
	// 针对 MacOS 的行为 https://www.electronjs.org/zh/docs/latest/tutorial/tutorial-first-app // On macOS it's common to re-create a window in the app when the  dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow(); //第一种
	// if (BrowserWindow.getAllWindows().length === 0) createWindow(); // 第二种 解决方式
});
app.on('will-quit', () => {
	globalShortcut.unregisterAll(); // 注销所有快捷键 // 注销快捷键 // globalShortcut.unregister("CommandOrControl+X");
});

// MARK 创建devtools窗口
// function toggleDevTools(mainWindow) {
// 	if (devToolsWindow && !devToolsWindow.isDestroyed()) {
// 		devToolsWindow.close();
// 		devToolsWindow = null;
// 	} else {
// 		devToolsWindow = new BrowserWindow({
// 			width: 800,
// 			height: 600,
// 			webContents: mainWindow.webContents,
// 		});
// 		mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
// 		mainWindow.webContents.openDevTools({ mode: "detach" });
// 	}
// }

// MARK 创建主窗口
// https://www.electronjs.org/docs/latest/api/base-window
function createWindow() {
	const state = loadWindowState();
	console.log('[state]', state);
	vibrancy = state.vibrancy || 'sidebar';
	mainWindow = new BrowserWindow({
		width: state.width || 450, // Default is 800
		height: state.height || 600, // Default is 600
		x: state.x || 0, // Default is to center the window.
		y: state.y || 0, // Default is to center the window.
		useContentSize: false, // Default is false.
		center: false, // Show window in the center of the screen. Default is false.
		minWidth: 450, // Default is 0
		minHeight: 600, // Default is 0
		maxWidth: 0, // Default is no limit 0
		maxHeight: 0, // Default is no limit 0
		resizable: true, // Default is true.
		movable: true, //macos windows only. Default is true.
		minimizable: true, //macos windows only. Default is true.
		maximizable: true, //macos windows only. Default is true.
		closable: true, //macos windows only. Default is true.
		focusable: true, //Default is true.
		alwaysOnTop: state.isAlwaysOnTop || false, // Default is false.
		fullscreen: state.isFullScreen || false, // Default is false.
		fullscreenable: true, // Default is true.
		simpleFullscreen: false, //macos only. Default is false.
		skipTaskbar: false, //macos windows only. ? Default is false.
		hiddenInMissionControl: false, //macos only. Default is false.
		kiosk: false, // Default is false.
		// title: "Moko",
		icon: path.join(__dirname, 'icon.png'), //TODO
		show: true, // Default is true.
		frame: false, // Default is true. https://www.electronjs.org/docs/latest/tutorial/window-customization#create-frameless-windows
		parent: null, // Default is null.
		modal: false, // Default is false.
		acceptFirstMouse: true, // macos only. Default is true.
		disableAutoHideCursor: false, // Whether to hide cursor when typing. Default is false.
		autoHideMenuBar: false, //  Auto hide the menu bar unless the Alt key is pressed. Default is false.  窗口菜单栏是否自动隐藏。 一旦设置，菜单栏将只在用户单击 Alt 键时显示。
		enableLargerThanScreen: false, // macos only. Enable the window to be resized larger than screen. Only relevant for macOS, as other OSes allow larger-than-screen windows by default. Default is false.
		backgroundColor: 'rgba(0,0,0,0)', // win.setBackgroundColor nativeTheme.shouldUseDarkColors ? "#000" : "#fff",
		hasShadow: true, // Default is true.
		opacity: 1, // macos windows only. Default is 1.
		darkTheme: false, // Forces using dark theme for the window, only works on some GTK+3 desktop environments. Default is false.
		transparent: false, // transparent boolean (optional) - Makes the window transparent. Default is false. On Windows, does not work unless the window is frameless.
		// type: "normal", //default is normal window
		visualEffectState: 'active', // macos only, followWindow active inactive
		titleBarStyle: isMac ? 'customButtonsOnHover' : ' hidden', //customButtonsOnHover  default hidden macOS-hiddenInset macOS-customButtonsOnHover
		titleBarOverlay: false, // ?
		trafficLightPosition: { x: 10, y: 6 }, // macos only
		roundedCorners: true, // macos only
		thickFrame: true, // Default is true.
		vibrancy: vibrancy || 'sidebar', // macos only // vibrancy?: ('appearance-based' 不存在 | 'titlebar' | 'selection' | 'menu' | 'popover' | 'sidebar' | 'header' | 'sheet' | 'window' | 'hud' | 'fullscreen-ui' | 'tooltip' | 'content' | 'under-window' | 'under-page');
		backgroundMaterial: 'acrylic', // windows only `auto`, `none`, `mica`, `acrylic` or `tabbed`
		// zoomToPageWidth: false, // macos only
		tabbingIdentifier: 'moko', // macos only
		webPreferences: {
			devTools: true,
			nodeIntegration: true,
			// nodeIntegrationInWorker: false, //Default is false  //多线程node https://www.electronjs.org/zh/docs/latest/tutorial/multithreading
			// nodeIntegrationInSubFrames
			preload: path.join(__dirname, 'electron-preload.cjs'), //预加载
			sandbox: false, //默认为false  true会将 Web 内容放入沙盒环境中，限制其访问 Node.js 环境
			// session
			// partition
			// zoomFactor: 1.0, // Default is 1.0.
			// javascript: true,
			webSecurity: true, //启用或禁用同源策略以及其他安全功能。为了安全性，建议保持 true
			allowRunningInsecureContent: false, //允许加载不安全的内容（如 HTTP 内容）默认false
			// images: true,
			// imageAnimationPolicy: "animate",
			// textAreasAreResizable: true,
			// webgl: true,
			// plugins: false,
			// experimentalFeatures: false,
			scrollBounce: true, // Default is false. macos only
			// enableBlinkFeatures
			// disableBlinkFeatures
			// defaultFontFamily: { standard: "Times New Roman",serif: "Times New Roman", sansSerif: "Arial",monospace: "Courier New",cursive: "Script",fantasy: "Impact" ,math: "Latin Modern Math"},
			// defaultFontSize: 16, //Default 16
			// defaultMonospaceFontSize: 13, //Default 13
			// minimumFontSize: 0, //Default 0
			// defaultEncoding: "utf-8", // Defaults to ISO-8859-1
			// backgroundThrottling : true, //Default is true
			// offscreen: false, //https://www.electronjs.org/docs/latest/tutorial/offscreen-rendering
			contextIsolation: false, //contextBridge,  //nodeIntegrationInWorker contextIsolation 和 nodeIntegrationInWorker 配合使用时，可以隔离网页的上下文，并允许 Web Worker 中使用 Node.js。
			// webviewTag: false, //Default is false
			// additionalArguments: [] //A list of strings that will be appended to process.argv
			// safeDialogs:false, //安全对话框
			// safeDialogsMessages: "", //安全对话框消息
			// disableDialogs: false , // Whether to disable dialogs completely. Overrides safeDialogs. Default is false.
			// navigateOnDragDrop : true, // Default is false. TODO
			// autoplayPolicy: "no-user-gesture-required",  //no-user-gesture-required, user-gesture-required, document-user-activation-required. Defaults to no-user-gesture-required.
			// disableHtmlFullscreenWindowResize : false,
			accessibleTitle: 'Moko',
			// spellcheck: true,
			// enableWebSQL: true,
			// v8CacheOptions: code, //none code bypassHeatCheck bypassHeatCheckAndEagerCompile
			// enablePreferredSizeMode:false,
			// transparent: true, // Default is true
			enableRemoteModule: false //默认值为 false。如果设置为 true，可以在渲染进程中使用 remote 模块访问主进程的对象和方法。出于安全考虑，不推荐启用。
		}
	});
	if (state.isMaximized) mainWindow.maximize();
	if (state.isMinimized) mainWindow.minimize();
	if (state.isVisible) mainWindow.show();
	// mainWindow.setRepresentedFilename(os.homedir()); // 设置窗口标题 只能用于原生窗口栏
	// mainWindow.setDocumentEdited(true);  //isDocumentEdited() // TODO 设置文件是否编辑 红灯中间圆点
	// app.addRecentDocument(path); // 添加最近打开的文件 //TODO
	// app.clearRecentDocuments(); // 清除最近打开的文件
	// app.setProxy()
	// MARK 监听App
	app.on('quit', () => {
		console.log('[app quit]');
	});
	// app.on("before-quit", () => console.log("[app before-quit]"));

	// MARK 监听window
	mainWindow.on('close', () => {
		console.log('[win close]');
		saveWindowState(mainWindow);
	});
	mainWindow.on('closed', function () {
		mainWindow = null;
		ipcMain.removeHandler('dialog:showOpenDialog');
	});

	// MARK 监听webContents
	mainWindow.webContents.on('devtools-opened', () => {
		mainWindow.webContents.executeJavaScript(`
			document.body.classList.add('devtools-opened');
		`);
		mainWindow.webContents.devToolsWebContents.executeJavaScript(`
			window.localStorage.setItem("devtools.theme", "auto");
			location.reload();
		`);
	});
	mainWindow.webContents.on('devtools-closed', () => {
		mainWindow.webContents.executeJavaScript(`
			document.body.classList.remove('devtools-opened');
		`);
	});
	mainWindow.webContents.on('did-frame-finish-load', async () => {
		if (state.isDevToolsOpened) {
			mainWindow.webContents.openDevTools({ mode: 'detach' }); //{mode: "detach"}
			mainWindow.webContents.executeJavaScript(
				`document.body.classList.add('devtools-opened');`
			);
		}
		if (mainWindow.webContents.isDevToolsOpened()) {
			mainWindow.webContents.executeJavaScript(`
				document.body.classList.contains('devtools-opened') ||
				document.body.classList.add('devtools-opened');
			`);
		}
	});

	// MARK 其他监听
	// 监听系统主题变化 检查当前系统是否是深色模式并将其发送到前端
	nativeTheme.on('updated', () => {
		mainWindow.webContents.send(
			'theme-changed',
			nativeTheme.shouldUseDarkColors
		);
	});
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send(
			'theme-changed',
			nativeTheme.shouldUseDarkColors
		);
	});

	// MARK 加载应用
	if (process.env.NODE_ENV === 'development') {
		console.log('[Electron] Vite 开发环境：加载localhost:5173');
		mainWindow.loadURL('http://localhost:5173/');
		// installExtensions();
	} else {
		// 生产环境：加载打包后的静态文件
		console.log('生产环境：加载打包后的静态文件');
		mainWindow.loadFile(path.join(__dirname, 'app', 'index.html'));
	}
	// MARK window IpcMain
	ipcMain.removeAllListeners(Object.keys(winIpcOns)); // 先清空所有handle 和 on
	for (const handle in winIpcHandles) ipcMain.removeHandler(handle);
	for (const handle in winIpcHandles) winIpcHandles[handle](mainWindow); // 然后循环添加handles
	// MARK 返回窗口
	return mainWindow;
}

// MARK app Ons Handles
// TODO 监听来自渲染进程的右键菜单请求 // menu 鼠标右键点击menu
appIpcOns['show-context-menu1'] = (app) => {
	ipcMain.on('show-context-menu', (event, menuItems) => {
		const template = menuItems.map((item) => {
			return {
				label: item.label,
				click: () =>
					event.sender.send('context-menu-action', item.label) // 将执行结果返回给渲染进程 //   event.returnValue = true;
			};
		});
		const contextMenu = Menu.buildFromTemplate(template);
		contextMenu.popup(mainWindow);
	});
};
appIpcOns['show-context-menu2'] = (app) => {
	ipcMain.on('show-context-menu', (event) => {
		const menu = Menu.buildFromTemplate(menutemp);
		console.log('menu', menu);
		menu.popup({ window: BrowserWindow.fromWebContents(event.sender) });
	});
};
appIpcOns['show-notification'] = (app) => {
	ipcMain.on('show-notification', (event, options) => {
		// console.log("show-notification 如果通知成功但是啥也看不到，请检查系统通知权限");
		// console.log("Notification.isSupported() : ", Notification.isSupported());
		if (!Notification.isSupported() && !options) return;
		const notification = new Notification({
			title: options.title || '通知title',
			subtitle: options.subtitle || '这是副标题subtitle',
			body: options.body || '这是一条通知body',
			// replyPlaceholder: "回复通知replyPlaceholder",
			// sound: "", // 可选，通知声音文件
			silent: false, // 可选，是否静音
			// urgency: low, //linux
			// timeoutType: 'default' 或 'never'. // win linux
			// closeButtonText: "关闭closeButtonText",
			// hasReply: true, // 可选，是否显示回复按钮
			// NotificationAction: [
			// 	{ type: "button", text: "Hello" },
			// 	{ type: "button", text: "world", title: "按钮2", action: "button2" },
			// ], // 可选，通知操作 // 其他需求https://www.electronjs.org/zh/docs/latest/api/structures/notification-action
			icon: path.join(__dirname, 'icon.png') // 可选，通知图标
		});
		notification.on('show', () => console.log('用户点击了通知'));
		notification.on('close', () => console.log('用户点击了通知'));
		notification.on('click', () => options.callback);
		notification.on('reply', (event, reply) =>
			console.log('用户回复了通知:', reply)
		);

		notification.show();
	});
};
appIpcHandles['notification:show'] = (app) => {
	ipcMain.handle('notification:show', (event, options) => {
		console.log(
			'show-notification 如果通知成功但是啥也看不到，请检查系统通知权限'
		);
		console.log(
			'Notification.isSupported() : ',
			Notification.isSupported()
		);
		if (!Notification.isSupported() && !options) return;
		const notification = new Notification({
			title: options.title || '通知title',
			subtitle: options.subtitle || '这是副标题subtitle',
			body: options.body || '这是一条通知body',
			// sound: "", // 可选，通知声音文件
			silent: false, // 可选，是否静音
			// urgency: low, //linux
			// timeoutType: 'default' 或 'never'. // win linux
			// closeButtonText: "关闭closeButtonText",
			hasReply: options.hasReply || false, // 可选，是否显示回复按钮
			replyPlaceholder:
				options.replyPlaceholder || '回复通知replyPlaceholder',
			// NotificationAction: [
			// 	{ type: "button", text: "Hello" },
			// 	{ type: "button", text: "world", title: "按钮2", action: "button2" },
			// ], // 可选，通知操作 // 其他需求https://www.electronjs.org/zh/docs/latest/api/structures/notification-action
			icon: path.join(__dirname, 'icon.png') // 可选，通知图标
		});
		notification.on('show', () =>
			mainWindow.webContents.send('notification-show')
		);
		notification.on('close', () =>
			mainWindow.webContents.send('notification-close')
		);
		notification.on('click', () =>
			mainWindow.webContents.send('notification-click')
		);
		notification.on('reply', (reply) =>
			mainWindow.webContents.send('notification-reply', reply)
		);
		notification.show();
	});
};

// MARK handles
winIpcHandles['dialog:showOpenDialog'] = (win) => {
	ipcMain.handle('dialog:showOpenDialog', async (event, options) => {
		const { filePaths } = await dialog.showOpenDialog(win, options || null);
		return filePaths;
	});
};
winIpcHandles['dialog:showSaveDialog'] = (win) => {
	ipcMain.handle('dialog:showSaveDialog', async (event, options) => {
		const { filePath } = await dialog.showSaveDialog(win, options);
		return filePath;
	});
};
winIpcHandles['dialog:showMessageBox'] = (win) => {
	ipcMain.handle('dialog:showMessageBox', async (event, options) => {
		return await dialog.showMessageBox(win, options);
	});
};
winIpcHandles['dialog:showCertificateTrustDialog'] = (win) => {
	ipcMain.handle(
		'dialog:showCertificateTrustDialog',
		async (event, options) => {
			return await dialog.showCertificateTrustDialog(win, options);
		}
	);
};
winIpcHandles['dialog:showErrorBox'] = (win) => {
	ipcMain.handle('dialog:showErrorBox', async (event, title, content) => {
		dialog.showErrorBox(title, content);
		return void 0;
	});
};
winIpcHandles['dialog:showAboutBox'] = (win) => {
	ipcMain.handle('dialog:showAboutBox', async () => {
		return await showAboutBox(win);
	});
};
winIpcHandles['menu:showVibrancyMenu'] = (win) => {
	ipcMain.handle('menu:showVibrancyMenu', async () => {
		createVibrancyMenu().popup({ window: win }); //// return vibrancy; // 返回当前窗口的 vibrancy
		return new Promise((resolve) => {
			ipcMain.once('menu:vibrancy-updated', (_, newVibrancy) => {
				resolve(newVibrancy);
			});
		});
	});
};

// MARK Ons
winIpcOns['preview-file'] = (win) => {
	ipcMain.on('preview-file', (event, filePath) => {
		win.previewFile(filePath); //macos only 快速预览
	});
};
winIpcOns['set-zoom-level'] = (win) => {
	ipcMain.on('set-zoom-level', (event, level) => {
		win.webContents.setZoomLevel(level);
	});
};
winIpcOns['get-zoom-level'] = (win) => {
	ipcMain.on('get-zoom-level', (event, level) => {
		console.log('get-zoom-level', event, level);
		const zoomLevel = win.webContents.getZoomLevel();
		event.reply('zoom-level-reply', zoomLevel);
	});
};
winIpcOns['set-zoom-factor'] = (win) => {
	ipcMain.on('set-zoom-factor', (event, level) => {
		win.webContents.setZoomFactor(level);
	});
};
winIpcOns['get-zoom-factor'] = (win) => {
	ipcMain.on('get-zoom-factor', (event, level) => {
		console.log('get-zoom-factor', event, level);
		const zoomFactor = win.webContents.getZoomFactor();
		event.reply('zoom-factor-reply', zoomFactor);
	});
};
winIpcOns['toggle-traffic-light'] = (win) => {
	ipcMain.on('toggle-traffic-light', (event, show) => {
		if (show) {
			win.setWindowButtonVisibility(true); // 显示默认的 traffic light
		} else {
			win.setWindowButtonVisibility(false); // 隐藏默认的 traffic light
		}
	}); // Traffic light 红绿灯显示隐藏
};
winIpcOns['hide-traffic-light'] = (win) => {
	ipcMain.on('hide-traffic-light', (event, show) => {
		console.log('hide-traffic-light', event, show);
		win.setWindowButtonVisibility(false); // 隐藏默认的 traffic light
	});
};
winIpcOns['show-traffic-light'] = (win) => {
	ipcMain.on('show-traffic-light', (event, show) => {
		console.log('show-traffic-light', event, show);
		win.setWindowButtonVisibility(true); // 显示默认的 traffic light
	});
};
winIpcOns['get-electron-window-info'] = (win) => {
	ipcMain.on('get-electron-window-info', (event) => {
		const windowInfo = {
			id: win.id,
			width: win.getSize()[0],
			height: win.getSize()[1],
			isMaximized: win.isMaximized(),
			isMinimized: win.isMinimized(),
			isFocused: win.isFocused(),
			isVisible: win.isVisible()
			// 你可以根据需要添加更多信息
		};
		event.reply('window-info', windowInfo);
	}); // 获取窗口信息
};

// MARK 具体实现
// 读取与保存窗口状态
function loadWindowState() {
	const userDataPath = app.getPath('userData');
	const windowStatePath = path.join(userDataPath, 'window-state.json');
	if (!fs.existsSync(windowStatePath)) {
		console.log('初次使用app,生成空状态');
		fs.writeFileSync(windowStatePath, '{}');
	}
	try {
		const data = fs.readFileSync(windowStatePath, 'utf8');
		if (!data) {
			console.log('初次使用app,生成空状态');
		}
		return JSON.parse(data);
	} catch (err) {
		console.log(err);
		return {};
	}
}
function saveWindowState(window) {
	const userDataPath = app.getPath('userData');
	const windowStatePath = path.join(userDataPath, 'window-state.json');
	const state = {
		x: window.getBounds().x, // x: window.getPosition()[0],
		y: window.getBounds().y, // y: window.getPosition()[1],
		width: window.getBounds().width, // width: window.getSize()[0],
		height: window.getBounds().height, // height: window.getSize()[1],
		isMaximized: window.isMaximized(),
		isMinimized: window.isMinimized(),
		isFullScreen: window.isFullScreen(),
		isDevToolsOpened: window.webContents.isDevToolsOpened(),
		isAlwaysOnTop: window.isAlwaysOnTop(),
		isVisible: window.isVisible(),
		vibrancy: vibrancy
	};
	// console.log("[save state]", state);
	fs.writeFileSync(windowStatePath, JSON.stringify(state));
}
// 创建 vibrancy 菜单
const vibrancyTypes = [
	null,
	'titlebar',
	'selection',
	'menu',
	'popover',
	'sidebar',
	'header',
	'sheet',
	'window',
	'hud',
	'fullscreen-ui',
	'tooltip',
	'content',
	'under-window',
	'under-page'
];
function createVibrancyMenu() {
	const vibrancyMenu = Menu.buildFromTemplate(
		vibrancyTypes.map((type) => ({
			label: type ? type : 'null',
			type: 'radio',
			checked: type === vibrancy,
			click: () => {
				mainWindow.setVibrancy(type);
				vibrancy = type;
				createVibrancyMenu(); // 更新菜单以反映新的 vibrancy 设置
				ipcMain.emit('menu:vibrancy-updated', null, vibrancy);
			}
		}))
	);
	return vibrancyMenu;
}
async function showAboutBox(mainWindow) {
	return await dialog.showMessageBox(mainWindow, {
		title: 'moko',
		message: 'Moko Editor',
		detail: `version: 0.0.1\nelectron:${process.versions.electron}\nchromium:${process.versions.chrome}\nnode:${process.versions.node}\nv8:${process.versions.v8}\nOS:${process.platform}`
	});
}

// MARK 获取系统信息
function getInfo() {
	const appPath = app.getAppPath();
	const homePath = app.getPath('home');
	const appDataPath = app.getPath('appData');
	const userDataPath = app.getPath('userData');
	const sessionDataPath = app.getPath('sessionData');
	const tempPath = app.getPath('temp');
	const exePath = app.getPath('exe');
	const modulePath = app.getPath('module');
	const desktopPath = app.getPath('desktop');
	const documentsPath = app.getPath('documents');
	const downloadsPath = app.getPath('downloads');
	const musicPath = app.getPath('music');
	const picturesPath = app.getPath('pictures');
	const videosPath = app.getPath('videos');
	const recentPath = isWin ? app.getPath('recent') : null; //windows only
	const logPath = app.getPath('logs');
	const crashDumpsPath = app.getPath('crashDumps');
	const windowStatePath = path.join(userDataPath, 'window-state.json');
	const paths = {
		appPath,
		homePath,
		appDataPath,
		userDataPath,
		sessionDataPath,
		tempPath,
		exePath,
		modulePath,
		desktopPath,
		documentsPath,
		downloadsPath,
		musicPath,
		picturesPath,
		videosPath,
		recentPath,
		logPath,
		crashDumpsPath,
		__dirname,
		__filename,
		windowStatePath
	};
	const locale = app.getLocale();
	const systemLocale = app.getSystemLocale();
	const preferredSystemLanguages = app.getPreferredSystemLanguages();
	const language = {
		locale,
		systemLocale,
		preferredSystemLanguages
	};
	const appMetrics = app.getAppMetrics();
	// const GPUInfo = app.getGPUInfo("basic"); //basic complete 这个会报错
	const GPUFeatureStatus = app.getGPUFeatureStatus();
	const badgeCount = app.getBadgeCount();
	const loginItemSettings = app.getLoginItemSettings();
	// const systemIdleState = powerMonitor.getSystemIdleState();
	const systemIdleTime = powerMonitor.getSystemIdleTime();
	const currentThermalState = powerMonitor.getCurrentThermalState();
	const isOnBattery = powerMonitor.isOnBatteryPower();
	const powerMonitorInfo = {
		// systemIdleState,
		systemIdleTime,
		currentThermalState,
		isOnBattery
	};

	const creationTime = process.getCreationTime();
	const heapStatistics = process.getHeapStatistics();
	const blinkMemoryInfo = process.getBlinkMemoryInfo();
	// const processMemoryInfo = process.getProcessMemoryInfo();  // 这个会报错
	const systemMemoryInfo = process.getSystemMemoryInfo();
	const systemVersion = process.getSystemVersion();
	const CPUUsage = process.getCPUUsage();

	const processInfo = {
		creationTime,
		heapStatistics,
		blinkMemoryInfo,
		// processMemoryInfo,
		systemMemoryInfo,
		systemVersion,
		CPUUsage
	};
	const processProperties = {
		defaultApp: process.defaultApp,
		arch: process.arch,
		argv: process.argv,
		argv0: process.argv0,
		platform: process.platform,
		pid: process.pid,
		ppid: process.ppid,
		uptime: process.uptime(),
		versions: process.versions,
		version: process.version
		// env: process.env,  // 会报错
	};

	ipcMain.on('app:getPaths', (event) => {
		event.returnValue = paths;
		// event.sender.send("getPaths", paths);
	});
	ipcMain.on('app:getInfo', (event) => {
		event.returnValue = {
			paths,
			language,
			appMetrics,
			powerMonitorInfo,
			// GPUInfo,
			GPUFeatureStatus,
			badgeCount,
			loginItemSettings,
			processInfo,
			processProperties
		};
	});
}

// MARK 安装 devtools 插件
async function installExtensions() {
	const {
		default: installExtension,
		REACT_DEVELOPER_TOOLS
	} = require('electron-devtools-installer');
	await installExtension(REACT_DEVELOPER_TOOLS);
}
