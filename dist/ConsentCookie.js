"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var ConsentCookie = exports["default"] = {
  getValue: function getValue(name) {
    var cookieArr = document.cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');
      if (name === cookiePair[0].trim()) {
        try {
          return JSON.parse(decodeURIComponent(cookiePair[1]));
        } catch (e) {
          return decodeURIComponent(cookiePair[1]);
        }
      }
    }
    return null;
  },
  setValue: function setValue(payload, name, path, days) {
    document.cookie = ConsentCookie._createValue(payload, name, path, days);
  },
  _createValue: function _createValue(payload, name, path, days) {
    var cookieValue = payload;
    if (payload instanceof Object) {
      cookieValue = JSON.stringify(payload);
    }
    return "".concat(name, "=").concat(cookieValue, "; expires=").concat(ConsentCookie._createDateUTCString(days), "; path=").concat(path);
  },
  _createDateUTCString: function _createDateUTCString(days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    return expires.toUTCString();
  }
};