import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "cc.wxmvv.MokoEditor",
	appName: "moko",
	webDir: "app",
	loggingBehavior: "debug",
	backgroundColor: "#000000",
	zoomEnabled: false,
	android: {
		path: "android",
		webContentsDebuggingEnabled: true,
	},
	ios: {
		contentInset: "never",
		webContentsDebuggingEnabled: true,
	},
	plugins: {
		Keyboard: {
			resize: "native",
			style: "dark",
		},
		SplashScreen: {
			launchShowDuration: 8000,
			launchFadeOutDuration: 0,
			launchAutoHide: true,
			backgroundColor: "#000000",
			androidSplashResourceName: "splash",
			androidScaleType: "CENTER_CROP",
			splashFullScreen: false,
			splashImmersive: false,
		},
	},
	server: {
		androidScheme: "http",
	},
	// server: {
	// 	url: "http://127.0.0.1:5173", //这里设定是对应nextjs dev模式的端口，设定后可以热更新
	// 	cleartext: true,
	// },
	cordova: {},
};

export default config;
