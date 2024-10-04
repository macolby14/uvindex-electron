import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
    fullscreen: true,
  });

  mainWindow.maximize(); // incase full screen mode exited

  const uvIndexUrl =
    process.env.NODE_ENV === "dev"
      ? "http://localhost:5173"
      : "https://uv.markcolby.dev";

  mainWindow.loadURL(uvIndexUrl);
  autoUpdater.setFeedURL({
    provider: "github",
    owner: "macolby14",
    repo: "uvindex-electron",
    private: true,
    token: process.env.GITHUB_TOKEN,
  });
  autoUpdater.checkForUpdatesAndNotify();
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

ipcMain.on("close-window", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});
