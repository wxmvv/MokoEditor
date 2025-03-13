export class InternalNotification {
	constructor(moko) {
		this.moko = moko;
		this.containerEl = moko.containerEl.createDiv("notifications-container");
		this.items = [];
	}

	addItem(title, message) {
		const item = this.containerEl.createDiv("notification-item");
		item.createDiv("notification-title").setText(title);
		item.createDiv("notification-message").setText(message);
		const closeEl = item.createDiv("notification-close");
		closeEl.setText("×");
		closeEl.addEventListener("click", () => this.removeItem(item));
		this.items.push(item);
		return item;
	}
	removeItem(item) {
		item.remove();
		this.items = this.items.filter((i) => i !== item);
	}
}

export default InternalNotification;
