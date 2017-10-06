var {dialog, remote} = nodeRequire('electron')
dialog = dialog ? dialog : remote.dialog
const fs = require('fs')


var entryTable = {}
var id = 0

createFileEntry = (path) => {
  var entry = {
    createWriter: (cb, errorHandler) => {
      console.log("creating writer")
      if (!errorHandler) {
        errorHandler = (e) => {
          console.log("error handler", e)
        }
      }
      try {
        var writer = {
          onerror: (e) => {
            console.log("writing went wrong",e)
          },
          onwriteend: (e) => {
            console.log("writing went right",e)
          }
        }
        writer.write = (blob) => {
            try {
              var reader = new FileReader();
              var text = ""
              reader.addEventListener("loadend", function() {
                text = reader.result;
                console.log("writing stuff")
                fs.appendFile(path, text, (e) => {
                  writer.onwriteend(e)
                })
              });
              reader.readAsText(blob);
            } catch(e) {
              console.log("error writing debug")
              writer.onerror(e)
            }
          }
        writer.truncate = (size) => {
          console.log("truncating")
          var fd = fs.openSync(path, 'r+');
          try {
            fs.ftruncate(fd, size, (e) => {
              writer.onwriteend(e)
            });
          } catch(e) {
            writer.onerror(e)
          }
        }
        cb(writer);
      } catch(e) {
        errorHandler(e)
      }
    }
  }
  return entry;
}

chrome.fileSystem = {
  chooseEntry: (options, cb) => {
    if (options) {
      var properties = []
      if (options.acceptsMultiple) {
        properties.push("multiSelections")
      }
      if (!options.type) {
        options.type = "openFile"
      }
      switch (options.type) {
        case "saveFile":
          dialog.showSaveDialog({
              defaultPath: options.suggestedName,
              properties: properties,
            },
            (path) => {
              cb(createFileEntry(path))
            }
          );
          break;
        case "openDirectory":
          /*properties.push("openDirectory", "createDirectory")
          dialog.showOpenDialog({
              defaultPath: options.suggestedName,
              properties: properties,
            },
            cb
          );
          break;*/
        case "openFile":
        case "openWritableFile":
          console.log("Not implemented")
          /*properties.push("openFile", "showHiddenFiles")
          dialog.showOpenDialog({
              defaultPath: options.suggestedName,
              properties: properties,
            },
            cb
          );*/
          break;
      }
    }
  },
  getWritableEntry: (entry, cb) => {
    cb("/")
  },
  isWritableEntry: (e, cb) => {
    cb(true)
  },
  getDisplayPath: (e, cb) => {
    cb(e)
  },
  restoreEntry: (id, cb) => {
    cb(entryTable[id])
  },
  isRestorable: (id, cb) => {
    if (entryTable[id] ) {
      cb(true)
    }
  },
  retainEntry: (entry) => {
    while(!entryTable[++id] === undefined){
    }
    entryTable[id] = entry;
    cb(id);
  },
  requestFileSytem: (opt, cb) => {
    console.log("Not implemented")
  },
  getVolumeList: () => {
    console.log("Not implemented")    
  }
}

