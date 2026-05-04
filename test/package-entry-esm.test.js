const { execFileSync } = require('node:child_process');

test('it exposes a constructible esm package entry', async () => {
    const script = `
        globalThis.document = {
            cookie: '',
            dispatchEvent: () => {},
            querySelectorAll: () => []
        };
        globalThis.window = {};
        globalThis.CustomEvent = class CustomEvent {
            constructor(type, init = {}) {
                this.type = type;
                this.detail = init.detail;
            }
        };

        const { default: CookieAccept } = await import('./index.mjs');

        if (typeof CookieAccept !== 'function') {
            throw new Error('ESM entry is not constructible');
        }

        new CookieAccept();
    `;

    expect(() => {
        execFileSync('node', ['--input-type=module', '--eval', script], {
            cwd: `${__dirname}/..`,
            stdio: 'pipe',
        });
    }).not.toThrow();
});
