const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

app.dock.hide();

let mainWindow;
let tray;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        title: 'Linkedin App',
        width: 500,
        height: 1000,
        resizable: false,
        show: false,  // Don't show the window immediately
        frame: false,
        skipTaskbar: true,  // Avoid taskbar entry for a cleaner tray app
        webPreferences: {
            nodeIntegration: true,
        },
        visibleOnAllWorkspaces: false,  // Keep it on the current desktop
        fullscreenable: false,
    });

    mainWindow.loadURL('https://www.linkedin.com/login');

    mainWindow.on('blur', () => {
        mainWindow.hide();  // Hide the window when focus is lost
    });

    // Event listener to capture the Escape key
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'Escape') {
            mainWindow.hide();  // Hides the window on Escape
        }
    });

    // Tray icon setup
    const iconPath = path.join(__dirname, 'src/icons/icon.png');
    tray = new Tray(iconPath);
    tray.setToolTip('LinkedIn');

    // Create a context menu for the tray icon
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Quit',
            click: () => {
                app.quit();  // Quit the app when "Quit" is clicked
            }
        }
    ]);

    // Set the context menu on right-click
   tray.on('right-click', () => {
        tray.popUpContextMenu(contextMenu);  // Show the context menu on right-click
    });

    // Left-click event to toggle the window
    tray.on('click', (event, bounds) => {
        const { x, y } = bounds;
        const { width, height } = mainWindow.getBounds();

        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.setPosition(Math.round(x - width / 2), process.platform === 'darwin' ? y : y - height);
            mainWindow.show();
        }
    });
});
