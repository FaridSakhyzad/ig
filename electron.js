const { app, BrowserWindow } = require('electron');

const createWindow = () => {
  const win = new BrowserWindow({
    webSecurity: false,
    fullscreen: true,
  });

  win.loadFile('./build/index.html');
};

app.whenReady().then(() => {
  createWindow();
});
