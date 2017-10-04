const {ipcRenderer} = require('electron')

var cbTable = {}
var lastError = undefined
var id = 0;

toArrayBuffer = (json) => {
  //console.log("read from device", json)
  return hexToArrayBuffer(json);
}

convertString = (ab) => {
  var list = [];
  var view = new Uint8Array(ab);
	for (var h = 0; h < view.length; h++) {
		list.push(parseInt(view[h]));
	}
	return list
}

// Listen for async-reply message from main process
ipcRenderer.on('hid-reply', (event, arg) => {
    console.log("hid reply", arg.args, arg.id, arg.err);
    if (arg.err) {
      setTimeout(() => {
        chrome.runtime.lastError = arg.err;
        try {
          console.log("calling cb ", arg.id)
          cbTable[arg.id].apply(this, arg.args);
        } catch(e) {
          console.log("error in hid callback", e, arg)
        }
        chrome.runtime.lastError = undefined;        
      }, 0)
    } else {
      if(arg.buffersBack.length > 0 ) {
        for (var l=0; l<arg.buffersBack.length; ++l) {
          arg.args[arg.buffersBack[l]] = toArrayBuffer(arg.args[arg.buffersBack[l]]);
        }
      }
      setTimeout(() => {
        try {
          console.log("calling cb b ", arg.id)                  
          cbTable[arg.id].apply(this, arg.args);
          if (!(typeof(arg.id) === 'string')) {
            cbTable[arg.id] = undefined;
          }
        } catch(e) {
          console.log("error in hid callback", e, arg)
        }
      }, 0)
    }
});

makeCall = (call, args, perm) => {   
  var buffers = [];
  for (var i=0; i<args.length; ++i) {
    if( args[i] instanceof ArrayBuffer) {
      buffers.push(i);
    }
  }
  //console.log("call arg", call, args, typeof(args[args.length -1]) === 'function')
  if (typeof(args[args.length -1]) === 'function') {
    if (perm) {
      cbTable[perm] = args[args.length -1]
      thisId = perm
    } else {
      while (cbTable[++id] !== undefined){
      }
      thisId = id
      cbTable[id] = args[args.length -1]
    }
    args.pop()
  } else {
    thisId = undefined
  }
  if (buffers.length > 0) {
    for(var j=0; j<buffers.length; ++j) {
      args[buffers[j]] = convertString(args[buffers[j]]);
    }
  }
  console.log("makecall", call, args, thisId)
  ipcRenderer.send('hid', {
    call: call,
    args: args,
    id: thisId,
    buffers: buffers
  })
}


chrome ={
  runtime: {
    lastError: undefined
  },
  hid: {
    getDevices: (...params) => {
      makeCall(['getDevices'], params)
    },
    connect: (...params) => {
      makeCall(['connect'], params)
    },
    disconnect: (...params) => {
      makeCall(['disconnect'], params)
    },
    receive: (...params) => {
      makeCall(['receive'], params)
    },
    send: (...params) => {
      makeCall(['send'], params)
    },
    onDeviceRemoved: {
      addListener: (...params) => {
        makeCall(['onDeviceRemoved', 'addListener'], params, "disconnectCb")
      },
      removeListener: (...params) => {
        cbTable["disconnectCb"] = () => {};
      }
    },
  }
}