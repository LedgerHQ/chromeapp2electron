const electron = require('electron')
// Module to control application life.
const app = electron.app

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
    }
  },
  onUpdateAvailable: {
    addListener: (cb) => {
    }
  },
  reload: () => {
    app.relaunch();
    app.quit();
  },
  lastError: () => {
    return 'last error default'
  },
  getManifest: () => {
    return manifest;
  }
}