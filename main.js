import { app, BrowserWindow } from "electron";
import path from "node:path";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
    fullscreen: true,
  });

  mainWindow.maximize(); // incase full screen mode exited

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
