global.chrome = {}
global.mainWindow = {}
global.manifest = require('./manifest.json');

require('./src/imports')
require('./chromeApp');
require('./chromeFileSystem');
require('./chromeHID');
require('./chromeUSB');
require('./chromeI18n');
require('./chromeRuntime');
require('./chromeStorage');
require('./chromeCommands');
