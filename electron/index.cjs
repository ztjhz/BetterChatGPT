const path = require('path');

const {
  app,
  shell,
  clipboard,
  dialog,
  download,
  BrowserWindow,
  Tray,
  Menu,
  MenuItem,
} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
let win = null;
const instanceLock = app.requestSingleInstanceLock();
const isMacOS = process.platform === 'darwin';

if (require('electron-squirrel-startup')) app.quit();

const PORT = isDev ? '5173' : '51735';
const ICON = 'icon-rounded.png';
const ICON_TEMPLATE = 'iconTemplate.png';

const setupLinksLeftClick = (win) => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
};

const setupContextMenu = (win) => {
  win.webContents.on('context-menu', (_, params) => {
    const { x, y, linkURL, selectionText } = params;

    const template = [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteAndMatchStyle' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectAll' },
      { type: 'separator' },
      { role: 'toggleDevTools' },
    ];

    const spellingMenu = [];

    if (selectionText && !linkURL) {
      // Add each spelling suggestion
      for (const suggestion of params.dictionarySuggestions) {
        spellingMenu.push(
          new MenuItem({
            label: suggestion,
            click: () => win.webContents.replaceMisspelling(suggestion),
          })
        );
      }

      // Allow users to add the misspelled word to the dictionary
      if (params.misspelledWord) {
        spellingMenu.push(
          new MenuItem({
            label: 'Add to dictionary',
            click: () =>
              win.webContents.session.addWordToSpellCheckerDictionary(
                params.misspelledWord
              ),
          })
        );
      }

      if (spellingMenu.length > 0) {
        spellingMenu.push({ type: 'separator' });
      }

      template.push(
        { type: 'separator' },
        {
          label: `Search Google for "${selectionText}"`,
          click: () => {
            shell.openExternal(
              `https://www.google.com/search?q=${encodeURIComponent(
                selectionText
              )}`
            );
          },
        },
        {
          label: `Search DuckDuckGo for "${selectionText}"`,
          click: () => {
            shell.openExternal(
              `https://duckduckgo.com/?q=${encodeURIComponent(selectionText)}`
            );
          },
        }
      );
    }

    if (linkURL) {
      template.push(
        { type: 'separator' },
        {
          label: 'Open Link in Browser',
          click: () => {
            shell.openExternal(linkURL);
          },
        },
        {
          label: 'Copy Link Address',
          click: () => {
            clipboard.writeText(linkURL);
          },
        },
        {
          label: 'Save Link As...',
          click: () => {
            dialog.showSaveDialog(
              win,
              { defaultPath: path.basename(linkURL) },
              (filePath) => {
                if (filePath) {
                  download(win, linkURL, { filename: filePath });
                }
              }
            );
          },
        }
      );
    }

    Menu.buildFromTemplate([...spellingMenu, ...template]).popup({
      window: win,
      x,
      y,
    });
  });
};

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

  setupLinksLeftClick(win);
  setupContextMenu(win);

  return win;
}

const assetPath = (asset) => {
  return path.join(
    __dirname,
    isDev ? `../public/${asset}` : `../dist/${asset}`
  );
};

const createTray = (win) => {
  const tray = new Tray(assetPath(!isMacOS ? ICON : ICON_TEMPLATE));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: () => {
        win.maximize();
        win.show();
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
    win.show();
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
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  app.whenReady().then(() => {
    win = createWindow();
  });
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
