const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

function initUpdater(mainWindow) {

    autoUpdater.logger = log;
    autoUpdater.logger.transports.file.level = "info";

    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on("checking-for-update", () => {
        log.info("Checking for update...");
    });

    autoUpdater.on("update-available", (info) => {
        log.info("Update available:", info);

        mainWindow.webContents.send(
          "update_available",
          info
        );
    });

    autoUpdater.on("update-not-available", () => {
        log.info("No updates available");
    });

    autoUpdater.on("download-progress", (progressObj) => {

        mainWindow.webContents.send(
          "download_progress",
          progressObj.percent
        );
    });

    autoUpdater.on("update-downloaded", () => {

        mainWindow.webContents.send(
          "update_downloaded"
        );

        autoUpdater.quitAndInstall();
    });

    autoUpdater.on("error", (err) => {
        log.error("Update error:", err);
    });

    autoUpdater.checkForUpdates();
}

module.exports = initUpdater;