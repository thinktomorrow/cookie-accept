import CookieAccept from '../cookie-accept.js';

afterEach(() => {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
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

test('it can set a very basic cookie', () => {
    console.log(document.cookie);
    document.body.innerHTML =
        '<section data-cookiebar>' + 
        '   <a data-cookiebar-accept></a>' +
        '</section>';

    window.CookieAccept = new CookieAccept({
        name: 'legal-cookies',
        days: 7,
        gtmEnabled: false,
    });

    document.querySelector('[data-cookiebar-accept]').click();

    expect(document.cookie).toEqual(expect.stringContaining('legal-cookies={}'));
})