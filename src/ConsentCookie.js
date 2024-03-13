const ConsentCookie = {
    getValue(name) {
        const cookieArr = document.cookie.split(';');

        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split('=');

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

    setValue(payload, name, path, days) {
        document.cookie = ConsentCookie._createValue(payload, name, path, days);
    },

    _createValue(payload, name, path, days) {
        let cookieValue = payload;

        if (payload instanceof Object) {
            cookieValue = JSON.stringify(payload);
        }

        return `${name}=${cookieValue}; expires=${ConsentCookie._createDateUTCString(days)}; path=${path}`;
    },

    _createDateUTCString(days) {
        const expires = new Date();

        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

        return expires.toUTCString();
    },
};

export { ConsentCookie as default };
