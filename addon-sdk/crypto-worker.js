const self = require("sdk/self");
const pageWorker = require("sdk/page-worker");

let cryptoWorker = pageWorker.Page({
  contentURL: self.data.url("crypto-browserified.html"),
  onError: console.error
});

let cryptoWorkerReady = new Promise((resolve) => {
  cryptoWorker.once("message", (msg) => {
    resolve();
  });
});

let lastRequestId = 0;

let cryptoWorkerRequest = (method, ...args) => {
  let requestId = ++lastRequestId;

  return new Promise((resolve, reject) => {
    let onmessage = (msg) => {
      if (msg.method == method && msg.requestId == requestId) {
        cryptoWorker.off("message", onmessage);
        if (msg.error) {
          reject(msg.error);
        } else {
          resolve(msg.result);
        }
      }
    };

    cryptoWorkerReady.then(() => {
      cryptoWorker.on("message", onmessage);
      cryptoWorker.postMessage({method, requestId, args});
    });
  });
};

exports.ready = cryptoWorkerReady;
exports.randomBytes = cryptoWorkerRequest.bind(null, "randomBytes");
exports.unknownMethod = cryptoWorkerRequest.bind(null, "unkownMethod");
