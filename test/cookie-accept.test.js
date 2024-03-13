import CookieAccept from '../dist/cookie-accept';

afterEach(() => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
});

test('it can set a basic cookie', () => {
    document.body.innerHTML = `
        <section>
            <a data-ca-update></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'basic',
        days: 7,
    });

    document.querySelector('[data-ca-update]').click();

    expect(document.cookie).toEqual(expect.stringContaining('basic={}'));
});

test('it can accept all cookie values', () => {
    document.body.innerHTML = `
        <section>
            <input data-ca-checkbox type="checkbox" name="functional">
            <input data-ca-checkbox type="checkbox" name="analyzing">
            <input data-ca-checkbox type="checkbox" name="marketing">
            <a data-ca-accept></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 7,
        gtmEnabled: false,
    });

    document.querySelector('[data-ca-accept]').click();

    expect(document.cookie).toEqual(
        expect.stringContaining('test-cookie={"functional":true,"analyzing":true,"marketing":true}')
    );
});

test('it can reject all cookie values', () => {
    document.body.innerHTML = `
        <section>
            <input data-ca-checkbox type="checkbox" name="functional" checked>
            <input data-ca-checkbox type="checkbox" name="analyzing" checked>
            <input data-ca-checkbox type="checkbox" name="marketing" checked>
            <a data-ca-reject></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 7,
        gtmEnabled: false,
        consents: { functional: false, analyzing: false, marketing: false },
    });

    document.querySelector('[data-ca-reject]').click();

    expect(document.cookie).toEqual(
        expect.stringContaining('test-cookie={"functional":false,"analyzing":false,"marketing":false}')
    );
});

test('it can reject all optional cookie values', () => {
    document.body.innerHTML = `
        <section>
           <input data-ca-checkbox type="checkbox" name="functional" checked>
           <input data-ca-checkbox type="checkbox" name="analyzing">
           <a data-ca-reject></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 7,
        gtmEnabled: false,
    });

    document.querySelector('[data-ca-reject]').click();

    expect(document.cookie).toEqual(expect.stringContaining('test-cookie={"functional":true,"analyzing":false}'));
});

test('it can update cookie values again', () => {
    document.body.innerHTML = `
        <section>
           <input data-ca-checkbox type="checkbox" name="functional" checked>
           <input data-ca-checkbox type="checkbox" name="analyzing">
           <a data-ca-reject></a>
           <a data-ca-accept></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 7,
        gtmEnabled: false,
    });

    document.querySelector('[data-ca-reject]').click();
    document.querySelector('[data-ca-accept]').click();

    expect(document.cookie).toEqual(expect.stringContaining('test-cookie={"functional":true,"analyzing":true}'));
});

test('it can set cookie in dataLayer', () => {
    document.body.innerHTML = `
        <section>
           <input data-ca-checkbox type="checkbox" name="functional" checked>
           <input data-ca-checkbox type="checkbox" name="analyzing">
           <input data-ca-checkbox type="checkbox" name="marketing" checked>
           <a data-ca-update></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'legal-cookies',
        days: 7,
        gtm: {
            enabled: true,
        },
    });

    document.querySelector('[data-ca-update]').click();

    expect(window.dataLayer).toEqual(
        expect.arrayContaining([
            { cookies: { analyzing: false, functional: true, marketing: false }, event: 'enableCookies' },
        ])
    );
});

test('it can set cookie with custom consent names', () => {
    document.body.innerHTML = `
        <section>
           <input data-ca-checkbox type="checkbox" name="base" checked>
           <input data-ca-checkbox type="checkbox" name="analytics">
           <a data-ca-update></a>
        </section>
    `;

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 1,
        gtmEnabled: false,
    });

    document.querySelector('[data-ca-update]').click();

    expect(document.cookie).toEqual(expect.stringContaining('test-cookie={"base":true,"analytics":false}'));
});

test('it can set default cookie values in dataLayer', () => {
    document.body.innerHTML = '';

    window.CookieAccept = new CookieAccept({
        name: 'test-cookie',
        days: 7,
        consents: {
            think: false,
            tomorrow: true,
        },
        gtm: {
            enabled: true,
            event: 'enableCookiesTest',
        },
    });

    expect(window.dataLayer).toEqual(
        expect.arrayContaining([{ cookies: { think: false, tomorrow: true }, event: 'enableCookiesTest' }])
    );
});

// TODO: this test is also passing if the event listener callback isn't invoked
// test('it emits event after setting cookie', () => {
//     document.addEventListener('CookieUpdated', (event) => {
//         const settings = event.detail.cookieValue;

//         expect(settings).toEqual({functional: true, marketing: false});
//     });

//     document.body.innerHTML =
//         '<section>' +
//         '   <input data-ca-checkbox type="checkbox" name="functional" checked disabled>' +
//         '   <input data-ca-checkbox type="checkbox" name="marketing">' +
//         '   <a data-ca-update>Accept</a>' +
//         '</section>';

//     window.CookieAccept = new CookieAccept({
//         name: 'test-cookie',
//         days: 7,
//     });

//     document.querySelector('[data-ca-update]').click();
// });

// TODO: this test is also passing if the event listener callback isn't invoked
// test('it emits event if cookie exists', () => {
//     document.cookie = 'test-cookie={"functional":true,"analyzing":true,"marketing":false}';

//     document.addEventListener('CookieExistsOnLoad', (event) => {
//         const settings = event.detail.cookieValue;

//         expect(settings).toEqual({functional: true, analyzing: true, marketing: false});
//     });

//     window.CookieAccept = new CookieAccept({
//         name: 'test-cookie',
//         days: 7,
//     });
// });

// TODO: this test is also passing if the event listener callback isn't invoked
// test('it emits event if cookie does not exist', () => {
//     document.addEventListener('CookieDoesNotExistOnLoad', (event) => {
//         const settings = event.detail.cookieValue;

//         expect(settings).toEqual({functional: true, analyzing: false, marketing: false});
//     });

//     window.CookieAccept = new CookieAccept({
//         name: 'test-cookie',
//         days: 7,
//     });
// });
