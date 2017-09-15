const electron = require('electron')
const dialog = electron.dialog
chrome.filesystem = {}
chrome.filesystem.chooseEntry = (options, cb) => {
  dialog.showSaveDialog({
      defaultPath: options.suggestedName,
    },
    cb
  );
}
