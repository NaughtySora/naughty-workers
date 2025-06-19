"use strict";

const { parentPort, workerData } = require("node:worker_threads");

const api = workerData.reduce((target, module) =>
  (target[module] = require(module), target), {});

parentPort.on("message", async ({ path, method, args }) => {
  try {
    const subroutine = api[path];
    const result = await subroutine[method](...args);
    parentPort.postMessage({ result });
  } catch (error) {
    parentPort.postMessage({ error });
  }
});
