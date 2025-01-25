import View from "../../model/View";

const TEST_VIEW_TYPE = "test";
const test_view_icon_name = "test";

export class TestView extends View {
	constructor(pane, id) {
		super(pane, id ? `${id}-welcome-view` : "welcome-view");
		this.toolBars = {};
		this.viewType = TEST_VIEW_TYPE;
	}

	async onopen() {
		// this.containerEl.innerHTML = "欢迎使用 Moko Editor";
		this.containerEl.innerHTML = "";
		this.addTest();
		this.addSettingBtn();
		this.addTestBox();
	}
	async onclose() {}
	addTest() {
		this.logoEl = this.containerEl.createDiv("welcome-view-logo");
		this.imgEl = this.logoEl.createDiv("welcome-view-logo-img"); // this.imgEl.src = "assets/img/moko-logo.png";
		this.titleEl = this.logoEl.createDiv("welcome-view-logo-title");
		this.titleEl.innerHTML = "Moko Test View";
	}
	addSettingBtn() {
		this.settingBtnEl = this.containerEl.createDiv("welcome-view-setting-button link");
		this.settingBtnEl.innerHTML = "Open Setting";
		this.settingBtnEl.addEventListener("click", () => this.moko.setting.show());
	}

	addTestBox() {
		this.startUpListEl = this.containerEl.createDiv("welcome-view-list start-up-list");
		this.startUpListTitleEl = this.startUpListEl.createDiv("welcome-view-list-title");
		this.startUpListTitleEl.innerHTML = "Test Box";

		// MARK 在这里添加测试
		this.test1El = this.startUpListEl.createDiv("welcome-view-list-item test-button link");
		this.test1El.innerHTML = "Test 1";
		this.test1El.addEventListener("click", () => this.moko.workspace.newFile());

		this.test2El = this.startUpListEl.createDiv("welcome-view-list-item test-button link");
		this.test2El.innerHTML = "Test 2";
		this.test2El.addEventListener("click", () => this.moko.workspace.newFile());

		this.test3El = this.startUpListEl.createDiv("welcome-view-list-item test-button link");
		this.test3El.innerHTML = "Test 3";
		this.test3El.addEventListener("click", () => this.moko.workspace.newFile());
	}

	static get VIEW_TYPE() {
		return TEST_VIEW_TYPE;
	}
	getViewType() {
		return TEST_VIEW_TYPE;
	}
	getIcon() {
		return test_view_icon_name;
	}
	getDisplayText() {
		return "Test";
	}
}

export default TestView;
