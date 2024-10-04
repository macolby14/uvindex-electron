const { contextBridge, ipcRenderer } = require("electron");
// esm loader in preload can't use esm import syntax https://www.electronjs.org/docs/latest/tutorial/esm

console.log("preload.js ran");

contextBridge.exposeInMainWorld("electron", {
  closeWindow: () => ipcRenderer.send("close-window"),
});
