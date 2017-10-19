var electronInstaller = require('electron-winstaller');

console.log()

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './release/package/ledgerWrapper-win32-x64',
    outputDirectory: './release/installer',
    authors: 'amougel',
    exe: 'ledgerWrapper.exe',
    version: '1.0.0'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));