import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import electronUpdater from "electron-updater";

const { autoUpdater } = electronUpdater;

const UV_INDEX_URL = "https://uv.markcolby.dev";
const RETRY_INTERVAL_SEC = 5;

function isDev() {
  return process.env.NODE_ENV === "dev";
}

async function loadUrl(win, url) {
  return new Promise((resolve, reject) => {
    win
      .loadURL(url)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
    },
    fullscreen: !isDev(),
  });

  if (!isDev()) {
    mainWindow.maximize(); // incase full screen mode exited
  } else {
    mainWindow.width = 800;
    mainWindow.height = 400;
  }

  const loadedSuccessfully = false;

  // try to load the page every second until it loads
  do {
    await loadUrl(mainWindow, UV_INDEX_URL)
      .then(() => {
        loadedSuccessfully = true;
      })
      .catch((err) => {
        console.error("Failed to load URL", err);
      });
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_INTERVAL_SEC * 1000)
    );
  } while (!loadedSuccessfully);

  autoUpdater.setFeedURL({
    provider: "github",
    owner: "macolby14",
    repo: "uvindex-electron",
    private: false,
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
