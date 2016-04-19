/*global cordova, module*/

module.exports = {
  setting: function (name, successCallback, errorCallback, op1) {
    cordova.exec(successCallback, errorCallback, "KickIntent", "setting", [name, op1]);
  },
  toast: function (message, successCallback, errorCallback, op1) {
    cordova.exec(successCallback, errorCallback, "KickIntent", "toast", [message, op1]);
  },
  flags: function (name, successCallback, errorCallback, op1) {
    cordova.exec(successCallback, errorCallback, "KickIntent", "flags", [name, op1]);
  },
  brightness: function (value, successCallback, errorCallback, op1) {
    cordova.exec(successCallback, errorCallback, "KickIntent", "brightness", [value, op1]);
  },
  close: {}
};
