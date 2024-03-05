import ConsentCookie from "./ConsentCookie";
import ConsentCheckboxes from "./ConsentCheckboxes";

/**
 * Cookie Accept
 * @param {Object} options
 */
export default class CookieAccept {
    constructor(options = {}) {

        this.namespace = options.namespace || 'default';

        // Cookie settings
        this.cookieName = options.name || 'cookies-accept';
        this.cookieDays = options.days || 60;
        this.cookiePath = options.path || '/';
        this.cookieDefaultValue = options.defaultValue || {
            functional: true,
            analyzing: false,
            marketing: false,
        };

        const gtmOptions = options.gtm || {};

        this.gtm = {
            enabled: gtmOptions.enabled || false,
            event: gtmOptions.event || 'enableCookies',
        };

        this.events = {
            cookieExistsOnLoad: 'CookieExistsOnLoad',
            cookieDoesNotExistOnLoad: 'CookieDoesNotExistOnLoad',
            cookieUpdated: 'CookieUpdated',
            cookieSettingsPushedToDataLayer: 'CookieSettingsPushedToDataLayer',
        };

        // Consent Banner DOM
        this.checkboxes = Array.from(document.querySelectorAll(options.checkboxSelector || '[data-ca-checkbox]'));
        this.acceptTriggers = Array.from(document.querySelectorAll(options.acceptTriggerSelector || '[data-ca-accept]'));
        this.rejectTriggers = Array.from(document.querySelectorAll(options.rejectTriggerSelector || '[data-ca-reject]'));
        this.updateTriggers = Array.from(document.querySelectorAll(options.updateTriggerSelector || '[data-ca-update]'));

        this._init();
    }

    _init() {
        let cookieValue = ConsentCookie.getValue(this.cookieName);

        if (cookieValue) {
            this.constructor._dispatchEvent(this.events.cookieExistsOnLoad, { cookieValue, namespace: this.namespace });
        } else {
            cookieValue = this.cookieDefaultValue;

            this.constructor._dispatchEvent(this.events.cookieDoesNotExistOnLoad, {
                cookieValue,
                namespace: this.namespace
            });
        }

        if (this.gtm.enabled) {
            this._setDataLayer(cookieValue);
        }

        ConsentCheckboxes.setCheckboxesFromCookieValue(cookieValue, this.checkboxes);

        this.acceptTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.generateAcceptedCookieValueFromCheckboxes(this.checkboxes);

                this._updateCookie(newCookieValue);
                ConsentCheckboxes.setCheckboxesFromCookieValue(newCookieValue, this.checkboxes);
            });
        });

        this.rejectTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.generateRejectedCookieValueFromCheckboxes(this.checkboxes);

                this._updateCookie(newCookieValue);
                ConsentCheckboxes.setCheckboxesFromCookieValue(newCookieValue, this.checkboxes);
            });
        });

        this.updateTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.generateCookieValueFromCheckboxes(this.checkboxes);

                this._updateCookie(newCookieValue);
            });
        });
    }

    _updateCookie(cookieValue) {
        if (this.gtm.enabled) {
            this._setDataLayer(cookieValue);
        }

        ConsentCookie.setValue(cookieValue, this.cookieName, this.cookiePath, this.cookieDays);

        this.constructor._dispatchEvent(this.events.cookieUpdated, {
            cookieValue,
            namespace: this.namespace
        });
    }

    _setDataLayer(cookieValue) {
        window.dataLayer = window.dataLayer || [];

        window.dataLayer.push({
            event: this.gtm.event,
            cookies: cookieValue,
        });

        this.constructor._dispatchEvent(this.events.cookieSettingsPushedToDataLayer, {
            cookieValue,
            namespace: this.namespace
        });
    }

    static _dispatchEvent(eventName, payload) {
        document.dispatchEvent(
            new CustomEvent(eventName, {
                detail: payload,
            })
        );
    }
}
