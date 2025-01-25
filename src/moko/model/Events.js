export class Events {
	constructor() {
		this._ = {};
	}

	on(eventName, callback, context) {
		const eventList = this._[eventName] || (this._[eventName] = []);
		const eventObject = { emitter: this, name: eventName, fn: callback, ctx: context };
		eventList.push(eventObject);
		return eventObject;
	}

	off(eventName, callback) {
		const events = this._;
		const eventList = events[eventName];

		if (!eventList) return; // 如果没有事件列表，直接返回
		const updatedList = eventList.filter((event) => event.fn !== callback); // 过滤掉要移除的回调函数

		if (updatedList.length > 0) events[eventName] = updatedList; // 更新事件列表或删除事件名
		else delete events[eventName];
	}

	offRef(eventRef) {
		if (!eventRef) return; // 如果没有事件引用，直接返回
		const eventName = eventRef.name;
		const events = this._;
		const eventList = events[eventName];

		if (!eventList) return; // 如果没有事件列表，直接返回
		const updatedList = eventList.filter((event) => event !== eventRef); // 过滤掉要移除的事件引用

		if (updatedList.length > 0) events[eventName] = updatedList; // 更新事件列表或删除事件名
		else delete events[eventName];
	}

	trigger(eventName, ...args) {
		const events = this._;
		const eventList = events[eventName];

		if (!eventList) return; // 如果没有事件列表，直接返回
		const eventsToTrigger = eventList.slice();
		
		for (let i = 0; i < eventsToTrigger.length; i++) {
			this.tryTrigger(eventsToTrigger[i], args);
		}
	}

	tryTrigger(eventObject, args) {
		try {
			eventObject.fn.apply(eventObject.ctx, args);
		} catch (error) {
			setTimeout(function () {
				throw error;
			}, 0);
		}
	}
}

export default Events;
