const ConsentCookie = {
    getValue(name) {
        const cookieArr = document.cookie.split(';');

        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split('=');

            if (name === cookiePair[0].trim()) {
                return JSON.parse(decodeURIComponent(cookiePair[1]));
            }
        }

        return null;
    },

    setValue(payload, name, path, days) {
        document.cookie = ConsentCookie._createValue(payload, name, path, days);
    },

    _createValue(payload, name, path, days) {
        let cookieValue = payload;
        const expires = new Date();

        if (payload instanceof Object) {
            cookieValue = JSON.stringify(payload);
        }

        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

        return `${name}=${cookieValue}; expires=${expires.toUTCString()}; path=${path}`;
    },
};

export { ConsentCookie as default };
