"use strict";

const WorkersPool = require("../lib/WorkersPool.js");
const createApi = require("../lib/createApi.js");

const register = ({ modules, concurrency } = {}) => {
  const pool = new WorkersPool({ modules, concurrency });
  const Api = createApi(modules);
  const api = new Api(pool);
  return api;
};

const finalize = api => api.pool.close();

module.exports = {
  register,
  finalize,
};
