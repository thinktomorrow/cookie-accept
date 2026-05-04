const CookieAccept = require('..');

test('it exposes a constructible package root export', () => {
    document.body.innerHTML = '';

    expect(typeof CookieAccept).toBe('function');
    expect(() => new CookieAccept()).not.toThrow();
});
