
const setupEvents = require('./setup');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const BrowserWindow = electron.BrowserWindow
var log = require('electron-log')
log.transports.file.level = 'silly'
log.info('app starts 1.0.0')

global.chrome = {}
global.mainWindow = {}
global.manifest = require('./chromeApp/manifest.json');
global.nodeRequire = require;

require('./update');
require('./chromeApp');
require('./chromeFileSystem');
require('./chromeUSB');
require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
let background = manifest.app.background.scripts[0]

function createWindow () {
  require('./childManagement');
  
  // Create the browser window.
  require('./chromeApp/'+background);
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
    log.info("quitting")
    app.quit()
  }
  hid.kill()      
  delete require.cache[require.resolve('./chromeApp/'+background)]
  delete require.cache[require.resolve('./childManagement')]
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})