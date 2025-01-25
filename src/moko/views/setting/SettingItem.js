export class SettingItem {
	constructor(containerEl) {
		this.settingEl = containerEl.createDiv("setting-item");
		this.infoEl = this.settingEl.createDiv("setting-item-info");
		this.controlEl = this.settingEl.createDiv("setting-item-control");
		this.nameEl = this.infoEl.createDiv("setting-item-name");
		this.descEl = this.infoEl.createDiv("setting-item-desc");
		this.components = [];
	}
	// ??
	// setTooltip(text, position) {
	// 	lM(this.nameEl, text, position);
	// 	return this;
	// }
	// https://docs.obsidian.md/Plugins/User+interface/Settings
	setHeading() {
		this.settingEl.addClass("setting-item-heading");
		return this;
	}
	setBanner() {
		this.settingEl.addClass("setting-item-banner");
		return this;
	}
	setClass(className) {
		this.settingEl.addClass(className);
		return this;
	}
	setName(name) {
		this.nameEl.setText(name);
		return this;
	}
	setDesc(description) {
		this.descEl.setText(description);
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
	// control
	addButton(callback) {
		const button = new EB(this.controlEl);
		this.components.push(button);
		callback(button);
		return this;
	}

	addExtraButton(callback) {
		const button = new SB(this.controlEl);
		this.components.push(button);
		callback(button);
		return this;
	}

	addToggle(callback) {
		const toggle = new xB(this.controlEl);
		this.components.push(toggle);
		callback(toggle);
		this.settingEl.addClass("mod-toggle");
		return this;
	}

	addText(callback) {
		const text = new Text(this.controlEl);
		this.components.push(text);
		callback(text);
		return this;
	}

	addSearch(callback) {
		const search = new DB(this.controlEl);
		this.components.push(search);
		callback(search);
		return this;
	}

	addTextArea(callback) {
		const textArea = new AB(this.controlEl);
		this.components.push(textArea);
		callback(textArea);
		return this;
	}

	addMomentFormat(callback) {
		const momentFormat = new LB(this.controlEl);
		this.components.push(momentFormat);
		callback(momentFormat);
		return this;
	}

	addDropdown(callback) {
		const dropdown = new PB(this.controlEl);
		this.components.push(dropdown);
		callback(dropdown);
		return this;
	}

	addColorPicker(callback) {
		const colorPicker = new FB(this.controlEl);
		this.components.push(colorPicker);
		callback(colorPicker);
		return this;
	}

	addProgressBar(callback) {
		const progressBar = new IB(this.controlEl);
		this.components.push(progressBar);
		callback(progressBar);
		return this;
	}

	addSlider(callback) {
		const slider = new OB(this.controlEl);
		this.components.push(slider);
		callback(slider);
		return this;
	}
	// then
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

export default SettingItem;
