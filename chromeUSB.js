
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
  