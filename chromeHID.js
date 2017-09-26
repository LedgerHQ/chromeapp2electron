var HID = require('node-hid');
var devicesTable = {};
var matchTable = {};
var connectionTable = {};

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

deviceToHid = (device, id) => {
  return {
    deviceId: id,
    vendorId: device.vendorId,
    productId: device.productId,
    productName: device.product,
    serialNumber: device.serialNumber,
    collections: [
      {
        reportIds: [],
        usage: 1,
        usagePage: 65440
      }
    ],
    maxInputReportSize: 64,
    maxOutputReportSize: 64,
    maxFeatureReportSize: 0,
    reportDescriptor: new ArrayBuffer, //getinterface
  };
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

function toBuffer(ab) {
  var buf = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

function test(buf) {
  var list = []
  for (i = 0; i<buf.length; ++i) {
    list.push(buf.readUInt8(i))
  }
  return list;
}

chrome.hid = {
  getDevices: (options, cb) => {
    var devices = HID.devices();
    devicesTable = {};
    specificTable = {};
    matchTable = {};
    addDevice = (device, spec) => {
      var hash = device.path.hashCode();
      matchTable[hash] = device;
      devicesTable[hash] = deviceToHid(device, hash);
      if (spec) {
        specificTable[hash] = deviceToHid(device, hash);        
      }
    }
    for(var i = 0; i+1 <= devices.length; i++) {
      var id = {
        vendorId: devices[i].vendorId,
        productId: devices[i].productId
      };
      if (options.hasOwnProperty("filters")) {
        if (options.filters.length > 0) {
          for (var j = 0; j < options.filters.length ; j++) {
            if (id.productId === options.filters[j].productId && id.vendorId === options.filters[j].vendorId) {
              addDevice(devices[i], true);
            }
          }
        } else {
          addDevice(devices[i], true);
        }
      } else if (id.productId === options.productId && id.vendorId === options.vendorId) {
        addDevice(devices[i], true)
      } else {
        addDevice(devices[i], false);
      }
    }
    cb(Object.values(specificTable));
  },
  connect: (deviceId, cb) => {
    if (!connectionTable[deviceId]) {
      connectionTable[deviceId] = new HID.HID(matchTable[deviceId].path);
    }
    cb({connectionId: deviceId})  
  },
  disconnect: (connectionId, cb) => {
    connectionTable[connectionId].close();
    connectionTable[connectionId] = null;
    if (cb) {
      cb()
    };
  },
  receive: (connectionId, cb) => { //device.read(err, data)
    connectionTable[connectionId].on("data", (data) =>  {//on crashes
      var reportId = 0;
      console.log("received data", data)
      cb(reportId, data)
    })
    //cb(0, hexToArrayBuffer('01010500000002698200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'))    
  },
  send: (connectionId, reportId, data, cb) => {
    // reportId is always 0 in the case of ledger wallet chrome
    connectionTable[connectionId].write(data) // BUG: if the first byte of a write() is 0x00, you may need to prepend an extra 0x00 due to a bug in hidapi (see issue #187)
    cb();
  }
};



