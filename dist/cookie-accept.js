"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Cookie Accept
 * @param {Object} options
 */
var CookieAccept = exports["default"] = /*#__PURE__*/function () {
  function CookieAccept(options) {
    _classCallCheck(this, CookieAccept);
    // TODO: Find a better way to set default options
    this.options = options || {};
    this.options.gtm = options.gtm || {};
    this.options.events = options.events || {};
    this.name = this.options.name || 'cookies-accept';
    this.days = this.options.days || 365;
    this.path = this.options.path || '/';
    this.defaultValue = this.options.defaultValue || {
      functional: true,
      analyzing: false,
      marketing: false
    };
    this.gtm = {
      enabled: this.options.gtm.enabled || false,
      event: this.options.gtm.event || 'enableCookies'
    };

    // TODO: Should we keep this, or is it overkill? What if we use two cookie-accept instances on one page?
    this.eventPrefix = '';
    this.events = {
      cookieExistsOnLoad: this._prependPrefixToEventName('CookieExistsOnLoad'),
      cookieDoesNotExistOnLoad: this._prependPrefixToEventName('CookieDoesNotExistOnLoad'),
      cookieUpdated: this._prependPrefixToEventName('CookieUpdated'),
      cookieSettingsPushedToDataLayer: this._prependPrefixToEventName('CookieSettingsPushedToDataLayer')
    };
    this.checkboxSelector = this.options.checkboxSelector || '[data-ca-checkbox]';
    this.acceptTriggerSelector = this.options.acceptTriggerSelector || '[data-ca-accept]';
    this.rejectTriggerSelector = this.options.rejectTriggerSelector || '[data-ca-reject]';
    this.updateTriggerSelector = this.options.updateTriggerSelector || '[data-ca-update]';
    this.checkboxes = Array.from(document.querySelectorAll(this.checkboxSelector));
    this.acceptTriggers = Array.from(document.querySelectorAll(this.acceptTriggerSelector));
    this.rejectTriggers = Array.from(document.querySelectorAll(this.rejectTriggerSelector));
    this.updateTriggers = Array.from(document.querySelectorAll(this.updateTriggerSelector));
    this._init();
  }
  _createClass(CookieAccept, [{
    key: "_init",
    value: function _init() {
      var _this = this;
      var cookieValue = this._getCookieValue();
      if (cookieValue) {
        this.constructor._dispatchEvent(this.events.cookieExistsOnLoad, {
          cookieValue: cookieValue
        });
      } else {
        cookieValue = this.defaultValue;
        this.constructor._dispatchEvent(this.events.cookieDoesNotExistOnLoad, {
          cookieValue: cookieValue
        });
      }
      if (this.gtm.enabled) {
        this._setDataLayer(cookieValue);
      }
      this._setCheckboxesFromCookieValue(cookieValue);
      this.acceptTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _this._generateAcceptedCookieValueFromCheckboxes();
          _this._updateCookie(newCookieValue);
          _this._setCheckboxesFromCookieValue(newCookieValue);
        });
      });
      this.rejectTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _this._generateRejectedCookieValueFromCheckboxes();
          _this._updateCookie(newCookieValue);
          _this._setCheckboxesFromCookieValue(newCookieValue);
        });
      });
      this.updateTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _this._generateCookieValueFromCheckboxes();
          _this._updateCookie(newCookieValue);
        });
      });
    }
  }, {
    key: "_getCookieValue",
    value: function _getCookieValue() {
      var cookieArr = document.cookie.split(';');
      for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split('=');
        if (this.name === cookiePair[0].trim()) {
          return JSON.parse(decodeURIComponent(cookiePair[1]));
        }
      }
      return null;
    }
  }, {
    key: "_setCookieValue",
    value: function _setCookieValue(payload) {
      document.cookie = this._createCookieValue(payload);
    }
  }, {
    key: "_createCookieValue",
    value: function _createCookieValue(payload) {
      var cookieValue = payload;
      var expires = new Date();
      if (payload instanceof Object) {
        cookieValue = JSON.stringify(payload);
      }
      expires.setTime(expires.getTime() + this.days * 24 * 60 * 60 * 1000);
      return "".concat(this.name, "=").concat(cookieValue, "; expires=").concat(expires.toUTCString(), "; path=").concat(this.path);
    }
  }, {
    key: "_updateCookie",
    value: function _updateCookie(cookieValue) {
      if (this.gtm.enabled) {
        this._setDataLayer(cookieValue);
      }
      this._setCookieValue(cookieValue);
      this.constructor._dispatchEvent(this.events.cookieUpdated, {
        cookieValue: cookieValue
      });
    }
  }, {
    key: "_setDataLayer",
    value: function _setDataLayer(cookieValue) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: this.gtm.event,
        cookies: cookieValue
      });

      // TODO(ben): What is this for? Can we remove it?
      this.constructor._dispatchEvent(this.events.cookieSettingsPushedToDataLayer, {
        cookieValue: cookieValue
      });
    }
  }, {
    key: "_generateCookieValueFromCheckboxes",
    value: function _generateCookieValueFromCheckboxes() {
      var object = {};
      for (var i = 0; i < this.checkboxes.length; i++) {
        object[this.checkboxes[i].name] = this.checkboxes[i].checked;
      }
      return object;
    }
  }, {
    key: "_generateAcceptedCookieValueFromCheckboxes",
    value: function _generateAcceptedCookieValueFromCheckboxes() {
      var object = {};
      for (var i = 0; i < this.checkboxes.length; i++) {
        object[this.checkboxes[i].name] = true;
      }
      return object;
    }
  }, {
    key: "_generateRejectedCookieValueFromCheckboxes",
    value: function _generateRejectedCookieValueFromCheckboxes() {
      var object = {};
      for (var i = 0; i < this.checkboxes.length; i++) {
        object[this.checkboxes[i].name] = this.checkboxes[i].disabled;
      }
      return object;
    }
  }, {
    key: "_setCheckboxesFromCookieValue",
    value: function _setCheckboxesFromCookieValue(cookieValue) {
      for (var i = 0; i < this.checkboxes.length; i++) {
        if (Object.prototype.hasOwnProperty.call(cookieValue, this.checkboxes[i].name)) {
          this.checkboxes[i].checked = cookieValue[this.checkboxes[i].name];
        }
      }
    }
  }, {
    key: "_prependPrefixToEventName",
    value: function _prependPrefixToEventName(eventName) {
      return "".concat(this.eventPrefix).concat(eventName);
    }
  }], [{
    key: "_dispatchEvent",
    value: function _dispatchEvent(eventName, payload) {
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: payload
      }));
    }
  }]);
  return CookieAccept;
}();