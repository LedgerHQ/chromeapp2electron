//var usb = require('usb')


var devicesTable = {};
var matchTable = {};
var connectionTable = {};
deviceToUsb = (device, id) => {
  return {
    deviceId: device.id,
    vendorId: vendorId,
    productId: productId,
    version: 0,
    productName: product,
    manufacturername: '',
    serialNumber: serialNumber,
  };
}


chrome.usb = {
  getDevices: (options, cb) => {
    cb([]);
  },
  findDevices: (options, cb) => {
    cb([]);
  },
  listInterfaces: (handle, cb) => {
    cb([]);
  },
  claimInterface: (handle, interfacenb, cb) => {
    cb();
  },
  releaseInterface: (handle, interfacenb, cb) => {
    cb();
  },
  bulkTransfer: (h, ti, cb) => {
  }
};
  