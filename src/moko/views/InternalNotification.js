export class InternalNotification {
	constructor(moko) {
		this.moko = moko;
		this.containerEl = moko.containerEl.createDiv("notifications-container");
		this.items = [];
	}
	static get instance() {
		if (!this._instance) {
			this._instance = new Notification();
		}
		return this._instance;
	}
	addItem(title, message) {
		const item = this.containerEl.createDiv("notification-item");
		item.createDiv("notification-title").setText(title);
		item.createDiv("notification-message").setText(message);
		const closeEl = item.createDiv("notification-close");
		closeEl.addEventListener("click", (index) => this.removeItem(index));
		this.items.push(item);
		return item;
	}
	removeItem(index) {
		const item = this.items[index];
		item.remove();
		this.items.splice(index, 1);
	}
}

export default InternalNotification;
