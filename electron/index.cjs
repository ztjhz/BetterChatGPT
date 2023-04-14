const path = require('path');

const { app, BrowserWindow, Tray, Menu } = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');

if (require('electron-squirrel-startup')) app.quit();

const PORT = isDev ? '5173' : '51735';

function createWindow() {
  let iconPath = '';
  if (isDev) {
    iconPath = path.join(__dirname, '../public/icon-rounded.png');
  } else {
    iconPath = path.join(__dirname, '../dist/icon-rounded.png');
  }
  autoUpdater.checkForUpdatesAndNotify();

  const win = new BrowserWindow({
    show: false,
    icon: iconPath,
  });

  createTray(win);

  win.on('minimize', (event) => {
    event.preventDefault();
    win.hide();
  });

  win.maximize();
  win.show();

  isDev || createServer();

  win.loadURL(`http://localhost:${PORT}`);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  return win;
}

const createTray = (window) => {
  const tray = new Tray(
    path.join(
      __dirname,
      isDev ? '../public/icon-rounded.png' : '../dist/icon-rounded.png'
    )
  );
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show', click: () => window.show() },
    {
      label: 'Exit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.on('click', () => window.show());
  tray.setToolTip('Better ChatGPT');
  tray.setContextMenu(contextMenu);

  return tray;
};

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

const createServer = () => {
  // Dependencies
  const http = require('http');
  const fs = require('fs');
  const path = require('path');

  // MIME types for different file extensions
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.wasm': 'application/wasm',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
  };

  // Create a http server
  const server = http.createServer((request, response) => {
    // Get the file path from the URL
    let filePath =
      request.url === '/' ? '../dist/index.html' : `../dist/${request.url}`;

    // Get the file extension from the filePath
    let extname = path.extname(filePath);

    // Set the default MIME type to text/plain
    let contentType = 'text/plain';

    // Check if the file extension is in the MIME types object
    if (extname in mimeTypes) {
      contentType = mimeTypes[extname];
    }

    // Read the file from the disk
    fs.readFile(filePath, (error, content) => {
      if (error) {
        // If file read error occurs
        if (error.code === 'ENOENT') {
          // File not found error
          response.writeHead(404);
          response.end('File Not Found');
        } else {
          // Server error
          response.writeHead(500);
          response.end(`Server Error: ${error.code}`);
        }
      } else {
        // File read successful
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(content, 'utf-8');
      }
    });
  });

  // Listen for request on port ${PORT}
  server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/`);
  });
};
