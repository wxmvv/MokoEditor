import { Events } from "../../model/Events.js";

import EditorView from "../../views/content/EditorView.js";
// import FileView from "../model/pane/FileView.js";
import ImageView from "../../views/content/ImageView.js";
import WelcomeView from "../../views/content/WelcomeView.js";
import TestView from "../../views/content/TestView.js";

const ImageViewExtension = ["bmp", "png", "jpg", "jpeg", "gif", "svg", "webp", "avif"]; //fT
// const AudioViewExtension = ["mp3", "wav", "m4a", "3gp", "flac", "ogg", "oga", "opus"]; //mT
// const VideoViewExtension = ["mp4", "webm", "ogv", "mov", "mkv"];
// const PdfViewExtension = ["pdf"]; //vT
const EditorViewExtension = ["md", "mdx"]; //yT
// const bT = ["canvas"]; //bT
// const wT = ["json", "css", "js"]; //wT
// const kT = [].concat(ImageViewExtension, mT, gT, vT, EditorViewExtension, bT); //kT

export class ViewRegistry extends Events {
	constructor() {
		super();
		this.viewByType = {}; // ViewType string : ViewCreator
		this.typeByExtension = {}; // Extension string : ViewType string

		this.registerViewWithExtensions(EditorViewExtension, EditorView.VIEW_TYPE, (pane) => new EditorView(pane));
		this.registerViewWithExtensions(ImageViewExtension, ImageView.VIEW_TYPE, (pane) => new ImageView(pane));
		this.registerView(WelcomeView.VIEW_TYPE, (pane) => new WelcomeView(pane));
		this.registerView(TestView.VIEW_TYPE, (pane) => new TestView(pane));
	}

	registerView(viewType, viewCreator) {
		if (Object.prototype.hasOwnProperty.call(this.viewByType, viewType)) throw new Error(`Attempting to register an existing view type "${viewType}"`);
		this.viewByType[viewType] = viewCreator;
		this.trigger("view-registered", viewType); // "view-registered" event
	}

	unregisterView(viewType) {
		if (Object.prototype.hasOwnProperty.call(this.viewByType, viewType)) {
			delete this.viewByType[viewType];
			this.trigger("view-unregistered", viewType); // "view-unregistered" event
		}
	}

	registerViewWithExtensions(ViewExtensions, viewType, viewCreator) {
		this.registerView(viewType, viewCreator);
		this.registerExtensions(ViewExtensions, viewType);
	}

	registerExtensions(extensions, type) {
		for (const extension of extensions) {
			if (this.isExtensionRegistered(extension)) {
				throw new Error(`Attempting to register an existing file extension "${extension}"`);
			}
		}
		for (const extension of extensions) {
			this.typeByExtension[extension] = type;
		}
		this.trigger("extensions-updated"); // "extensions-updated" event
	}

	unregisterExtensions(extensions) {
		for (const extension of extensions) {
			delete this.typeByExtension[extension];
		}
		this.trigger("extensions-updated"); // "extensions-updated" event
	}

	isExtensionRegistered(extension) {
		return Object.prototype.hasOwnProperty.call(this.typeByExtension, extension);
	}

	getViewCreatorByType(extension) {
		return this.viewByType[extension];
	}

	getTypeByExtension(extension) {
		return this.typeByExtension[extension];
	}

	trigger(eventName, ...args) {
		super.trigger(eventName, ...args, false);
	}

	on(eventName, callback, context) {
		return super.on(eventName, callback, context);
	}
}

export default ViewRegistry;
