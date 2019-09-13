'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CookieAccept = function () {
    function CookieAccept(options) {
        _classCallCheck(this, CookieAccept);

        this.options = options || {};

        // defaults
        this.options.name = this.options.name || "cookies-accept";
        this.options.days = this.options.days || 365; // by default cookies are kept for one year
        this.options.gtmEnabled = this.options.gtmEnabled;
        this.options.gtm = this.options.gtm || {};
        this.options.gtm.event = this.options.gtm.event || 'enableCookies';

        this.cookiebar = document.querySelector('[data-cookiebar]');
        this.defaultCookieValues = document.querySelector('[data-cookiebar-default]') ? document.querySelector('[data-cookiebar-default]').dataset.cookiebarDefault : '';
        this.acceptTriggers = document.querySelectorAll('[data-cookiebar-accept]');
        this.dismissTriggers = document.querySelectorAll('[data-cookiebar-dismiss]');
        this.checkboxes = document.querySelectorAll('[data-cookiebar-checkbox]');

        this._init();
    }

    _createClass(CookieAccept, [{
        key: '_init',
        value: function _init() {
            var _this = this;

            var existingCookie = this._getCookieValue();

            if (this.options.gtmEnabled) {
                this._setDataLayer(existingCookie || this._getDefaultCookieValue());
            }

            if (existingCookie == null) this._show();

            for (var i = 0; i < this.acceptTriggers.length; i++) {
                this.acceptTriggers[i].addEventListener('click', function () {
                    var value = _this._createCookieValue();
                    if (_this.options.gtmEnabled) _this._setDataLayer(value);
                    _this._accept(value);
                    _this._close();
                }, true);
            }

            for (var _i = 0; _i < this.dismissTriggers.length; _i++) {
                this.dismissTriggers[_i].addEventListener('click', function () {
                    return _this._dismiss();
                }, true);
            }
        }
    }, {
        key: '_setDataLayer',
        value: function _setDataLayer(value) {
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                'event': this.options.gtm.event,
                'cookies': value
            });
        }
    }, {
        key: '_getDefaultCookieValue',
        value: function _getDefaultCookieValue() {
            var object = {};
            for (var i = 0; i < this.checkboxes.length; i++) {
                object[this.checkboxes[i].name] = this.defaultCookieValues.split('|').includes(this.checkboxes[i].name);
            }
            return object;
        }
    }, {
        key: '_getCookieValue',
        value: function _getCookieValue() {
            var cookieArr = document.cookie.split(";");
            for (var i = 0; i < cookieArr.length; i++) {
                var cookiePair = cookieArr[i].split("=");
                if (this.options.name == cookiePair[0].trim()) {
                    return JSON.parse(decodeURIComponent(cookiePair[1]));
                }
            }
            return null;
        }
    }, {
        key: '_createCookieValue',
        value: function _createCookieValue() {
            var object = {};
            for (var i = 0; i < this.checkboxes.length; i++) {
                object[this.checkboxes[i].name] = this.checkboxes[i].checked;
            }
            return object;
        }
    }, {
        key: '_dismiss',
        value: function _dismiss() {
            this._close();
        }
    }, {
        key: '_accept',
        value: function _accept(value) {
            var expires = new Date();
            expires.setTime(expires.getTime() + this.options.days * 24 * 60 * 60 * 1000);
            document.cookie = this.options.name + '=' + JSON.stringify(value) + ';expires=' + expires.toUTCString();
        }
    }, {
        key: '_close',
        value: function _close() {
            this.cookiebar.parentNode.removeChild(this.cookiebar);
        }
    }, {
        key: '_show',
        value: function _show() {
            this.cookiebar.classList.remove('hidden');
        }
    }]);

    return CookieAccept;
}();

exports.default = CookieAccept;