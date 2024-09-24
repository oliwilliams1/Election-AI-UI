const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 500,
        height: 800,
        //frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            // Optional: Use a preload script for better security
            // preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.setAlwaysOnTop(true, 'screen');
    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});