class ProgressBar {
	constructor(containerEl, overlay = true, logo = true, doc = activeDocument) {
		this.showTimeout = 0;
		this.doc = doc;
		this.containerEl = containerEl;
		this.el = createDiv({ cls: "progress-bar" });
		const container = (this.el = createDiv({ cls: "progress-bar" }));
		// console.log(container);
		this.titleEl = container.createDiv({ cls: "progress-bar-title LogoText" });
		if (logo) this.titleEl.setText("Moko");
		container.createDiv({ cls: "loader-container" }, (loader) => {
			this.messageEl = loader.createDiv({ cls: "progress-bar-message u-center-text" });
			this.lineEl = loader.createDiv({ cls: "loader" });
		});
		this.overlay = overlay;
		this.logo = logo;
		this.consoleLog = false;

		// this.messageEl = container.createDiv({ cls: "progress-bar-message u-center-text" });
		// this.lineEl = container.createDiv({ cls: "loader" });

		// container.createDiv("progress-bar-indicator", (indicator) => {
		// 	indicator.createDiv("progress-bar-line");
		// 	this.lineEl = indicator.createDiv("progress-bar-subline");
		// 	this.line1El = indicator.createDiv("progress-bar-subline mod-increase");
		// 	this.line2El = indicator.createDiv("progress-bar-subline mod-decrease");
		// });

		container.addEventListener("click", (e) => {
			e.preventDefault();
		});

		this.setUnknownProgress();
	}

	static get instance() {
		if (!this._instance) {
			this._instance = new ProgressBar();
		}
		return this._instance;
	}

	delayedShow() {
		if (!this.el.isShown()) {
			this.doc.body.appendChild(this.el);
			this.el.style.opacity = "0";
			this.showTimeout = this.doc.win.setTimeout(() => {
				this.show();
			}, 300);
		}
		return this;
	}

	show() {
		window.clearTimeout(this.showTimeout);
		this.showTimeout = 0;
		// console.log(this.containerEl);
		if (this.containerEl) this.containerEl.appendChild(this.el);
		else this.doc.body.appendChild(this.el);
		this.el.style.opacity = "";
		return this;
	}

	hide() {
		window.clearTimeout(this.showTimeout);
		this.showTimeout = 0;
		this.el.remove();
		return this;
	}
	delayHide(delayDuration = 300) {
		window.clearTimeout(this.showTimeout);
		setTimeout(() => {
			this.showTimeout = 0;
			this.el.remove();
		}, delayDuration);
		if (this.consoleLog) console.log("Initialize Done");
		return this;
	}

	setMessage(message) {
		this.messageEl.setText(message);
		if (this.consoleLog) console.log(message);
		return this;
	}

	setUnknownProgress() {
		// this.lineEl.hide();
		this.lineEl.show();
		// this.line1El.show();
		// this.line2El.show();
		return this;
	}

	setProgress(current, total) {
		this.lineEl.show();
		// this.line1El.hide();
		// this.line2El.hide();

		const percentage = ((current / total) * 100).toFixed(4);
		this.lineEl.style.width = `${percentage}%`;
		return this;
	}
}

// 导出 ProgressBar 类
export default ProgressBar;
