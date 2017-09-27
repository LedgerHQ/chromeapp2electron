global.chrome = {}
try{
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
    //console.log('message from parent to hid:', message);
    var call = chrome.hid
    for(var j = 0; j < message.call.length; ++j) {
      call = call[message.call[j]]
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
      for(var k = 0; k < message.args.length -1; ++k) {
        parsedArgs.push(message.args[k])
      }
      parsedArgs.push(
        (...returned) => {
          var buffersBack = [];
          for (var l=0; l<returned.length; ++l) {
            if( returned[l] instanceof Buffer) {
              buffersBack.push(l);
              returned[l] = toString(returned[l]);
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
      //console.log("parsed arg", parsedArgs)
      call.apply(this,parsedArgs)
    }
  });
  //console.log("child hif launched")  
} catch(e) {
  console.log("error Child HID", e)
}

process.on('uncaughtException', (e) => {
  console.log("uncaught child", e)
})

