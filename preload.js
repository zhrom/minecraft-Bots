const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mcBots', {
  startBots: (config) => ipcRenderer.invoke('start-bots', config),
  stopBots: () => ipcRenderer.invoke('stop-bots')
});


