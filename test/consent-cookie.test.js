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
});

test('it can create a cookie UTC date string', () => {

    const days = 20;
    const dateParsed= new Date(Date.parse(ConsentCookie._createDateUTCString(days)));

    expect(ConsentCookie._createDateUTCString(days)).toStrictEqual(dateParsed.toUTCString());
});

test('it can create a cookie string', () => {

    const days = 20;
    const expires = ConsentCookie._createDateUTCString(days);

    expect(ConsentCookie._createValue('cookie-value', 'cookie-name', 'cookie-path', days)).toEqual(
        `cookie-name=cookie-value; expires=${expires}; path=cookie-path`
    );
});

test('it can get a cookie value', () => {
    ConsentCookie.setValue('cookie-value', 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue('cookie-name')).toEqual('cookie-value');
});

test('it can get an list object as cookie value', () => {
    ConsentCookie.setValue({'foo': 'bar'}, 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue('cookie-name')).toEqual({'foo': 'bar'});
});

test('it allows uri characters in the cookie value', () => {
    ConsentCookie.setValue('/special&chars', 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue('cookie-name')).toEqual('/special&chars');
});

test('it cannot get cookie value from unexisting cookie', () => {

    ConsentCookie.setValue('cookie-value', 'cookie-name', 'cookie-path', 20)

    expect(ConsentCookie.getValue('xxx')).toEqual(null);
});
