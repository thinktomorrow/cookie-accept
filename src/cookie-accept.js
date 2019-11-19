export default class CookieAccept {
    
    constructor(options) {

        options = options || {};

        // defaults
        this.name       = options.name || "cookies-accept";
        this.days       = options.days || 365;
        this.gtmEnabled = options.gtmEnabled;
        this.gtm        = options.gtm || {};
        this.gtm.event  = options.gtm.event || 'enableCookies';

        this.cookiebar           = document.querySelector('[data-cookiebar]');
        this.defaultCookieValues = document.querySelector('[data-cookiebar-default]') ? document.querySelector('[data-cookiebar-default]').dataset.cookiebarDefault : '';
        this.acceptTriggers      = document.querySelectorAll('[data-cookiebar-accept]');
        this.dismissTriggers     = document.querySelectorAll('[data-cookiebar-dismiss]');
        this.checkboxes          = document.querySelectorAll('[data-cookiebar-checkbox]');
        
        this._init();
    }

    _init() {
        let existingCookie = this._getCookieValue();

        if(this.gtmEnabled) {
            this._setDataLayer(existingCookie || this._getDefaultCookieValue());
        } 
        
        if(existingCookie == null) this._show();
        
        for (let i = 0; i < this.acceptTriggers.length; i++) {
            this.acceptTriggers[i].addEventListener('click', () => {
                let value = this._createCookieValue();
                if(this.gtmEnabled) this._setDataLayer(value);
                this._accept(value);
                this._close();
            }, true);
        }

        for (let i = 0; i < this.dismissTriggers.length; i++) {
            this.dismissTriggers[i].addEventListener('click', () => this._dismiss(), true);
        }
    }

    _setDataLayer(value) {
        window.dataLayer = window.dataLayer || []
        dataLayer.push({
            'event': this.gtm.event,
            'cookies': value,
        });
    }

    _getDefaultCookieValue() {
        let object = {};
        for(let i = 0; i < this.checkboxes.length; i++) {
            object[this.checkboxes[i].name] = this.defaultCookieValues.split('|').includes(this.checkboxes[i].name);
        }
        return object;
    }

    _getCookieValue() {
        let cookieArr = document.cookie.split(";");
        for(let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("=");
            if(this.name == cookiePair[0].trim()) {
                return JSON.parse(decodeURIComponent(cookiePair[1]));
            }
        }
        return null;
    }

    _createCookieValue() {
        let object = {};
        for(let i = 0; i < this.checkboxes.length; i++) {
            object[this.checkboxes[i].name] = this.checkboxes[i].checked;
        }
        return object;
    }

    _dismiss() {    
        this._close();
    }

    _accept(value) {
        let expires = new Date();
        expires.setTime(expires.getTime() + this.days * 24 * 60 * 60 * 1000);
        document.cookie = this.name + '=' + JSON.stringify(value) + ';expires=' + expires.toUTCString();
    }

    _close() {
        this.cookiebar.parentNode.removeChild(this.cookiebar);
    }

    _show() {
        this.cookiebar.classList.remove('hidden');
    }
}