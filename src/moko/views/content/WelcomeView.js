import View from "../../model/View";

const WELCOME_VIEW_TYPE = "welcome";
const welcome_view_icon_name = "welcome";

export class WelcomeView extends View {
	constructor(pane, id) {
		super(pane, id ? `${id}-welcome-view` : "welcome-view");
		this.toolBars = {};
		this.viewType = WELCOME_VIEW_TYPE;
	}

	async onopen() {
		// this.containerEl.innerHTML = "欢迎使用 Moko Editor";
		this.containerEl.innerHTML = "";
		this.addLogo();
		this.addSettingBtn();
		this.addStartUpList();
		this.addRecentList();
		this.addMarkdownSamples();
	}
	async onclose() {}
	addSettingBtn() {
		this.settingBtnEl = this.containerEl.createDiv("welcome-view-setting-button link");
		this.settingBtnEl.innerHTML = "Open Setting";
		this.settingBtnEl.addEventListener("click", () => this.moko.setting.show());
	}
	addLogo() {
		this.logoEl = this.containerEl.createDiv("welcome-view-logo");
		this.imgEl = this.logoEl.createDiv("welcome-view-logo-img"); // this.imgEl.src = "assets/img/moko-logo.png";
		this.titleEl = this.logoEl.createDiv("welcome-view-logo-title");
		this.titleEl.innerHTML = "Moko";
	}
	addStartUpList() {
		this.startUpListEl = this.containerEl.createDiv("welcome-view-list start-up-list");
		this.startUpListTitleEl = this.startUpListEl.createDiv("welcome-view-list-title");
		this.newFileEl = this.startUpListEl.createDiv("welcome-view-list-item new-file-button link");
		this.openFIleEl = this.startUpListEl.createDiv("welcome-view-list-item open-file-button link");
		this.startUpListTitleEl.innerHTML = "Start up";
		this.newFileEl.innerHTML = "New File";
		this.newFileEl.addEventListener("click", () => this.moko.workspace.newFile());
		this.openFIleEl.innerHTML = "Open File";
		this.openFIleEl.addEventListener("click", () => this.moko.workspace.openFile());
	}
	addRecentList() {
		this.recentListEl = this.containerEl.createDiv("welcome-view-list recent-list");
		this.recentListTitleEl = this.recentListEl.createDiv("welcome-view-list-title");
		this.recent1El = this.recentListEl.createDiv("welcome-view-list-item recent-files-button link");
		this.recent2El = this.recentListEl.createDiv("welcome-view-list-item recent-files-button link");
		this.recentMoreEl = this.recentListEl.createDiv("welcome-view-list-item recent-files-button-more link");
		this.recentListTitleEl.innerHTML = "Recent Files";
		this.recent1El.innerHTML = "Recent 1";
		this.recent2El.innerHTML = "Recent 2";
		this.recentMoreEl.innerHTML = "More...";
	}
	addMarkdownSamples() {
		this.markdownSamplesEl = this.containerEl.createDiv("welcome-view-list markdown-samples");
		this.markdownSamplesTitleEl = this.markdownSamplesEl.createDiv("welcome-view-list-title");
		this.mdsampleEl = this.markdownSamplesEl.createDiv("welcome-view-list-item markdown-sample-button link");
		this.markdownSamplesTitleEl.innerHTML = "Markdown Samples";
		this.mdsampleEl.innerHTML = "Sample 1";
	}

	static get VIEW_TYPE() {
		return WELCOME_VIEW_TYPE;
	}
	getViewType() {
		return WELCOME_VIEW_TYPE;
	}
	getIcon() {
		return welcome_view_icon_name;
	}
	getDisplayText() {
		return "Welcome";
	}
}

export default WelcomeView;
