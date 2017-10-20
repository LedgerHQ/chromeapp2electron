const electron = require('electron')
var log = require('electron-log')
const dialog = electron.dialog

//const autoUpdater = electron.autoUpdater
const autoUpdater = require('electron-simple-updater');
autoUpdater.init('http://localhost:8080/updates.json');

/*const server = 'http://localhost:8080'
const feed = `${server}/update/${process.platform}/${app.getVersion()}`
*/

/*setInterval(() => {
  autoUpdater.checkForUpdates()
}, 6000)*/


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
