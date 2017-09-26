global.chrome = {}
require('./chromeHID')
const hexToArrayBuffer = require('hex-to-array-buffer')
function toString(buffer) { 
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function toString(buf) {
  var hex = "";
  let charset = "0123456789abcdef"
  for (var i = 0; i < buf.length; ++i) {
      hex += (charset[Math.floor(buf[i] / 16)] + charset[buf[i] % 16]);
  }
  return hex;
}

process.on('message', message => {  
  console.log('message from parent to hid:', message);
  var call = chrome.hid
  for(i = 0; i < message.call.length; ++i) {
    call = call[message.call[i]]
  }
  /*if(message.buffers.length > 0) {
    for(i=0; i<message.buffers.length; ++i) {
      message.args[message.buffers[i]] = toArrayBuffer(message.args[message.buffers[i]]);
    }
  }*/
  if (!message.id){
    call(message.args)    
  } else {
    var parsedArgs = []
    for(i = 0; i < message.args.length -1; ++i) {
      parsedArgs.push(message.args[i])
    }
    parsedArgs.push(
      (...returned) => {
        var buffersBack = [];
        for (i=0; i<returned.length; ++i) {
          if( returned[i] instanceof Buffer) {
            buffersBack.push(i);
            returned[i] = toString(returned[i]);
          }
        }
        var response = {
          id: message.id,
          args: returned,
          buffersBack: buffersBack
        }
        process.send(response)
      }
    )
    console.log("parsed arg", parsedArgs)
    try {
      call.apply(this,parsedArgs)
    } catch(e) {
      console.log("error from call", e)
    }
  }
});
console.log("child hif launched")



