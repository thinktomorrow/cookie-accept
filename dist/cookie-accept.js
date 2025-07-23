"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _ConsentCookie = _interopRequireDefault(require("./ConsentCookie"));
var _ConsentCheckboxes = _interopRequireDefault(require("./ConsentCheckboxes"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Cookie Accept
 * @param {Object} options
 */
var CookieAccept = exports["default"] = /*#__PURE__*/function () {
  function CookieAccept() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, CookieAccept);
    var gtmOptions = options.gtm || {};
    var eventsOptions = options.events || {};
    this.namespace = options.namespace || 'default';

    // Consents - object with keys and boolean values
    // Values set to true are the required consents and cannot be disabled by the user
    this.consents = options.consents || {
      functional: true,
      analyzing: false,
      marketing: false
    };

    // Cookie settings
    this.cookieName = options.name || 'cookies-accept';
    this.cookieDays = options.days || 60;
    this.cookiePath = options.path || '/';

    // Google Tag Manager
    this.gtm = {
      enabled: gtmOptions.enabled || false,
      event: gtmOptions.event || 'enableCookies'
    };

    // Events
    this.events = {
      cookieExistsOnLoad: eventsOptions.cookieExistsOnLoad || 'CookieExistsOnLoad',
      cookieDoesNotExistOnLoad: eventsOptions.cookieDoesNotExistOnLoad || 'CookieDoesNotExistOnLoad',
      cookieUpdated: eventsOptions.cookieUpdated || 'CookieUpdated',
      cookieSettingsPushedToDataLayer: eventsOptions.cookieSettingsPushedToDataLayer || 'CookieSettingsPushedToDataLayer'
    };

    // Consent Banner DOM
    this.checkboxes = Array.from(document.querySelectorAll(options.checkboxSelector || '[data-ca-checkbox]'));
    this.acceptTriggers = Array.from(document.querySelectorAll(options.acceptTriggerSelector || '[data-ca-accept]'));
    this.rejectTriggers = Array.from(document.querySelectorAll(options.rejectTriggerSelector || '[data-ca-reject]'));
    this.updateTriggers = Array.from(document.querySelectorAll(options.updateTriggerSelector || '[data-ca-update]'));
    this._init();
  }
  return _createClass(CookieAccept, [{
    key: "_init",
    value: function _init() {
      var _this = this;
      var cookieValue = _ConsentCookie["default"].getValue(this.cookieName);
      if (cookieValue) {
        this.constructor._dispatchEvent(this.events.cookieExistsOnLoad, {
          cookieValue: cookieValue,
          namespace: this.namespace
        });
      } else {
        cookieValue = this.consents;
        this.constructor._dispatchEvent(this.events.cookieDoesNotExistOnLoad, {
          cookieValue: cookieValue,
          namespace: this.namespace
        });
      }
      if (this.gtm.enabled) {
        this._setDataLayer(cookieValue);
      }
      _ConsentCheckboxes["default"].updateCheckboxesByCookieValue(this.checkboxes, cookieValue);
      this.acceptTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _ConsentCheckboxes["default"].toCookieValuesForcedToTrue(_this.checkboxes);
          _this._updateCookie(newCookieValue);
          _this.checkboxes = _ConsentCheckboxes["default"].updateCheckboxesByCookieValue(_this.checkboxes, newCookieValue);
        });
      });
      this.rejectTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _ConsentCheckboxes["default"].toCookieValuesForcedToFalse(_this.checkboxes, Object.keys(_this.consents).filter(function (consentName) {
            return !!_this.consents[consentName];
          }));
          _this._updateCookie(newCookieValue);
          _ConsentCheckboxes["default"].updateCheckboxesByCookieValue(_this.checkboxes, newCookieValue);
        });
      });
      this.updateTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var newCookieValue = _ConsentCheckboxes["default"].toCookieValues(_this.checkboxes);
          _this._updateCookie(newCookieValue);
        });
      });
    }
  }, {
    key: "_updateCookie",
    value: function _updateCookie(cookieValue) {
      if (this.gtm.enabled) {
        this._setDataLayer(cookieValue);
      }
      _ConsentCookie["default"].setValue(cookieValue, this.cookieName, this.cookiePath, this.cookieDays);
      this.constructor._dispatchEvent(this.events.cookieUpdated, {
        cookieValue: cookieValue,
        namespace: this.namespace
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
      this.constructor._dispatchEvent(this.events.cookieSettingsPushedToDataLayer, {
        cookieValue: cookieValue,
        namespace: this.namespace
      });
    }
  }], [{
    key: "_dispatchEvent",
    value: function _dispatchEvent(eventName, payload) {
      document.dispatchEvent(new CustomEvent(eventName, {
        detail: payload
      }));
    }
  }]);
}();