class Modal {
	constructor(moko) {
		this.moko = moko;
		if (!document.getElementById("modal")) {
			const modalDiv = document.createElement("div");
			modalDiv.id = "modal";
			modalDiv.classList.add("modal-overlay");
			modalDiv.addEventListener("click", (event) => {
				if (event.target === event.currentTarget) {
					this.closeModal();
				}
			});
			document.body.appendChild(modalDiv);
		}
		this.modalEl = document.getElementById("modal");
		this.containerEl = this.modalEl.createDiv("modal-container");
		this.isOpen = false;
		// TODO
		// this.view = null;
		this.moko.addElement("modal", this.containerEl);
	}
	closeModal() {
		document.getElementById("modal").classList.remove("open");
		document.body.style.setProperty("--setting-width", "0px");
		document.body.style.setProperty("--setting-opacity", 0);
	}
}

export default Modal;
