// import SettingItem from "./SettingItem";

class Setting {
	constructor(container) {
		this.moko = container.moko;
		// section tab
		this.tabsBySection = {};
		this.headerSection = [];
		this.selectTabName = "General"; //默认为General
		// init el
		this.containerEl = container.containerEl.createDiv({ cls: "setting" });
		this.headerDiv = this.containerEl.createDiv({ cls: "setting-header" });
		this.contentDiv = this.containerEl.createDiv({ cls: "setting-content" });
		this.moko.addElement("setting", this.containerEl);
		this.init();
	}

	init() {
		this.registerHeaderSection("Options");
		this.registerHeaderSection("Plugins");
		this.registerTabBySection("Options", "General", 0);
		this.registerTabBySection("Options", "Editor", 1);
		this.registerTabBySection("Options", "FilesAndLinks", 2);
		this.registerTabBySection("Options", "Appearance", 3);
		this.registerTabBySection("Options", "Hotkey", 4);
		this.registerTabBySection("Options", "BuildInPlugins", 5);
		this.registerTabBySection("Options", "Others", 6);
		this.registerTabBySection("Plugins", "FileExplorer", 0);
		this.registerTabBySection("Plugins", "WordCounter", 1);
		this.selectTabName = "General";
	}
	load() {
		this.selectTabByName();
	}
	registerHeaderSection(headerSectionName) {
		if (!this.headerSection.includes(headerSectionName)) this.headerSection.push(headerSectionName); // 如果不存在就push
		this.tabsBySection[headerSectionName] = []; // 初始化
	}
	registerTabBySection(headerSectionName, tabName, sort) {
		if (!headerSectionName || !tabName) return console.log("%c[Setting] registerTabBySection:headerSectionName or tabName is null", "color: red");
		const tab = { name: tabName, sort: sort, components: [] };
		this.tabsBySection[headerSectionName].push(tab);
	}

	// 选择
	selectTabByName(name) {
		if (name) this.selectTabName = name;
		else this.selectTabName = "General";
		this.updateHeader();
		this.updateContent();
	}
	// Conetent
	updateContent() {
		if (!this.selectTabName) this.selectTabByName();
		this.contentDiv.empty();
		for (const sectionName of this.headerSection) {
			this.tabsBySection[sectionName].forEach((tab) => {
				if (tab.name === this.selectTabName) {
					tab.components.forEach((component) => {
						// component.onload();
						this.contentDiv.createDiv({ cls: component.name, text: component.desc });
					});
				}
			});
		}
	}

	// HEADER
	updateHeader() {
		this.headerDiv.empty();
		for (const sectionName of this.headerSection) {
			this.updateHeaderSection(sectionName);
		}
	}
	updateHeaderSection(sectionName) {
		const tabs = this.tabsBySection[sectionName];
		const containerEl = this.headerDiv.createDiv({ cls: `setting-header-tab-group ${sectionName}` });
		const titleEl = containerEl.createDiv({ cls: "setting-header-tab-group-title" });
		titleEl.textContent = sectionName;
		for (const tab of tabs) {
			const tabEl = containerEl.createDiv({ cls: "setting-header-tab clickable" });
			tabEl.addEventListener("click", () => this.selectTabByName(tab.name));
			tabEl.textContent = tab.name;
			if (tab.name === this.selectTabName) {
				tabEl.classList.add("active");
			}
		}
	}

	onunload() {}

	toggle() {
		if (this.hasShow()) {
			this.hide();
		} else {
			this.show();
		}
	}
	hasShow() {
		return document.getElementById("modal").classList.contains("open");
	}

	show() {
		document.getElementById("modal").classList.add("open");
		document.body.style.setProperty("--setting-width", "380px");
		document.body.style.setProperty("--setting-opacity", 1);
	}
	hide() {
		document.getElementById("modal").classList.remove("open");
		document.body.style.setProperty("--setting-width", "0px");
		document.body.style.setProperty("--setting-opacity", 0);
	}
	// MARK 信息
	setName(name) {
		this.nameEl.setText(name);
		return this;
	}

	setDesc(description) {
		this.descEl.setText(description);
		return this;
	}

	setClass(className) {
		this.settingEl.addClass(className);
		return this;
	}

	setTooltip(text, position) {
		lM(this.nameEl, text, position);
		return this;
	}

	setHeading() {
		this.settingEl.addClass("setting-item-heading");
		return this;
	}

	setDisabled(disabled) {
		this.settingEl.toggleClass("is-disabled", disabled);
		for (const component of this.components) {
			component.setDisabled(disabled);
		}
		return this;
	}
	setNoInfo() {
		this.infoEl.hide();
		return this;
	}
	// MARK 组件
	// addSlider 滑块
	addSlider(callback) {
		const slider = new OB(this.controlEl);
		this.components.push(slider);
		callback(slider);
		return this;
	}
	// addProgressBar 进度条
	addProgressBar(callback) {
		const progressBar = new IB(this.controlEl);
		this.components.push(progressBar);
		callback(progressBar);
		return this;
	}
	// addColorPicker 颜色选择
	addColorPicker(callback) {
		const colorPicker = new FB(this.controlEl);
		this.components.push(colorPicker);
		callback(colorPicker);
		return this;
	}
	// addDropdown 下拉框
	addDropdown(callback) {
		const dropdown = new PB(this.controlEl);
		this.components.push(dropdown);
		callback(dropdown);
		return this;
	}
	//  addMomentFormat 时间格式
	addMomentFormat(callback) {
		const momentFormat = new LB(this.controlEl);
		this.components.push(momentFormat);
		callback(momentFormat);
		return this;
	}
	// addTextArea 文本框
	addTextArea(callback) {
		const textArea = new AB(this.controlEl);
		this.components.push(textArea);
		callback(textArea);
		return this;
	}
	// addSearch 搜索框
	addSearch(callback) {
		const search = new DB(this.controlEl);
		this.components.push(search);
		callback(search);
		return this;
	}
	// addText 文本
	addText(callback) {
		const text = new TB(this.controlEl);
		this.components.push(text);
		callback(text);
		return this;
	}
	// addToggle 开关
	addToggle(callback) {
		const toggle = new xB(this.controlEl);
		this.components.push(toggle);
		callback(toggle);
		this.settingEl.addClass("mod-toggle");
		return this;
	}
	// addExtraButton 额外按钮 图标小按钮
	addExtraButton(callback) {
		const button = new SB(this.controlEl);
		this.components.push(button);
		callback(button);
		return this;
	}
	// addButton 按钮 文字按钮
	addButton(callback) {
		const button = new EB(this.controlEl);
		this.components.push(button);
		callback(button);
		return this;
	}
	then(callback) {
		callback(this);
		return this;
	}
	clear() {
		this.controlEl.empty();
		this.components = [];
		return this;
	}

	setVisibility(visible) {
		this.settingEl.toggle(visible);
		return this;
	}
}

export { Setting };
export default Setting;
