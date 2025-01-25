export class Component {
	constructor() {
		this._loaded = false;
		this._events = [];
		this._children = [];
	}
	async load() {
		if (!this._loaded) {
			this._loaded = true;
			await this.onload();
			const childrenCopy = this._children.slice();
			for (let i = 0; i < childrenCopy.length; i++) {
				childrenCopy[i].load();
			}
		}
	}

	async onload() {}

	async unload() {
		if (this._loaded) {
			this._loaded = false;

			while (this._children.length > 0) {
				this._children.pop().unload();
			}

			while (this._events.length > 0) {
				this._events.pop()();
			}

			this.onunload();
		}
	}

	async onunload() {}

	addChild(child) {
		this._children.push(child);
		if (this._loaded) {
			child.load();
		}
		return child;
	}

	removeChild(child) {
		const children = this._children;
		const index = children.indexOf(child);
		if (index !== -1) {
			children.splice(index, 1);
			child.unload();
		}
		return child;
	}

	register(event) {
		this._events.push(event);
	}

	registerEvent(eventRef) {
		this.register(() => eventRef.e.offref(eventRef));
	}

	registerDomEvent(element, eventName, callback, options) {
		element.addEventListener(eventName, callback, options);
		this.register(() => element.removeEventListener(eventName, callback, options));
	}

	registerScopeEvent(scopeEvent) {
		this.register(() => scopeEvent.scope.unregister(scopeEvent));
	}

	registerInterval(intervalId) {
		this.register(() => clearInterval(intervalId));
		return intervalId;
	}
}

export default Component;
