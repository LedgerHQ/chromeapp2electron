global.chrome = {}

const path = require('path')
const url = require('url')
const electron = require('electron')
window.hexToArrayBuffer = require('hex-to-array-buffer')
window.ipcRenderer = electron.ipcRenderer;
window.nodeRequire = require;

global.mainWindow = {}
global.manifest = require('./manifest.json');
global.path = __dirname;
require('./imgFixer');
require('./chromeApp');
require('./hidRenderer')
require('./chromeFileSystem');
require('./chromeUSB');
require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
require('./chromeCommands');


delete window.require;
delete window.exports;
delete window.module;