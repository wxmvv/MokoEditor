/* eslint-disable @typescript-eslint/no-explicit-any */

// import moko from "../moko/moko.js";
declare global {
	interface Window {
		moko: moko;
		progressTracker: ProgressTracker;
	}
	interface Element extends Node {
		find(selector: string): Element | null;
		findAll(selector: string): HTMLElement[];
		findAllSelf(selector: string): HTMLElement[];
	}
	interface HTMLElement extends Element {
		find(selector: string): HTMLElement;
		findAll(selector: string): HTMLElement[];
		findAllSelf(selector: string): HTMLElement[];
	}
	interface DocumentFragment extends Node, NonElementParentNode, ParentNode {
		find(selector: string): HTMLElement;
		findAll(selector: string): HTMLElement[];
	}

	interface DomElementInfo {
		/**
		 * The class to be assigned. Can be a space-separated string or an array of strings.
		 */
		cls?: string | string[];
		/**
		 * The textContent to be assigned.
		 */
		// text?: string | DocumentFragment;
		text?: string | null;
		/**
		 * HTML attributes to be added.
		 */
		attr?: {
			// [key: string]: string | number | boolean | null;
			[key: string]: string;
		};
		/**
		 * HTML title (for hover tooltip).
		 */
		title?: string;
		/**
		 * The parent element to be assigned to.
		 */
		parent?: Node;
		value?: string;
		type?: string;
		prepend?: boolean;
		placeholder?: string;
		href?: string;
	}

	function showSplashScreen(): void;
	function hideSplashScreen(): void;
	function newHotkey(modifiers: Modifier[], key: string): Hotkey;

	function createEl<K extends keyof HTMLElementTagNameMap>(tag: K, o?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
	function createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
	function createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
	function createSvg<K extends keyof SVGElementTagNameMap>(tag: K, o?: SvgElementInfo | string, callback?: (el: SVGElementTagNameMap[K]) => void): SVGElementTagNameMap[K];
	function createFragment(callback?: (el: DocumentFragment) => void): DocumentFragment;
}

export interface Hotkey {
	/** @public */
	modifiers: Modifier[];
	/** @public */
	key: string;
}

/** @public */
export type IconName = string;

/**
 * Mod = Cmd on MacOS and Ctrl on other OS
 * Ctrl = Ctrl key for every OS
 * Meta = Cmd on MacOS and Win key on other OS
 * @public
 */
export type Modifier = "Mod" | "Ctrl" | "Meta" | "Shift" | "Alt";

/**
 * @public
 */
export interface Command {
	/**
	 * Globally unique ID to identify this command.
	 * @public
	 */
	id: string;
	/**
	 * Human friendly name for searching.
	 * @public
	 */
	name: string;
	// /**
	//  * Icon ID to be used in the toolbar.
	//  * See {@link https://docs.obsidian.md/Plugins/User+interface/Icons} for available icons and how to add your own.
	//  * @public
	//  */
	// icon?: IconName;
	/** @public */
	mobileOnly?: boolean;
	/**
	 * Whether holding the hotkey should repeatedly trigger this command.
	 * @defaultValue false
	 * @public
	 */
	repeatable?: boolean;
	/**
	 * Simple callback, triggered globally.
	 * @example
	 * ```ts
	 * this.addCommand({
	 *   id: "print-greeting-to-console",
	 *   name: "Print greeting to console",
	 *   callback: () => {
	 *     console.log("Hey, you!");
	 *   },
	 * });
	 * ```
	 * @public
	 */
	callback?: () => any;
	/**
	 * Complex callback, overrides the simple callback.
	 * Used to "check" whether your command can be performed in the current circumstances.
	 * For example, if your command requires the active focused pane to be a MarkdownView, then
	 * you should only return true if the condition is satisfied. Returning false or undefined causes
	 * the command to be hidden from the command palette.
	 *
	 * @param checking - Whether the command palette is just "checking" if your command should show right now.
	 * If checking is true, then this function should not perform any action.
	 * If checking is false, then this function should perform the action.
	 * @returns Whether this command can be executed at the moment.
	 *
	 * @example
	 * ```ts
	 * this.addCommand({
	 *   id: 'example-command',
	 *   name: 'Example command',
	 *   checkCallback: (checking: boolean) => {
	 *     const value = getRequiredValue();
	 *
	 *     if (value) {
	 *       if (!checking) {
	 *         doCommand(value);
	 *       }
	 *       return true;
	 *     }
	 *
	 *     return false;
	 *   }
	 * });
	 * ```
	 *
	 * @public
	 */
	checkCallback?: (checking: boolean) => boolean | void;

	/**
	 * A command callback that is only triggered when the user is in an editor.
	 * Overrides `callback` and `checkCallback`
	 * @example
	 * ```ts
	 * this.addCommand({
	 *   id: 'example-command',
	 *   name: 'Example command',
	 *   editorCallback: (editor: Editor, view: MarkdownView) => {
	 *     const sel = editor.getSelection();
	 *
	 *     console.log(`You have selected: ${sel}`);
	 *   }
	 * });
	 * ```
	 * @public
	 */
	// editorCallback?: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => any;
	/**
	 * A command callback that is only triggered when the user is in an editor.
	 * Overrides `editorCallback`, `callback` and `checkCallback`
	 * @example
	 * ```ts
	 * this.addCommand({
	 *   id: 'example-command',
	 *   name: 'Example command',
	 *   editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
	 *     const value = getRequiredValue();
	 *
	 *     if (value) {
	 *       if (!checking) {
	 *         doCommand(value);
	 *       }
	 *
	 *       return true;
	 *     }
	 *
	 *     return false;
	 *   }
	 * });
	 * ```
	 * @public
	 */
	// editorCheckCallback?: (checking: boolean, editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => boolean | void;
	/**
	 * Sets the default hotkey. It is recommended for plugins to avoid setting default hotkeys if possible,
	 * to avoid conflicting hotkeys with one that's set by the user, even though customized hotkeys have higher priority.
	 * @public
	 */
	hotkeys?: Hotkey[];
}

export {};
