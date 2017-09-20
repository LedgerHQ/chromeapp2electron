var HID = require('node-hid');
var devicesTable = {};
var matchTable = {};
var connectionTable = {};
var connectionCount = 0;
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
chrome.hid = {
  getDevices: (options, cb) => {
    var deviceCount = 0;    
    var devices = HID.devices();
    devicesTable = {};
    matchTable = {};
    for(i = 0; i+1 <= devices.length; i++) {
      var id = {
        vendorId: devices[i].vendorId,
        productId: devices[i].productId
      };
      if (options.hasOwnProperty("filters")) {
        if (options.filters.length > 0) {
          if (options.filters.include(id)) {
            deviceCount++;
            matchTable[deviceCount] = devices[i];
            devicesTable[deviceCount] = deviceToHid(devices[i], deviceCount);
          }
        } else {
          deviceCount++;
          matchTable[deviceCount] = devices[i];
          devicesTable[deviceCount] = deviceToHid(devices[i], deviceCount);
        }
        
      } else if (id.productId === options.productId && id.vendorId === options.vendorId) {
        deviceCount++;
        matchTable[deviceCount] = devices[i];
        devicesTable[deviceCount] = deviceToHid(devices[i], deviceCount);
      }
    }
    cb(Object.values(devicesTable));
  },
  connect: (deviceId, cb) => {
    var device = new HID.HID(matchTable[deviceId].path);
    connectionTable[connectionCount] = device;
    connectionCount++;
    cb(connectionCount-1)  
  },
  disconnect: (connectionId, cb) => {
    connectionTable[connectionId].close();
    connectionTable[connectionId] = null;
    if (cb) {
      cb(connectionId)
    };
  },
  receive: (connectionId, cb) => {
    connectionTable[connectionId].on("data", (data) => {
      var reportId = 0;
      var dataConverted = toArrayBuffer(data)
      console.log("received data", data, dataConverted)
      cb(reportId, dataConverted)
    })
  },
  send: (connectionId, reportId, data, cb) => {
    // reportId is always 0 in the case of ledger wallet chrome
    var dataConverted = toBuffer(data);
    console.log("trying to", dataConverted)
    connectionTable[connectionId].write(dataConverted) // BUG: if the first byte of a write() is 0x00, you may need to prepend an extra 0x00 due to a bug in hidapi (see issue #187)
    cb();
  }
};



