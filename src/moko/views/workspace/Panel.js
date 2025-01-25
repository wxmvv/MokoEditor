export class Panel {
	constructor(workspace, left = true) {
		this.id = Math.random().toString(36).substring(2, 9);
		this.moko = workspace.moko;
		this.containerEl = document.createElement("div");
		this.containerEl.classList.add("panel");
		this.left = left;
		if (this.left) {
			const firstChild = workspace.containerEl.firstChild;
			workspace.containerEl.insertBefore(this.containerEl, firstChild);
			this.containerEl.classList.add("panel-left");
		} else {
			workspace.containerEl.appendChild(this.containerEl);
			this.containerEl.classList.add("panel-right");
		}
		// this.children = []; //包含ribbon 和 panel
		this.collapsed = true;
	}

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

export default Panel;
