var usb = require('usb')

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
  findDevices: () => {

  },
  listInterfaces: () => {

  },
  claimInterface: () => {

  },
  releaseInterface: () => {

  },
  bulkTransfer: () => {
    
  }
};
  