const { ready, randomBytes, unknownMethod } = require("../crypto-worker.js");

exports["test ready resolves once the worker is ready"] = function(assert, done) {
  ready.then(() => {
    assert.pass("ready Promise resolved");
    done();
  }).catch(() => {
    assert.fail("ready Promise rejected");
    done();
  });
};

exports["test randomBytes returns a Promise which resolves to some random bytes"] = function(assert, done) {
  randomBytes(2).then((result) => {
    assert.equal(result.length, 2, "got the right number of random bytes");
    done();
  }).catch((error) => {
    assert.fail(`unexpected error: ${error}`);
    done();
  });
};

exports["test randomBytes returns a Promise which reject if called without parameters"] = function(assert, done) {
  randomBytes().then((result) => {
    assert.fail(`reject expected, resolved to unexpected result: ${result}`);
    done();
  }).catch((error) => {
    assert.ok(/Exception on/.test(error), "rejected with the expected error message");
    done();
  });
};

exports["test unknownMethod returns a Promise which reject with an error message"] = function(assert, done) {
  unknownMethod().then((result) => {
    assert.fail(`reject expected, resolved to unexpected result: ${result}`);
    done();
  }).catch((error) => {
    assert.ok(/Unknown method/.test(error), "rejected with the expected error message");
    done();
  });
};

require("sdk/test").run(exports);
