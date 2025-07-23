const ConsentCheckboxes = {
    updateCheckboxesByCookieValue(checkboxes, cookieValue) {
        for (let i = 0; i < checkboxes.length; i++) {
            if (Object.prototype.hasOwnProperty.call(cookieValue, checkboxes[i].name)) {
                checkboxes[i].checked = cookieValue[checkboxes[i].name];
            }
        }

        return checkboxes;
    },

    toCookieValues(checkboxes) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            object[checkboxes[i].name] = checkboxes[i].checked;
        }

        return object;
    },

    toCookieValuesForcedToTrue(checkboxes) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            object[checkboxes[i].name] = true;
        }

        return object;
    },

    toCookieValuesForcedToFalse(checkboxes, requiredConsentNames = []) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            // We assume that the required / functional consent is disabled in the consent banner
            // And that all the other consent checkboxes are never disabled. This way we can
            // retrieve all rejectable cookie values by checking the disabled attribute
            object[checkboxes[i].name] = !!requiredConsentNames.includes(checkboxes[i].name);
        }

        return object;
    },
};

export { ConsentCheckboxes as default };
