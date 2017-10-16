//Communication with child process hid
var {app, ipcMain} = require('electron');  

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
  try {
    hid.send(arg)
  } catch(e) {
    console.log("channel closed",arg.id)
    mainWindow.webContents.send('hid-reply', {
      id: arg.id,
      err: "Node-hid process shutdown",
      args: []
    });
  }
});

hid.on('message', message => {
  console.log('message from child hid:', message.id, message.table);
  mainWindow.webContents.send('hid-reply', message);    
});
