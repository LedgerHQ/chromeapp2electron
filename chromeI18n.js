

chrome.i18n = {
  getUILanguage: () => {
    return "en"
  },
  getAcceptLanguages: (cb) => {
    return cb(["en"])
  },
}
