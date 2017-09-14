const electron = require('electron')
const dialog = electrong.dialog

chrome.fileSystem.chooseEntry = (options, cb) => {
  dialog.showSaveDialog({
      defaultPath: options.suggestedName,
    },
    cb
  );
}
