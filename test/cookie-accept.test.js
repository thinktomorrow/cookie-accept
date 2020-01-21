import CookieAccept from '../dist/cookie-accept.js';

afterEach(() => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});

test('it can set a basic cookie', () => {
    document.body.innerHTML =
        '<section data-cookiebar>' +
        '   <a data-cookiebar-accept></a>' +
        '</section>';

    window.CookieAccept = new CookieAccept({
        name: 'basic',
        days: 7,
        gtmEnabled: false,
    });

    document.querySelector('[data-cookiebar-accept]').click();

    expect(document.cookie).toEqual(expect.stringContaining('basic={}'));
});

test('by default cookie path is the root domain', () => {
    document.body.innerHTML =
        '<section data-cookiebar>' +
        '   <a data-cookiebar-accept></a>' +
        '</section>';

    const cookieAccept = new CookieAccept({});

    expect(cookieAccept._createCookieValue('cookie-value')).toEqual(expect.stringContaining('path=/'));
});

test('it can set a custom cookie path', () => {
    document.body.innerHTML =
        '<section data-cookiebar>' +
        '   <a data-cookiebar-accept></a>' +
        '</section>';

    const cookieAccept = new CookieAccept({
        path: '/subpath'
    });

    expect(cookieAccept._createCookieValue('cookie-value')).toEqual(expect.stringContaining('path=/subpath'));
});

test('it can set cookie in the dataLayer', () => {
    document.body.innerHTML =
        '<section data-cookiebar data-cookiebar-default="functional">' +
        '   <input data-cookiebar-checkbox type="checkbox" name="functional" checked>' +
        '   <input data-cookiebar-checkbox type="checkbox" name="analyzing">' +
        '   <input data-cookiebar-checkbox type="checkbox" name="marketing" checked>' +
        '   <a data-cookiebar-accept></a>' +
        '</section>';

    window.CookieAccept = new CookieAccept({
        name: 'legal-cookies',
        days: 7,
        gtmEnabled: true,
    });

    document.querySelector('[data-cookiebar-accept]').click();

    expect(dataLayer).toEqual(expect.arrayContaining([{"cookies": {"analyzing": false, "functional": true, "marketing": false}, "event": "enableCookies"}]));
})
