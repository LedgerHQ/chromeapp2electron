
var {globalShortcut, remote} = require('electron')
globalShortcut = globalShortcut ? globalShortcut : remote.globalShortcut

globalShortcut.unregisterAll()

var cb = () => {
  return
}

initializeShortcuts = () => {
  setListener = (name, command) => {
    globalShortcut.register(process.platform === 'darwin' ? command.suggested_key.mac : command.suggested_key.default, () => {
      cb(name);
    })
  }
  
  for (var command in manifest.commands) {
    if (manifest.commands.hasOwnProperty(command)) {
       setListener(command, manifest.commands[command])
    }
  }
}

initializeShortcuts()

chrome.commands = {
  onCommand: {
    addListener: (setter) => {
      cb = setter;
      return
    }
  }
}