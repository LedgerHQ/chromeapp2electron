var cbTable = {}

cbTable.onAdded = {}
cbTable.onRemoved = {}

chrome.permissions = {
  contains: (cb) => {
    var perms = []
    for (perm in manifest.optional_permissions) {
      if (typeof(perm) === 'string') {
        perms.push(perm)
      }
    }
    cb(perms)
  },
  onAdded: {
    addListner: (cb) => {
    }
  },
  onRemoved: {
    addListener: (cb) => {
    }
  },
  request: (perm, cb) => {
    if(cb){
      cb(true)
    }
  },
  remove: (perm, cb) => {
    if(cb){
      cb(true)
    }
  },
  contains: (perm, cb) => {
    cb(true)
  },
  getAll: (cb) => {
    [
      "activeTab",
      "alarms",
      "storage",
      "unlimitedStorage",
      "notifications",
      "usb",
      "hid",
      "://*",
      "videoCapture",
      "fileSystem",
      "background",
      "bookmarks",
      "BrowsingData",
      "certificateProvider",
      "clipboardRead",
      "clipboardWrite",
      "contentSettings",
      "contextMenus",
      "cookies",
      "debugger",
      "declarativeContent",
      "declarativeNetRequest",
      "declarativeWebRequest",
      "desktopCapture",
      "displaySource",
      "dns",
      "documentScan",
      "documentScan",
      "downloads",
      "enterprise.deviceAttributes",
      "enterprise.platformKeys",
      "experimental",
      "fileBrowserHandler",
      "fileSystemProvider",
      "fontSettings",
      "gcm",
      "geolocation",
      "history",
      "identity",
      "idle",
      "idltest",
      "management",
      "nativeMessaging",
      "networking.config",
      "notifications",
      "pageCapture",
      "plateformKeys",
      "power",
      "printerProvider",
      "privacy",
      "processes",
      "proxy",
      "sesssions",
      "signedDevices",
      "storage",
      "system.cpu",
      "system.storage",
      "system.memory",
      "system.display",
      "tabCapture",
      "tabs",
      "topSites",
      "tts",
      "ttsEngines",
      "vpnProvider",
      "wallpaper",
      "webNavigation",
      "webRequest",
      "webrequestBlocking"
    ]
  }
}