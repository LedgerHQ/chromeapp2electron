var HID = require('node-hid');
var devicesTable = {};
var matchTable = {};
var connectionTable = {};

deviceToHid = (device, id) => {
  return {
    deviceId: device.id,
    vendorId: vendorId,
    productId: productId,
    productName: product,
    serialNumber: serialNumber,
    collections: [],
    maxInputReportSize: 256,
    maxOutputReportSize: 256,
    maxFeatureReportSize: 256,
    reportDescriptor: null, //getinterface

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
    for(i = 0; i <= devices.length; i++) {
      var id = {
        vendorId: devices[i].vendorId,
        productId: devices[i].productId
      };
      if (options.hasOwnProperty("filters")) {
        if (options.filters.include(id)) {
          deviceCount++;
          matchTable[deviceCount] = devices[i];
          devicesTable[deviceCount] = deviceToHid(devices[i], deviceCount);
        }
      } else if (id === options) {
        deviceCount++;
        matchTable[deviceCount] = devices[i];
        devicesTable[deviceCount] = deviceToHid(devices[i], deviceCount);
      }
    }
    cb(devicesTable.values());
  },
  connect: (deviceId, cb) => {
    var device = new HID.HID(matchTable[deviceId].path);
    connectionTable[deviceId] = device;
    cb(connectionId)  
  },
  disconnect: (connectionId, cb) => {
    connectionTable[deviceId].close();
    connectionTable[deviceId] = null;
    if (cb) {
      cb(connectionId)
    };
  },
  receive: (connectionId, cb) => {
    connectionTable[deviceId].on("data", (data) => {
      var reportId = 0;
      var dataConverted = toArrayBuffer(data)
      cb(reportId, dataConverted) //convert
    })
  },
  send: (connectionId, reportId, data, cb) => {
    // reportId is always 0 in the case of ledger wallet chrome
    var dataConverted = toBuffer(data);
    connectionTable[deviceId].write(data) // BUG: if the first byte of a write() is 0x00, you may need to prepend an extra 0x00 due to a bug in hidapi (see issue #187)
    cb();
  }
};

  

    



