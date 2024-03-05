const ConsentCheckboxes = {

    generateCookieValueFromCheckboxes(checkboxes) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            object[checkboxes[i].name] = checkboxes[i].checked;
        }

        return object;
    },

    generateAcceptedCookieValueFromCheckboxes(checkboxes) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            object[checkboxes[i].name] = true;
        }

        return object;
    },

    generateRejectedCookieValueFromCheckboxes(checkboxes) {
        const object = {};

        for (let i = 0; i < checkboxes.length; i++) {
            // We assume that the required / functional consent is disabled in the consent banner
            // And that all the other consent checkboxes are never disabled. This way we can
            // retrieve all rejectable cookie values by checking the disabled attribute
            object[checkboxes[i].name] = checkboxes[i].disabled;
        }

        return object;
    },

    setCheckboxesFromCookieValue(cookieValue, checkboxes) {
        for (let i = 0; i < checkboxes.length; i++) {
            if (Object.prototype.hasOwnProperty.call(cookieValue, checkboxes[i].name)) {
                checkboxes[i].checked = cookieValue[checkboxes[i].name];
            }
        }
    }

};

export {ConsentCheckboxes as default}