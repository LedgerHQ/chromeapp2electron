const settings = require('electron-settings');
chrome.storage = {}
chrome.storage.local = {
  get: (keys, cb) => {
    var result = {}
    if (typeof(keys) === "string") {
      result[keys] = settings.get(keys)
    } else if (keys === null){
      result = settings.getAll();
    } else if (keys.constructor === Array) {
      for(i=0; i < keys.length; i++) {
        result[keys[i]] = settings.get(keys[i]);
      }
    } else {
      for(var property in keys) {
        if (keys.hasOwnProperty(property)) {
          result[property] = settings.get(property, keys[property]);
        }
      }
    }
    for(var property in result) {
      if (result.hasOwnProperty(property) && typeof(result[property]) === "undefined") {
        delete result[property];
      }
    }
    cb(result);
  }, //TODO : special serialization cases like Date
  set: (items, cb) => {
    for(var property in items) {
      if (items.hasOwnProperty(property)) {
        settings.set(property, items[property]);
      }
    }
    if(cb) {
      cb();
    }
  },
  remove: (keys, cb) => {
    if (typeof(keys) === "string") {
      settings.delete(keys)
    } else if (keys.constructor === Array) {
      for(i=0; i < keys.length; i++) {
        settings.delete(keys[i]);
      }
    }
    if(cb) {
      cb();
    }
  },
  clear: (cb) => {
    settings.deleteAll();
    if(cb) {
      cb();
    }
  },
}