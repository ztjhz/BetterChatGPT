const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setCloseToTray: (setting) => ipcRenderer.send('set-close-to-tray', setting)
})