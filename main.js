const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
global.hexToArrayBuffer = require('hex-to-array-buffer')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.chrome = {}
global.manifest = require('./manifest.json');
global.mainWindow = {}
require('./chromeApp');
require('./chromeFileSystem');
require('./chromeUSB');

require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
require('./chromeCommands');

function createWindow () {
  
  // Create the browser window.
  require('./childManagement');
  
  chrome.app.window.create('views/layout.html', {
    id: "main_window",
    innerBounds: {
      minWidth: 1000,
      minHeight: 640
    }
  }, function(createdWindow) {
    console.log("created", createdWindow);
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    hid.kill()
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
