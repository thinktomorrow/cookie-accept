/**
 * Cookie Accept
 * @param {Object} options
 */
export default class CookieAccept {
    constructor(options) {
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
            marketing: false,
        };

        this.gtm = {
            enabled: this.options.gtm.enabled || false,
            event: this.options.gtm.event || 'enableCookies',
        };

        // TODO: Should we keep this, or is it overkill? What if we use two cookie-accept instances on one page?
        this.eventPrefix = '';
        this.events = {
            cookieExistsOnLoad: this._prependPrefixToEventName('CookieExistsOnLoad'),
            cookieDoesNotExistOnLoad: this._prependPrefixToEventName('CookieDoesNotExistOnLoad'),
            cookieUpdated: this._prependPrefixToEventName('CookieUpdated'),
            cookieSettingsPushedToDataLayer: this._prependPrefixToEventName('CookieSettingsPushedToDataLayer'),
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

    _init() {
        let cookieValue = this._getCookieValue();

        if (cookieValue) {
            this.constructor._dispatchEvent(this.events.cookieExistsOnLoad, {
                cookieValue,
            });
        } else {
            cookieValue = this.defaultValue;

            this.constructor._dispatchEvent(this.events.cookieDoesNotExistOnLoad, {
                cookieValue,
            });
        }

        if (this.gtm.enabled) {
            this._setDataLayer(cookieValue);
        }

        this._setCheckboxesFromCookieValue(cookieValue);

        this.acceptTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = this._generateAcceptedCookieValueFromCheckboxes();

                this._updateCookie(newCookieValue);

                this._setCheckboxesFromCookieValue(newCookieValue);
            });
        });

        this.rejectTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = this._generateRejectedCookieValueFromCheckboxes();

                this._updateCookie(newCookieValue);

                this._setCheckboxesFromCookieValue(newCookieValue);
            });
        });

        this.updateTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = this._generateCookieValueFromCheckboxes();

                this._updateCookie(newCookieValue);
            });
        });
    }

    _getCookieValue() {
        const cookieArr = document.cookie.split(';');

        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split('=');

            if (this.name === cookiePair[0].trim()) {
                return JSON.parse(decodeURIComponent(cookiePair[1]));
            }
        }

        return null;
    }

    _setCookieValue(payload) {
        document.cookie = this._createCookieValue(payload);
    }

    _createCookieValue(payload) {
        let cookieValue = payload;
        const expires = new Date();

        if (payload instanceof Object) {
            cookieValue = JSON.stringify(payload);
        }

        expires.setTime(expires.getTime() + this.days * 24 * 60 * 60 * 1000);

        return `${this.name}=${cookieValue}; expires=${expires.toUTCString()}; path=${this.path}`;
    }

    _updateCookie(cookieValue) {
        if (this.gtm.enabled) {
            this._setDataLayer(cookieValue);
        }

        this._setCookieValue(cookieValue);

        this.constructor._dispatchEvent(this.events.cookieUpdated, {
            cookieValue,
        });
    }

    _setDataLayer(cookieValue) {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: this.gtm.event,
            cookies: cookieValue,
        });

        // TODO(ben): What is this for? Can we remove it?
        this.constructor._dispatchEvent(this.events.cookieSettingsPushedToDataLayer, {
            cookieValue,
        });
    }

    _generateCookieValueFromCheckboxes() {
        const object = {};

        for (let i = 0; i < this.checkboxes.length; i++) {
            object[this.checkboxes[i].name] = this.checkboxes[i].checked;
        }

        return object;
    }

    _generateAcceptedCookieValueFromCheckboxes() {
        const object = {};

        for (let i = 0; i < this.checkboxes.length; i++) {
            object[this.checkboxes[i].name] = true;
        }

        return object;
    }

    _generateRejectedCookieValueFromCheckboxes() {
        const object = {};

        for (let i = 0; i < this.checkboxes.length; i++) {
            object[this.checkboxes[i].name] = this.checkboxes[i].disabled;
        }

        return object;
    }

    _setCheckboxesFromCookieValue(cookieValue) {
        for (let i = 0; i < this.checkboxes.length; i++) {
            if (Object.prototype.hasOwnProperty.call(cookieValue, this.checkboxes[i].name)) {
                this.checkboxes[i].checked = cookieValue[this.checkboxes[i].name];
            }
        }
    }

    _prependPrefixToEventName(eventName) {
        return `${this.eventPrefix}${eventName}`;
    }

    static _dispatchEvent(eventName, payload) {
        document.dispatchEvent(
            new CustomEvent(eventName, {
                detail: payload,
            })
        );
    }
}
