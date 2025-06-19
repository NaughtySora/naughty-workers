"use strict";

const { modulePath } = require("../lib/createApi.js");
const WorkersPool = require("../lib/WorkersPool.js");
const api = require("./mock/api.js");
const crypto = require("./mock/crypto.js");

module.exports = () => {
  const modules = { api, crypto };
  const pool = new WorkersPool({ modules, concurrency: 10 });
  const path = modulePath(modules.crypto);
  pool.execute(path, "getUUID").then(console.log);
};
