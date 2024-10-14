const { app, Tray, Menu, BrowserWindow, globalShortcut, screen } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 500,
        height: 800,
        skipTaskbar: true,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.hide();
}

function createTray() {
    const iconPath = path.join(__dirname, 'icon.ico');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: () => {
                if (mainWindow) {
                    mainWindow.show();
                }
            }
        },
        {
            label: 'Hide',
            click: () => {
                if (mainWindow) {
                    mainWindow.hide();
                }
            }
        },
        {
            label: 'Quit',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('My Electron App');
    tray.setContextMenu(contextMenu);

    // Show the main window when the tray icon is clicked
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    createTray();

    // Register a global shortcut to change the window position to mouse coordinates
    globalShortcut.register('Control+Shift+A', () => {
        if (mainWindow) {
            const { x, y } = screen.getCursorScreenPoint(); // Get global mouse coordinates
            mainWindow.setPosition(x - 250, y); // Set window position to mouse position
        }
    });

    // Register a shortcut to toggle window visibility
    globalShortcut.register('Control+Shift+D', () => {
        if (mainWindow) {
            if (mainWindow.isVisible()) {
                mainWindow.hide();
            } else {
                mainWindow.show();
            }
        }
    });
});

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

// Unregister the shortcut when the app is quit
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});