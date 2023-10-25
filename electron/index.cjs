const path = require('path');

const {dialog,  app, BrowserWindow, Tray, Menu } = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
let win = null;
const instanceLock = app.requestSingleInstanceLock();
const isMacOS = process.platform === 'darwin';

if (require('electron-squirrel-startup')) app.quit();

const PORT = isDev ? '5173' : '51735';
const ICON = 'icon-rounded.png';
const ICON_TEMPLATE = 'iconTemplate.png';

function createWindow() {
  autoUpdater.checkForUpdatesAndNotify();

  win = new BrowserWindow({
	autoHideMenuBar: true,
    show: false,
    icon: assetPath(ICON),
  });

  createTray(win);

  win.maximize();
  win.show();

  isDev || createServer();

  win.loadURL(`http://localhost:${PORT}`);

  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  return win;
}

const assetPath = (asset) => {
  return path.join(
    __dirname,
    isDev ? `../public/${asset}` : `../dist/${asset}`
  )
}

const createTray = (window) => {
  const tray = new Tray(
    assetPath(!isMacOS ? ICON : ICON_TEMPLATE)
  );
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        win.maximize();
        window.show();
      },
    },
    {
      label: 'Exit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.on('click', () => {
    win.maximize();
    window.show();
  });
  tray.setToolTip('Better ChatGPT');
  tray.setContextMenu(contextMenu);

  return tray;
};

app.on('window-all-closed', () => {
  if (!isMacOS) {
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  // Perform any necessary cleanup tasks here
  dialog.showErrorBox('An error occurred', error.stack);

  // Exit the app
  process.exit(1);
});

if (!instanceLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.whenReady().then(() => {
    win = createWindow()
  })
}

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
      request.url === '/'
        ? `${path.join(__dirname, '../dist/index.html')}`
        : `${path.join(__dirname, `../dist/${request.url}`)}`;

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
