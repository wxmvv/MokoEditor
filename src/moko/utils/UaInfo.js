import { UAParser } from "ua-parser-js";

class UaInfo {
	// uap doc
	// https://docs.uaparser.dev/list/device/type.html
	constructor() {
		this.ua = navigator.userAgent;
		const { result, browser, cpu, device, os, engine,ua } = UAParser(this.ua);
		this.uap = result;
		this.device = device;
		this.os = os;
		this.browser = browser;
		this.engine = engine;
		this.cpu = cpu;
		this.isElectron = ua.includes("Electron") || false; // this.isElectron = browser.is("electron") || false;
		this.isDesktop = browser.is("electron") || false;
		this.isMobile = device.is("mobile") || false;
		this.isDesktopApp = browser.is("electron") || false;
		this.isMobileApp = device.is("mobile") || false;
		this.isIosApp = os.is("iOS") || false;
		this.isAndroidApp = os.is("Android") || false;
		this.isPhone = device.is("mobile") || false;
		this.isTablet = device.is("tablet") || false;
		this.isSafari = browser.is("safari") || false;
		this.isMacOS = os.is("macOS") || false;
		this.isArm = cpu.is("arm") || false;
		this.isWin = os.is("Windows") || false;
		this.isLinux = os.is("Linux") || false;
		// this.resourcePathPrefix =  "file:///",
		// this.mobileDeviceHeight = 0,
		// this.mobileKeyboardHeight = 0,
		// this.mobileSoftKeyboardVisible = !1,
	}
	get canExportPdf() {
		return this.isDesktopApp;
	}
	get canPopoutWindow() {
		return Qt.isDesktopApp && Qt.isDesktop;
	}
	get canStackTabs() {
		return !Qt.isPhone;
	}
	get canSplit() {
		return !Qt.isPhone;
	}
	get canDisplayRibbon() {
		return !Qt.isPhone;
	}
}

export { UaInfo };
export default UaInfo;
