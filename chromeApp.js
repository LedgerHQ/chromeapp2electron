const {BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

chrome.app = {
  runtime: {
    onLaunched: {
      addListener: (cb) => {
        cb()
      }
    }
  },
  window: {
    current: () => {
      show: () => {
        mainWindow.focus();
      }
    },
    create: (view, options, cb) => {
      mainWindow = new BrowserWindow({
        webPreferences: {
          nodeIntegration: false,
          preload: path.join(__dirname, 'preloader.js'),
        },
        width: options.innerBounds.width,
        height: options.innerBounds.height,
        x: options.innerBounds.left,
        y: options.innerBounds.top,
        minWidth: options.innerBounds.minWidth,
        minHeight: options.innerBounds.minHeight,
        frame: options.frame? false : true,
        show: !options.hidden, 
      });
      //mainWindow.setMenu(null);
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'chromeApp', view),
        protocol: 'file:',
        slashes: true
      }))
      /*if(cb) {
        cb()
      }*/
    }
  }
};