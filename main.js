const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { parseAndStartBotsFromConfig, stopAllBots } = require('./bot');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    title: "MC Bots Controller"
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.handle('start-bots', async (_event, config) => {
  try {
    parseAndStartBotsFromConfig(config);
  } catch (err) {
    console.error('Error starting bots from GUI:', err);
  }
});

ipcMain.handle('stop-bots', async () => {
  try {
    stopAllBots();
  } catch (err) {
    console.error('Error stopping bots from GUI:', err);
  }
});


