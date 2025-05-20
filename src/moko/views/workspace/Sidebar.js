export class Sidebar {
	constructor(workspace, isPrimary = true) {
		this.id = Math.random().toString(36).substring(2, 9);
		this.moko = workspace.moko;
		this.containerEl = document.createElement("div");
		this.containerEl.classList.add("panel");
		this.isPrimary = isPrimary;
		if (this.isPrimary) {
			const firstChild = workspace.containerEl.firstChild;
			workspace.containerEl.insertBefore(this.containerEl, firstChild);
			this.containerEl.classList.add("panel-left");
		} else {
			workspace.containerEl.appendChild(this.containerEl);
			this.containerEl.classList.add("panel-right");
		}
		// this.children = []; //包含ribbon 和 panel
		this.collapsed = true; // 是否展开
		this.enbledSiderbarList = {};
		this.activeSidebar = null;
		this.activeSidebarType = null;
	}

	loadSidebarView(SidebarTypeName) {
		this.enbledSiderbarList[SidebarTypeName] = this.moko.SidebarRegistry.sidebarByType[SidebarTypeName](this); // 传参
		this.enbledSiderbarList[SidebarTypeName].containerEl.style.display = "none";
		this.enbledSiderbarList[SidebarTypeName].load();
	}

	loadSidebarViews(SidebarTypeNames) {
		if (!SidebarTypeNames || SidebarTypeNames.length === 0) return;
		for (const SidebarTypeName of SidebarTypeNames) this.loadSidebarView(SidebarTypeName);
	}

	switchSidebar(typeName) {
		Object.keys(this.enbledSiderbarList).forEach((sidebarType) => {
			if (sidebarType !== typeName) this.enbledSiderbarList[sidebarType].containerEl.style.display = "none"; // 遍历所有 panel，将除当前 PanelTypeName 之外的所有 panel 隐藏
		});
		this.setActiveSidebar(this.enbledSiderbarList[typeName]);
		this.activeSidebarType = typeName;
		this.activeSidebar.containerEl.style.display = "";
	}

	setActiveSidebar(sidebar) {
		this.activeSidebar = sidebar;
	}
	setActiveSidebarType(type) {
		this.activeSidebarType = type;
	}

	toggleSidebarByType(TypeName) {
		if (Object.keys(this.enbledSiderbarList).includes(TypeName)) {
			if (this.collapsed) {
				this.switchSidebar(TypeName);
				this.expand();
			} else {
				if (this.activeSidebarType == TypeName) {
					if (this.setActiveType) this.setActiveType.focus(); // 宽度问题
					this.collapse();
				} else {
					this.switchPanel(TypeName);
					this.expand();
				}
			}
		}
	}
	// DOING 区分primary 和 secondary

	collapse() {
		document.body.style.setProperty("--panel-width-overlay", "0");
		document.body.style.setProperty("--panel-opacity", 0);
		document.body.style.setProperty("--panel-border-right", "none");
		document.getElementsByClassName("workspace")[0].classList.remove("left-panel-open");
		this.collapsed = true;
	}

	expand() {
		document.body.style.setProperty("--panel-width-overlay", "var(--panel-width)");
		document.body.style.setProperty("--panel-opacity", 1);
		document.body.style.setProperty("--panel-border-right", "var(--panel-border)");
		document.getElementsByClassName("workspace")[0].classList.add("left-panel-open");
		this.collapsed = false;
	}

	toggle() {
		if (this.collapsed) {
			this.expand();
		} else {
			this.collapse();
		}
	}
}

export default Sidebar;
