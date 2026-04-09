# AGENTS.md

Agent guidance for `@thinktomorrow/cookie-accept`.

This repository is a small JavaScript library for cookie consent handling.

## Project Snapshot

- Language: JavaScript (ES modules)
- Runtime targets: browser (library), Node.js for tooling/tests
- Source code lives in `src/`
- Compiled output lives in `dist/`
- Tests are in `test/` and run on Jest
- Linting is ESLint (Airbnb base + local overrides)
- Formatting is Prettier

## Install

- `npm install`

## Build, Lint, and Test Commands

Primary npm scripts from `package.json`:

- Build all source files: `npm run build`
- Lint source and tests: `npm run lint`
- Run all tests: `npm test`

Important testing nuance:

- `test/cookie-accept.test.js` and `test/consent-cookie.test.js` import files from `dist/`
- If you changed anything in `src/`, run `npm run build` before those tests
- Reliable full local check: `npm run build && npm run lint && npm test`

Single-test workflows (Jest):

- One test file via npm: `npm test -- test/cookie-accept.test.js`
- One test file directly: `npx jest test/cookie-accept.test.js`
- One test by name: `npm test -- -t "it can set a basic cookie"`
- One named test in one file: `npx jest test/cookie-accept.test.js -t "it can set a basic cookie"`
- Watch mode: `npx jest --watch`

Useful single-file workflows:

- Lint one file: `npx eslint src/cookie-accept.js`
- Lint one test file: `npx eslint test/consent-checkboxes.test.js`
- Build one source file to dist (rare):
  `npx babel src/cookie-accept.js --out-file dist/cookie-accept.js --presets=@babel/preset-env`

CI reference:

- Workflow file: `.github/workflows/test.yml`
- Current CI command sequence: `npm install` then `npm run test`

## Cursor and Copilot Rules Check

Checked these locations:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Current state:

- No Cursor rule files found
- No Copilot instructions file found
- Follow this `AGENTS.md` plus existing project configs and code conventions

## Code Style Guidelines

### Formatting (authoritative)

From `.prettierrc.json`:

- 4-space indentation
- Single quotes
- Trailing commas set to `es5`
- Print width 120

From `.eslintrc.js` (high-impact rules):

- `indent`: 4 spaces
- `max-len`: 120
- `comma-dangle`: arrays/objects multiline only, functions never
- `no-param-reassign`: allowed only for parameter properties (`props: false`)
- `no-plusplus`: allowed
- `no-underscore-dangle`: allowed
- `no-new`: allowed
- `no-console` and `no-alert`: warning in production, allowed in development

If ESLint and Prettier ever appear to conflict, keep behavior aligned with current ESLint overrides.

### Imports and Exports

- Use ES module syntax (`import`/`export`) everywhere
- Keep imports at the top of each file
- Prefer local relative imports (`./ConsentCookie`, `../dist/cookie-accept`)
- Omit `.js` extension in local imports (matches current codebase)
- Keep one main default export per module

Current module patterns:

- Class module: `export default class CookieAccept { ... }`
- Utility object module: `const ConsentCookie = { ... }; export { ConsentCookie as default };`

### Naming Conventions

- Classes: `PascalCase` (example: `CookieAccept`)
- Utility modules/objects: `PascalCase` (example: `ConsentCookie`)
- Variables/functions/methods: `camelCase`
- Internal/private-ish methods: prefix with `_` (example: `_init`, `_updateCookie`)
- Event names: `PascalCase` strings (example: `CookieUpdated`)
- Test titles: sentence-style strings starting with `it can ...`

### Types and Data Shapes

- This is plain JavaScript; do not introduce TypeScript unless asked
- Keep data structures explicit and simple object literals
- Consent settings are boolean maps keyed by consent name
- Preserve constructor defaults unless a change is requested

Expected consent object shape:

```js
{
    functional: true,
    analyzing: false,
    marketing: false,
}
```

### Error Handling and Defensive Coding

- Prefer graceful fallbacks for recoverable situations
- Match cookie parsing behavior in `ConsentCookie.getValue`:
  - try `JSON.parse(decodeURIComponent(value))`
  - fallback to `decodeURIComponent(value)` on parse error
- Return `null` when a cookie is missing
- Use `Object.prototype.hasOwnProperty.call(...)` for external object checks
- Keep side effects explicit (`document.cookie`, DOM updates, events, `window.dataLayer`)

### DOM and Browser API Practices

- Use option-driven selectors with sensible defaults
- Convert `NodeList` values using `Array.from(...)` before array operations
- Emit library events with `CustomEvent`
- Use explicit browser globals (`window`, `document`)

### Testing Conventions

- Use Jest and keep tests in `test/*.test.js`
- Use `afterEach` cleanup to prevent cookie leakage between tests
- Build DOM fixtures inline via `document.body.innerHTML`
- Keep assertions behavior-focused and deterministic
- Rebuild `dist/` before running tests that import `dist/*`

## Change Management Expectations for Agents

- Make minimal, targeted edits
- Avoid opportunistic refactors unrelated to the request
- Preserve public API unless the task asks to change it
- Update `readme.md` for user-visible behavior or option changes
- Keep `dist/` in sync with `src/` when preparing release-ready changes

End of agent instructions.
