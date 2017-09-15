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
    return cb(undefined)
  },
  onMessageExternal: {
    addListener: (request, sender, response) => {
      return
    }
  },
  onMessage: {
    addListener: (request, sender, response) => {
      return
    }
  },
  onLaunched: {
    addListener: (request, sender, response) => {
      return
    }
  },
  onUpdateAvailable: {
    addListener: (request, sender, response) => {
      return
    }
  },
  reload: () => {
    app.relaunch();
    app.quit();
  },
  lastError: () => {
    return
  },
  getManifest: () => {
    return {
      version: '2'
    }
  }
}