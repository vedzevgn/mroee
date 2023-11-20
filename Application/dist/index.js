"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
let mainWindow;
electron_1.app.setName('mroee /connect');
electron_1.app.on("ready", createWindows);
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
electron_1.app.on('activate', function () {
    if (mainWindow === null)
        createWindows();
});
function createWindows() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1400, height: 800,
        webPreferences: {
            preload: __dirname + "/preload.js",
            nodeIntegration: true,
            contextIsolation: false
        },
        show: false,
        title: 'mroee /connect',
        titleBarStyle: 'hidden',
    });
    mainWindow.loadFile("./index.html");
    mainWindow.on("ready-to-show", () => mainWindow.show());
}
