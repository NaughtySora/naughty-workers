"use strict";

const WorkersPool = require("../lib/pool.js");
const api = require("./api.js");
const crypto = require("./crypto.js");

const modules = { api, crypto };
const test = new WorkersPool({ modules, concurrency: 10 });

(async () => {
  // const result = await test.api.some("test", 42, { a: 1 });
  // console.log({ result });

  // try {
  //   const result2 = await test.api.fail("test", 42, { a: 1 });
  //   console.log({ result2 });
  // } catch (error) {
  //   console.error({ error })
  // }


  // for (let i = 0; i < 10000; i++) {
  //   test.api.getFloat().then(console.log.bind(null, "Float:"), console.error);
  // }

  const data = { test: 42, };
  const hex = await test.crypto.encrypt(data);
  const isEqual = await test.crypto.check(data, hex);
  console.log({ hex, data, isEqual });
})();