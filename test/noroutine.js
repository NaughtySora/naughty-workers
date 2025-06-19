"use strict";

const api = require("./mock/api.js");
const crypto = require("./mock/crypto.js");
const { finalize, register } = require("../lib/noroutine.js");

module.exports = () => {
  const modules = { api, crypto };
  const test = register({ modules, concurrency: 10 });
  test.api.some("test", 42, { a: 1 }).then(console.log);
  test.api.fail("test", 42, { a: 1 }).then(console.log, console.error);
  for (let i = 0; i < 10; i++) {
    test.api.getFloat().then(
      console.log.bind(null, "Float " + `${i}: `),
      console.error
    );
  }

  const data = { test: 42, };
  test.crypto.encrypt(data)
    .then((hex) => {
      test.crypto.check(data, hex)
        .then(
          console.log.bind(null, `${JSON.stringify(data)} ${hex} isEqual: `),
          console.error,
        );
    }, console.error);

  setTimeout(finalize, 2000, test);
};
