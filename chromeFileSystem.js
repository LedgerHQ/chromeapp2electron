const electron = require('electron')
const dialog = electron.dialog
chrome.fileSystem = {}
chrome.fileSystem.chooseEntry = (options, cb) => {
  dialog.showSaveDialog({
      defaultPath: options.suggestedName,
    },
    cb
  );
}
