var app = require('app'); // or from BrowserWindow: app = require("remote").require('app');


chrome.runtime = {
  sendMessage = (extensionId, message, options, cb) => {
    return
  },
  onMessageExternal = {
    addListener = (request, sender, response) => {
      return
    }
  },
  onMessage = {
    addListener = (request, sender, response) => {
      return
    }
  },
  reload = () => {
    app.relaunch();
    app.quit();
  },
  lastError = () => {
    return
  },
  getManifest = () => {
    return {
      version: '2'
    }
  }
}