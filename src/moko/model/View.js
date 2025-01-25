/* eslint-disable @typescript-eslint/no-unused-vars */
import Component from "./Component";
// NF

// DONE

export class View extends Component {
	constructor(parent, id) {
		super();
		this.id = id || randomId();
		this.parent = parent;
		this.moko = parent.moko;
		this.pane = parent.pane;
		this.toolBars = {};
		this.containerEl = parent.containerEl.createDiv(id ? `${id} split-content-view` : "split-content-view");
		this.containerEl.setAttribute("data-type", this.getViewType());
		this.icon = "lucide-file";
		this.state = {};
		this.navigation = true; // 是否可以导航
		this.closeable = true; // 是否可以关闭
		this.viewType = "view"; // 视图类型 暂时无用
	}
	// DONE override
	async onopen() {}
	async onclose() {}
	async onload() {}
	async onunload() {}

	getFile() {
		return null;
	}
	getViewType() {
		return "view";
	}
	getDisplayText() {
		return "";
	}
	getIcon() {
		return this.icon ? this.icon : "lucide-file";
	}
	async setState(state, options) {}
	setEphemeralState() {}
	getState() {
		return {};
	}
	getEphemeralState() {
		return {};
	}
	// MARK toolbar
	addToolBarById(toolBarId) {
		if (this.toolBars[toolBarId]) return;
		this.toolBars[toolBarId] = this.moko.ViewRegistry.getToolbarById(toolBarId)(this);
		for (const toolBar of Object.values(this.toolBars)) {
			toolBar.load();
			this.containerEl.insertBefore(this.toolBars[toolBarId].containerEl, this.editor.containerEl);
		}
	}

	// DONE don't override
	async open(element) {
		element.appendChild(this.containerEl); // 将容器添加到指定元素中
		await this.load(); // 加载相关内容
		await this.onopen(); // 调用打开后的处理
	}
	async close() {
		this.containerEl.detach(); // 从 DOM 中移除容器
		this.unload(); // 卸载相关内容
		await this.onclose(); // 调用关闭后的处理
	}
	// TODO 暂时无用
	handleCut(e) {}
	handlePaste(e) {}
	handleCopy(e) {}
	focus() {
		this.containerEl.focus();
	}
}

export default View;
