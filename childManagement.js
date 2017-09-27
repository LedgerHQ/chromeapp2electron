//Communication with child process hid
var electron = require('electron');  
var {app, ipcMain} = electron;  
const { fork } = require('child_process')
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

global.hid = fork('./hidChild')
hid.on('disconnect', (message) => {
  console.log("child hid disconnected with message:", message)
})
hid.on('exit', (code, signal) => {
  console.log('child process exited with ' +
  `code ${code} and signal ${signal}`);
})
//Communication with the renderer
// Listen for async message from renderer process
ipcMain.on('hid', (event, arg) => {      
  // Transfer to child
  //console.log("message received from renderer", arg.id, arg.call)
  hid.send(arg)
});

hid.on('message', message => {
  //console.log('message from child hid:', message.id);
  mainWindow.webContents.send('hid-reply', message);
});
