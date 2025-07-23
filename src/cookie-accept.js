import ConsentCookie from './ConsentCookie';
import ConsentCheckboxes from './ConsentCheckboxes';

/**
 * Cookie Accept
 * @param {Object} options
 */
export default class CookieAccept {
    constructor(options = {}) {
        const gtmOptions = options.gtm || {};
        const eventsOptions = options.events || {};

        this.namespace = options.namespace || 'default';

        // Consents - object with keys and boolean values
        // Values set to true are the required consents and cannot be disabled by the user
        this.consents = options.consents || {
            functional: true,
            analyzing: false,
            marketing: false,
        };

        // Cookie settings
        this.cookieName = options.name || 'cookies-accept';
        this.cookieDays = options.days || 60;
        this.cookiePath = options.path || '/';

        // Google Tag Manager
        this.gtm = {
            enabled: gtmOptions.enabled || false,
            event: gtmOptions.event || 'enableCookies',
        };

        // Events
        this.events = {
            cookieExistsOnLoad: eventsOptions.cookieExistsOnLoad || 'CookieExistsOnLoad',
            cookieDoesNotExistOnLoad: eventsOptions.cookieDoesNotExistOnLoad || 'CookieDoesNotExistOnLoad',
            cookieUpdated: eventsOptions.cookieUpdated || 'CookieUpdated',
            cookieSettingsPushedToDataLayer:
                eventsOptions.cookieSettingsPushedToDataLayer || 'CookieSettingsPushedToDataLayer',
        };

        // Consent Banner DOM
        this.checkboxes = Array.from(document.querySelectorAll(options.checkboxSelector || '[data-ca-checkbox]'));
        this.acceptTriggers = Array.from(
            document.querySelectorAll(options.acceptTriggerSelector || '[data-ca-accept]')
        );
        this.rejectTriggers = Array.from(
            document.querySelectorAll(options.rejectTriggerSelector || '[data-ca-reject]')
        );
        this.updateTriggers = Array.from(
            document.querySelectorAll(options.updateTriggerSelector || '[data-ca-update]')
        );

        this._init();
    }

    _init() {
        let cookieValue = ConsentCookie.getValue(this.cookieName);

        if (cookieValue) {
            this.constructor._dispatchEvent(this.events.cookieExistsOnLoad, { cookieValue, namespace: this.namespace });
        } else {
            cookieValue = this.consents;

            this.constructor._dispatchEvent(this.events.cookieDoesNotExistOnLoad, {
                cookieValue,
                namespace: this.namespace,
            });
        }

        if (this.gtm.enabled) {
            this._setDataLayer(cookieValue);
        }

        ConsentCheckboxes.updateCheckboxesByCookieValue(this.checkboxes, cookieValue);

        this.acceptTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.toCookieValuesForcedToTrue(this.checkboxes);

                this._updateCookie(newCookieValue);
                this.checkboxes = ConsentCheckboxes.updateCheckboxesByCookieValue(this.checkboxes, newCookieValue);
            });
        });

        this.rejectTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.toCookieValuesForcedToFalse(
                    this.checkboxes,
                    Object.keys(this.consents).filter((consentName) => !!this.consents[consentName])
                );

                this._updateCookie(newCookieValue);
                ConsentCheckboxes.updateCheckboxesByCookieValue(this.checkboxes, newCookieValue);
            });
        });

        this.updateTriggers.forEach((trigger) => {
            trigger.addEventListener('click', () => {
                const newCookieValue = ConsentCheckboxes.toCookieValues(this.checkboxes);

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
            namespace: this.namespace,
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
            namespace: this.namespace,
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
