import { Hotkey, Modifier, Command } from "./moko.d";

/**
 * @public
 */
function newHotkey(modifiers: Modifier[], key: string): Hotkey {
	return { modifiers: modifiers, key: key };
}

window.newHotkey = newHotkey;
window.newHotkey = newHotkey;

export { newHotkey };
export type { Hotkey, Modifier, Command };
