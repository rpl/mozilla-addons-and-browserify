let crypto = require("crypto-browserify");

console.log("READY", crypto);

console.log("RANDOM BYTES", crypto.randomBytes(2).toString());
