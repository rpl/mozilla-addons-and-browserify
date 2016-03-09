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
