"use strict";

const { parentPort } = require("node:worker_threads");

let api = null;
const strategies = {
  async resource(data) {
    try {
      api = require(data);
      parentPort.postMessage({ error: null });
    } catch (error) {
      parentPort.postMessage({ error });
    }
  },
  async use(data) {
    const { name, args } = data;
    const fn = api[name];
    try {
      const result = await fn(args);
      parentPort.postMessage({ error: null, result });
    } catch (error) {
      parentPort.postMessage({ error });
    }
  },
  async execute(args) {
    try {
      const result = await api(args);
      parentPort.postMessage({ error: null, result });
    } catch (error) {
      parentPort.postMessage({ error });
    }
  }
};

parentPort.on("message", async ({ event, data }) => {
  const fn = strategies[event];
  if (!fn) return send(new Error(`Event ${event} doesn't exists`));
  await fn(data);
});
