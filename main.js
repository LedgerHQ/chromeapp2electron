const electron = require('electron')
const app = electron.app
const autoUpdater = electron.autoUpdater
const updater = require('electron-simple-updater');
updater.init('http://localhost:8080/updates.json');
const dialog = electron.dialog
const BrowserWindow = electron.BrowserWindow
var log = require('electron-log')
log.transports.file.level = 'silly'
log.info('app starts 1.0.0')
//*****************************************Updater********************************************** */
var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  log.info("squirrel args")
  log.info(squirrelCommand)
  
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':
    
      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':    
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}


const server = 'http://localhost:1337'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`

//autoUpdater.setFeedURL(feed)

setInterval(() => {
  autoUpdater.checkForUpdates()
}, 6000)

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  log.info('update downloaded', event, releaseNotes, releaseName)
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  }

  dialog.showMessageBox(dialogOpts, (response) => {
    if (response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', message => {
  log.error('There was a problem updating the application')
  log.error(message)
})

//*************************************************************************************************** */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
global.chrome = {}
global.mainWindow = {}

global.manifest = require('./chromeApp/manifest.json');
global.nodeRequire = require;
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