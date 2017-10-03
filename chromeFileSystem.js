var {dialog, remote} = require('electron')
dialog = dialog ? dialog : remote.dialog
chrome.fileSystem = {}
chrome.fileSystem.chooseEntry = (options, cb) => {
  dialog.showSaveDialog({
      defaultPath: options.suggestedName,
    },
    cb
  );
}
