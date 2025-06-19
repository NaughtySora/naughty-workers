"use strict";

const { randomUUID, createHmac, } = require("node:crypto");

const key = "1234678910876yt5tr4";

module.exports = {
  getUUID() {
    return randomUUID();
  },
  encrypt(data) {
    const signature = createHmac("sha256", key);
    signature.update(Object.values(data).join(""));
    return signature.digest("hex");
  },
  check(data, hex) {
    return hex === this.encrypt(data);
  },
};
