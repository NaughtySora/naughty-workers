"use strict";

const WorkersPool = require("../lib/WorkersPool.js");
const api = require("./mock/api.js");
const crypto = require("./mock/crypto.js");

module.exports = () => {
  const modules = { api, crypto };
  const pool = new WorkersPool({ modules, concurrency: 10 });
  setTimeout(() => void pool.close(), 150);
  pool.execute("crypto", "getUUID").then(
    console.log,
    console.error
  );
  pool.execute("api", "some", { some: "value1" }).then(
    console.log,
    console.error
  );
};
