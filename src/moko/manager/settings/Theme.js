import Events from "../../model/Events";

class Theme extends Events {
	constructor(moko) {
		super();
		// this.setting = setting || {}; // 将 settings 作为属性保存
		this.moko = moko;
		this.init();
	}
	init() {
		// TODO 从本地存储中读取主题
		this._colorScheme = "system"; // system dark light
		this._prefersDarkMode = null; // bool Web 环境的 matchMedia 对象
		// Electron 监听器
		this.electronThemeChangeListener = null; // Electron 监听器
		this.webThemeChangeListener = null; // Web 环境监听器
		// 初始化设置主题
		this.addThemeListener();
		this.setColorScheme(this._colorScheme);
	}

	set colorScheme(colorScheme) {
		this._colorScheme = colorScheme;
		console.log("你好这里是set colorScheme", this._colorScheme);
	}
	get colorScheme() {
		console.log("你好这里是get colorScheme", this._colorScheme);
		return this._colorScheme;
	}

	get isDarkMode() {
		return this._prefersDarkMode;
	}
	// Set方法是用户使用的
	// 主题切换
	setEditorTheme(lightOrDark, theme) {
		if (lightOrDark === "light") {
			this.editorThemeLight = theme;
		} else if (lightOrDark === "dark") {
			this.editorThemeDark = theme;
		}
		this.setColorScheme(this._colorScheme);
	}
	// 主题切换 同时设置cm主题
	setColorScheme(colorScheme) {
		this._colorScheme = colorScheme;
		if (colorScheme === "system") {
			this.applySystem();
		} else if (colorScheme === "light") {
			this.applyLightOrDark(false);
		} else if (colorScheme === "dark") {
			this.applyLightOrDark(true);
		} else {
			this._colorScheme = "system";
			this.applySystem();
		}
	}

	// 主题切换方法
	changeColorScheme(isDarkMode) {
		document.body.classList.toggle("theme-dark", isDarkMode);
		document.body.classList.toggle("theme-light", !isDarkMode);
		this.trigger("theme-change", isDarkMode);
		// console.log("你好这里是changeColorScheme", isDarkMode);
	}
	applySystem() {
		this._prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
		this.changeColorScheme(this._prefersDarkMode);
	}
	applyLightOrDark(isDarkMode) {
		this._prefersDarkMode = isDarkMode;
		this.changeColorScheme(this._prefersDarkMode);
	}
	// 主题切换监听
	addThemeListener() {
		// 设置监听主题变化 electron
		if (window.electronTheme) {
			// 检查是否已存在监听器，避免重复添加
			if (!this.electronThemeChangeListener) {
				this.electronThemeChangeListener = (isDarkMode) => {
					if (this._colorScheme === "system") {
						this.changeColorScheme(isDarkMode);
					}
				};
				window.electronTheme.onThemeChange(this.electronThemeChangeListener);
			}
		} else {
			// 检查是否存在prefersDarkMode，如果不存在则添加
			if (!this._prefersDarkMode) {
				this._prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
			}

			// 检查是否已存在监听器，避免重复添加
			if (!this.webThemeChangeListener) {
				this.webThemeChangeListener = (event) => {
					if (this._colorScheme === "system") {
						this.changeColorScheme(event.matches);
					}
				};
				// Safari 可能不支持 addEventListener，使用 addListener 作为备用
				if (this._prefersDarkMode.addEventListener) {
					this._prefersDarkMode.addEventListener("change", this.webThemeChangeListener);
				} else if (this._prefersDarkMode.addListener) {
					this._prefersDarkMode.addListener(this.webThemeChangeListener); // Safari fallback
				}
			}
		}
	}
	// 暂时无用
	removeThemeListener() {
		// Electron 环境移除监听
		// if (this.electronThemeChangeListener && window.electronTheme) {
		// 	this.electronThemeChangeListener = null; // 清除引用
		// }
		// Web 环境移除监听
		if (this.webThemeChangeListener && this._prefersDarkMode) {
			this._prefersDarkMode.removeEventListener("change", this.webThemeChangeListener);
			this.webThemeChangeListener = null; // 清除引用
		}
	}
	toggleTheme() {
		if (document.body.classList.contains("theme-light")) {
			this.changeColorScheme(true);
		} else {
			this.changeColorScheme(false);
		}
	}
}

export { Theme };
export default Theme;
