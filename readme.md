# Cookie accept
A small js package to handle cookie acceptance. This can be used to handle cookie prompts or cookie-based notifications on your site.
Note that this is a package that is still under development and is subject to changes.

## Install
You can install the package via npm.
```bash 
npm install --save @thinktomorrow/cookie-accept
```

## Usage
The library can be imported and initialized in your js file like so:
```js 
 import CookieAccept from '@thinktomorrow/cookie-accept';
 window.CookieAccept = new CookieAccept();
```

## Options
Most of the configuration has a sensible default. But off course, there are a couple of options you can set up for your project.
```js 
 import CookieAccept from '@thinktomorrow/cookie-accept';
 window.CookieAccept = new CookieAccept({

    // cookie name - default is 'cookies-accept'
    name: 'cookiename',

    // days that the cookie should remain valid - default is set to 365 (one year)
    days: 7,     

    // Tell the browser what path the cookie belongs to - default is '/'
    path: '/custom-path',

    // Pas the acceptance settings to google tag manager, default is false
    gtmEnabled: true 
});
```

## cookie prompt
In order to present the cookie accept option to the visitor, there are a couple of expected
DOM elements required. It is best to start from the following template:

```html 
<section data-ca class="hidden">
    <a data-ca-accept>Accept</a>
</section>
```

## Gtm cookie prompt
A more advanced setup is where we integrate with google tag manager to handle the loading of external scripts
based on the acceptance of certain cookie types. Here is an example where we allow the visitor to choose if he wants to accepts marketing scripts or not.

```html 
<section data-ca class="hidden">
    <input data-ca-checkbox type="checkbox" name="functional" checked disabled>
    <input data-ca-checkbox type="checkbox" name="marketing">
    <a data-ca-accept>Accept</a>
</section>
```

