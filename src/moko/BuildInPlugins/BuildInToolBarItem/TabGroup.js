import ToolBarItem from "../../views/content/ToolBarItem";
import "./TabGroup.css";
import Svg from "../../model/Svg";
import CloseSvg from "../../icons/x.svg?raw";

export class TabGroup extends ToolBarItem {
	onload() {
		this.pane = this.parent.parent;
		this.tabs = this.pane.tabs;
		this.tabsEl = {};
		this.updateTabs();
		this.pane.on("tab-update", this.updateTabs.bind(this));
		this.containerEl.setAttribute("tabindex", "-1");
		// this.pane.on("file-change", this.updateTabs.bind(this));
	}

	onunload() {}
	updateTabs() {
		this.containerEl.innerHTML = "";
		this.tabsEl = {};
		// console.log(this.tabs);
		this.tabs.forEach((file, index) => {
			
			const tabEl = this.containerEl.createDiv("tab");
			tabEl.classList.add("clickable");
			const tabCloseButtonEl = tabEl.createDiv("tab-close-button clickable");
			// const tabModifiedPointEl = tabEl.createDiv("tab-modified");
			const tabFileNameEl = tabEl.createDiv("tab-file-name");
			if (file.path === this.pane.currentTabPath) {
				tabEl.classList.add("active");
				this.currentTabIndex = index;
			}
			if (file.modified) {
				tabCloseButtonEl.classList.add("modified");
			}
			tabFileNameEl.textContent = file.name;
			tabCloseButtonEl.innerHTML = Svg({ id: "Close", svgRaw: CloseSvg, clickable: true });
			// tabModifiedPointEl.innerHTML = Svg({ id: "Indicator", svgRaw: IndicatorSvg });
			tabFileNameEl.addEventListener("click", () => this.selectTab(index));
			tabCloseButtonEl.addEventListener("click", () => this.closeFile(index));
			this.tabsEl[file.path] = tabEl;
		});
		this.emptyTabEl = this.containerEl.createDiv("empty-tab");
		this._updateHScrollPosition(this.currentTabIndex);
	}
	async selectTab(index) {
		const file = await this.tabs[index]; // this.moko.workspace.openInCurrentTab(file);
		this.pane.selectTab(file);
		// this.pane.setFile(file);
		this.containerEl.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active")); // 移除所有 Tab 的 active 类
		this.containerEl.children[index].classList.add("active"); // 为当前 Tab 添加 active 类
		// 切换到对应的文件内容 // this.switchToFile(this.tabs[index]);
	}
	// 关闭文件
	closeFile(index) {
		this.pane.closeTabByIndex(index);
	}

	// 更新水平滚动位置
	_updateHScrollPosition(index) {
		const itemWidth = this.containerEl.children[index].offsetWidth;
		const containerWidth = this.containerEl.offsetWidth;
		const itemLeft = this.containerEl.children[index].offsetLeft;
		const itemRight = itemWidth + itemLeft;
		if (itemLeft < this.containerEl.scrollLeft) this.containerEl.scrollLeft = itemLeft;
		else if (itemRight > this.containerEl.scrollLeft + containerWidth) this.containerEl.scrollLeft = itemRight - containerWidth;
	}
}

export default TabGroup;

//TODO
// a.addEventListener("dragstart", function (e) {
// 	i.workspace.onDragLeaf(e, i);
// }),
// a.addEventListener("contextmenu", function (e) {
// 	return i.onOpenTabHeaderMenu(e, a);
// }),
// a.addEventListener("mousedown", function (e) {
// 	1 === e.button && e.preventDefault();
// }),
// a.addEventListener("auxclick", function (e) {
// 	1 === e.button && i.view instanceof GF && o();
// });

// 切换到对应的文件内容
// switchToFile(file) {
// 	// 这里实现切换到对应文件内容的逻辑
// 	if (file) return;
// 	console.log(file);
// 	console.log(`Switching to file: ${file.name}`);
// }

// 添加新文件
// addFile(file) {
// 	this.tabs.push(file);
// 	this.updateTabs(); // 重新加载 Tab 项
// }
