interface Record {
	file?: string;
	action?: string;
	desc?: string;
	ref?: object;
	time?: number;
}

class ProgressTracker {
	progress: number;
	total: number;
	current: number;
	records: Record[];
	logLevel: string;
	progressCallback: (() => void) | undefined;
	_instance: ProgressTracker | null = null;

	constructor(
		total = 0,
		logLevel = "notice",
		callback = () => {
			console.log("progressCallback");
		}
	) {
		this.progress = 0;
		this.total = total;
		this.current = 0;
		// this.interval = 0;
		this.progressCallback = callback;
		this.records = [];
		this.logLevel = logLevel; //  "silent", "error", "warn", "notice", "http", "info", "verbose", or "silly"

		window.progressTracker = this;
	}
	// static get instance() {
	// 	if (!this._instance) {
	// 		this._instance = new ProgressTracker();
	// 	}
	// 	return this._instance;
	// }

	addRecord({ file, action, desc, ref = {}, time = new Date().getTime() }: { file: string; action: string; desc: string; ref?: object; time?: number }) {
		this.records.push({ file, action, desc, time });
		this.current++;
		if (this.logLevel == "info") {
			console.log(`[ProgressTracker]`, desc, { file, action, desc, ref, time });
		} else if (this.logLevel == "notice") {
			console.log(`[ProgressTracker]`, desc, file);
		} else if (this.logLevel == "error") {
			console.log(`[ProgressTracker]`, desc, { file, action, desc, ref, time });
		} else if (this.logLevel == "none") {
			// do nothing
		} else {
			// do nothing
		}
	}
	setTotal(total: number) {
		this.total = total;
	}

	calculateProgress() {
		if (this.total > 0) {
			this.progress = Math.round((this.current / this.total) * 100);
		}
	}

	setProgressCallback(callback: () => void) {
		this.progressCallback = callback;
	}
}

export default ProgressTracker;
export { ProgressTracker };
