const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

if (require('electron-squirrel-startup')) app.quit();

function createWindow() {
  let iconPath = '';
  if (isDev) {
    iconPath = path.join(__dirname, '../public/favicon-516x516.png');
  } else {
    iconPath = path.join(__dirname, '../dist/favicon-516x516.png');
  }
  autoUpdater.checkForUpdatesAndNotify();

  const win = new BrowserWindow({
    show: false,
    icon: iconPath,
  });
  win.maximize();
  win.show();

  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
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
