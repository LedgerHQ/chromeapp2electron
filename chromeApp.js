const {BrowserWindow} = require('electron')
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

var window = {};

chrome.app = {
  runtime: {
    onLaunched: {
      addListener: () => {
        return
      }
    }
  },
  window: {
    current: () => {
      show: () => {
        window.focus();
      }
    },
    create: (view, options, cb) => {
      window = new BrowserWindow({
        width: options.innerBounds.width,
        height: options.innerBounds.height,
        x: options.innerBounds.left,
        y: options.innerBounds.top,
        minWidth: options.innerBounds.minWidth,
        minHeight: options.innerBounds.minHeight,
        frame: options.frame? false : true,
        show: !options.hidden, 
      });
      mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, view),
        protocol: 'file:',
        slashes: true
      }))
    }
  }
}