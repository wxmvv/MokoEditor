import "./moko/css/var.css";
import "./moko/css/moko.css";
import "./moko/css/cm.css";
import "./moko/css/markdown.css";
// import "./moko/css/backup/obsidian.css"

import "./moko/utils/moko";
import "./moko/utils/global.ts";
import moko from "./moko/moko.js";
import UaInfo from "./moko/utils/UaInfo.js";
import ElectronAdapter from "./moko/manager/adapter/ElectronAdapter.js";

const uaInfo = new UaInfo();
const appEl = document.getElementById("app") || document.createElement("div");
appEl.id = "app";
document.body.appendChild(appEl);
new moko(appEl, uaInfo.isElectron ? new ElectronAdapter() : null);
