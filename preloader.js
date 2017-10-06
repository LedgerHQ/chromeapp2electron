global.chrome = {}

const path = require('path')
const url = require('url')
const electron = require('electron')
window.hexToArrayBuffer = require('hex-to-array-buffer')
window.nodeRequire = require;

window.open = (url) => {
  electron.shell.openExternal(url)
}


global.mainWindow = {}
document.addEventListener('dragover',function(event){
  event.preventDefault();
  return false;
},false);

document.addEventListener('drop',function(event){
  event.preventDefault();
  return false;
},false);

document.addEventListener('dragleave', function(e){
  e.preventDefault();
  e.stopPropagation();
}, false);
global.manifest = require('./chromeApp/manifest.json');
global.path = __dirname+'/chromeApp';
require('./chromeApp');
require('./imageFixer');
require('./hidRenderer');
require('./chromeFileSystem');
require('./chromeUSB');
require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
require('./chromeCommands');
require('./chromePermissions');


delete window.require;
delete window.exports;
delete window.module;