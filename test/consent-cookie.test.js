import ConsentCookie from '../dist/ConsentCookie';

afterEach(() => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
});

test('it can get an undefined cookie value', () => {
    expect(ConsentCookie.getValue('xxx')).toEqual(null);
});

test('it can set a cookie', () => {
    ConsentCookie.setValue('cookie-value', 'cookie-name', 'cookie-path', 20)

    expect(document.cookie).toEqual('cookie-name=cookie-value');
    expect(ConsentCookie.getValue('cookie-name')).toEqual('cookie-value');
});

test('it can get a cookie value', () => {

    ConsentCookie.setValue('cookie-value', 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue()).toEqual('cookie-value');
});

test('it cannot get cookie value from unexisting cookie', () => {

    ConsentCookie.setValue('cookie-value', 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue('xxx')).toEqual(
        expect.toEqual('')
    );
});

test('it can set a default cookie path', () => {
    // document.body.innerHTML = `
    //     <section>
    //         <a data-ca-accept></a>
    //     </section>
    // `;

    const cookieAccept = new CookieAccept({});

    expect(ConsentCookie.setValue('cookie-value')).toEqual(expect.stringContaining('path=/'));
});

test('it can set a custom cookie path', () => {
    document.body.innerHTML = `
        <section data-cookiebar>
            <a data-cookiebar-accept></a>
        </section>
    `;

    const cookieAccept = new CookieAccept({
        path: '/subpath',
    });

    expect(cookieAccept._createCookieValue('cookie-value')).toEqual(expect.stringContaining('path=/subpath'));
});

test('it can set a custom cookie expiration time', () => {
    document.body.innerHTML = `
        <section data-cookiebar>
            <a data-cookiebar-accept></a>
        </section>
    `;

    const cookieAccept = new CookieAccept({
        days: 30,
    });

    const expires = new Date();

    expires.setTime(expires.getTime() + 30 * 24 * 60 * 60 * 1000);

    expect(cookieAccept._createCookieValue('cookie-value')).toEqual(
        expect.stringContaining(`expires=${expires.toUTCString()}`)
    );
});
