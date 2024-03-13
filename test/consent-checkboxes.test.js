import ConsentCheckboxes from "../src/ConsentCheckboxes";

afterEach(() => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
});

test('it can update checkboxes by cookie values', () => {
    expect(ConsentCheckboxes.updateCheckboxesByCookieValue(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ], {'foo': true, 'bar': true}
    )).toEqual([
        {name: 'foo', checked: true},
        {name: 'bar', checked: true},
    ]);
});

test('it can update checkboxes by cookie values and ignores other cookie values', () => {
    expect(ConsentCheckboxes.updateCheckboxesByCookieValue(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ], {'foo': false, 'bar': false, 'baz': true}
    )).toEqual([
        {name: 'foo', checked: false},
        {name: 'bar', checked: false},
    ]);
});

test('it can update checkboxes and keeps existing values intact', () => {
    expect(ConsentCheckboxes.updateCheckboxesByCookieValue(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ], {'foo': false}
    )).toEqual([
        {name: 'foo', checked: false},
        {name: 'bar', checked: false},
    ]);
});

test('it can convert checkboxes to cookie values', () => {
    expect(ConsentCheckboxes.toCookieValues(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ]
    )).toEqual({'foo': true, 'bar': false});
});

test('it can convert checkboxes and allow consent for all', () => {
    expect(ConsentCheckboxes.toCookieValuesForcedToTrue(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ]
    )).toEqual({'foo': true, 'bar': true});
});

test('it can convert checkboxes and reject consent', () => {
    expect(ConsentCheckboxes.toCookieValuesForcedToFalse(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ]
    )).toEqual({'foo': false, 'bar': false});
});

test('it can convert checkboxes and reject consent only for all optional', () => {
    expect(ConsentCheckboxes.toCookieValuesForcedToFalse(
        [
            {name: 'foo', checked: true},
            {name: 'bar', checked: false},
        ], ['foo']
    )).toEqual({'foo': true, 'bar': false});
});
