import { app, BrowserWindow } from "electron";
import path from "node:path";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 700,
    height: 450,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("https://uv.markcolby.dev");
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
