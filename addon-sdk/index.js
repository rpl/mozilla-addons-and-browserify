const cryptoWorker = require('./crypto-worker');

cryptoWorker.ready.then(() => {
  console.log("CRYPTO WORKER READY");

  cryptoWorker.randomBytes(3).then((result) => {
    console.log("CRYPTO WORKER RANDOM BYTES", result);
  }, (error) => {
    console.log("CRYPTO WORKER RANDOM BYTES ERROR", error);
  });

  cryptoWorker.unknownMethod().catch((error) => {
    console.log("CRYPTO WORKER UNKNOWN METHOD ERROR", error);
  });
});
