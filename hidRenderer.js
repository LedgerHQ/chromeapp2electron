const {ipcRenderer} = require('electron')

var cbTable = {}
cbTable.once = {}
cbTable.onRemoved = {}
var lastError = undefined
var id = 0;
var idCb = 0;
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
  console.log("hid reply", JSON.stringify(arg));
  if (arg.err) {
    setTimeout(() => {
      chrome.runtime.lastError = arg.err;
      console.log("error in hid response", JSON.stringify(arg.err))
      try {
        cbTable[arg.table][arg.id].apply(this, arg.args);
        if (arg.table === 'once') {
          cbTable[arg.table][arg.id] = undefined;            
        }
      } catch(e) {
        console.log("error in hid callback call", e, JSON.stringify(arg))
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
        cbTable[arg.table][arg.id].apply(this, arg.args);
        if (arg.table === 'once') {
          cbTable[arg.table][arg.id] = undefined;            
        }
      } catch(e) {
        console.log("error in hid callback call", e, JSON.stringify(arg))
      }
    }, 0)
  }
});

makeCall = (call, args, listener) => {   
  var buffers = [];
  for (var i=0; i<args.length; ++i) {
    if( args[i] instanceof ArrayBuffer) {
      buffers.push(i);
    }
  }
  //console.log("call arg", call, args, typeof(args[args.length -1]) === 'function')
  if (typeof(args[args.length -1]) === 'function' || listener) {
    var table = "once"
    if (listener) {
      table = listener
      while (cbTable[table][++idCb] !== undefined){
      }
      cbTable[table][idCb] = args
      thisId = idCb
      args = [idCb]
    } else {
      while (cbTable[table][++id] !== undefined){
      }
      thisId = id
      cbTable[table][id] = args[args.length -1]
      args.pop()      
    }
  } else {
    thisId = undefined
  }
  if (buffers.length > 0) {
    for(var j=0; j<buffers.length; ++j) {
      args[buffers[j]] = convertString(args[buffers[j]]);
    }
  }
  console.log("makecall", call, args, table, thisId)
  ipcRenderer.send('hid', {
    call: call,
    args: args,
    id: thisId,
    table: table,
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
      addListener: (cb) => {
        makeCall(['onDeviceRemoved', 'addListener'], cb, "onRemoved")
      },
      removeListener: (cbToRemove) => {
        for (cb in cbTable["onRemoved"]) {
          if ( cbTable["onRemoved"].hasOwnProperty(cb) && cbTable["onRemoved"][cb] === cbToRemove) {
            cbTable["onRemoved"][cb] = undefined
            makeCall(['onDeviceRemoved', 'removeListener'], [cb])
          }
        }
      }
    },
  }
}