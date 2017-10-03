var {app, remote} = require('electron')
// Module to control application life.
app = app ? app : remote.app

chrome.runtime = {
  sendMessage: (arg1, arg2, arg3, arg4) => {
    var message = arg2
    var options = arg3
    var cb = arg4
    if (typeof(arg1) !== "string") {
      message = arg1
      options = arg2
      cb = arg3
    }
    if (typeof(options) !== "boolean") {
      cb = options
    }
    if (cb) {
      cb()
    }
    return
  },
  electron: true,
  getBackgroundPage: (cb) => {
    return 'electron-wrapper'
  },
  onMessageExternal: {
    addListener: (cb) => {
    }
  },
  onMessage: {
    addListener: (cb) => {
    }
  },
  onLaunched: {
    addListener: (cb) => {
      cb();
    }
  },
  onClosed: {
    addListener: (cb) => {
    }
  },
  onUpdateAvailable: {
    addListener: (cb) => {
    }
  },
  reload: () => {
    console.log( " reload")
    app.relaunch();
    app.quit();
  },
  lastError: undefined
  ,
  getManifest: () => {
    return manifest;
  }
}