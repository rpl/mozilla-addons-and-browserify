This repo contains two small example add-ons which shows how to use browserified modules
in Firefox add-ons based on the WebExtensions or the Addon SDK.

## web-ext

The WebExtensions add-on example simply load the browserified bundle in the background page and just
requires/uses the 'crypto-browserify' module.

To build the browserified bundle:

```
$ cd web-ext
$ npm install                ### install the npm dependency needed to build the browserified bundle
$ npm run browserify-build   ### which build crypto-browserified.js directly from the crypto-browserify npm module
```

To run the addon:

- run Firefox Dev Edition
- load "about:debugging"
- press the "Load Temporary add-on", reach the web-ext dir and double-click on the `manifest.json` file
- open the Browser Console to reach the logged messages

### notes on the browserified bundle

In this case the bundle is built using the following browserify options:

```
browserify -x crypto -r crypto-browserify -o ./crypto-browserified.js
```

- `-r crypto-browserify`: to ask browserify to include the crypto-browserify module (and its dependencies)
  in the bundle

- `-x crypto`: to ask browserify to provide a require method which can be used to require the "crypto" module

- `-o ./crypto-browserified.js`: to configure the name of the built bundle, which needs to be named accordingly to the addon `manifest.json`

## addon-sdk

The Addon SDK add-on example uses the "sdk/page-worker" module to load a browserified bundle into an
hidden addon window which exposes the needed methods by exchanging messages with the add-on,
all wrapped into a nicer promise-based API (provided by the simple "crypto-worker" module from the example).

To build the browserified bundle:

```
$ cd addon-sdk
$ npm install                ### install the npm dependency needed to build the browserified bundle
...
$ npm run browserify-build   ### which build data/crypto-browserified.js from data-src/crypto-addonsdk.js
...
```

To run the example:

```
$ npm install -g jpm  ### if not yet installed
...
$ jpm run             ### or "jpm run -b /path/to/firefox" if it fails to auto-detect the installed firefox binary
```

To run the test cases:

```
$ jpm test            ### or "jpm test -b /path/to/firefox" if it fails to auto-detect the installed firefox binary
```

### notes on the browserified bundle

In this case the bundle is built using the following browserify options:

```
browserify -e ./data-src/crypto-addonsdk -o ./data/crypto-browserified.js
```

- `-e crypto-addonsdk`: to ask browserify to use our custom entrypoint module for the bundle

- `-o ./crypto-browserified.js`: to configure the name of the build bundle, which needs to be named accordingly to what neeeded by the 'crypto-browserified.html' page, which will be loaded in the hidden addon window used to load the bundle

The custom browserify entrypoint module `crypto-addonsdk` will require the `crypto` module and will provide the custom code needed to provide the API through the messages exchange:

```
const crypto = require('crypto');

addon.on("message", (msg) => {
  let { method, requestId, args } = msg;

  try {
    switch(method) {
    case "randomBytes":
      addon.postMessage({
        method, requestId,
        result: crypto.randomBytes.apply(crypto, args).toString(),
      });
      break;
    default:
      addon.postMessage({
        method, requestId,
        error: `Unknown method: ${method}`,
      });
    }
  } catch(error) {
    addon.postMessage({ method, requestId, error: `Exception on ${method} "${error}": ${error.stack}` });
  }
});

addon.postMessage("ready");
```
