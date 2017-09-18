global.chrome = {}
global.mainWindow = {}
require('./src/imports')
require('./chromeApp');
require('./chromeFileSystem');
require('./chromeHID');
require('./chromeUSB');
require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
require('./chromeCommands');