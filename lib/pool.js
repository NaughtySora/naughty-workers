"use strict";

const { Worker } = require("node:worker_threads");
const { resolve } = require("node:path");
const { createApi, modulePath } = require("./api.js");

const WORKER_PATH = resolve(__dirname, "./worker.js");

class WorkersPool {
  #workers = new Map();
  #free = [];
  #queue = [];

  constructor({ modules, concurrency } = {}) {
    this.#init(concurrency, modules);
    const Api = createApi(modules);
    return new Api(this);
  }

  #init(concurrency, modules) {
    const workerData = Object.values(modules).map(modulePath);
    for (let i = 0; i < concurrency; i++) {
      const worker = new Worker(WORKER_PATH, { workerData });
      this.#register(worker);
    }
  }

  #register(worker) {
    const workers = this.#workers;
    const id = worker.threadId;
    workers.set(id, worker);
    this.#free.push(id);
  }

  #next() {
    const free = this.#free;
    const queue = this.#queue;
    if (free.length === 0 || queue.length === 0) return;
    const task = queue.shift();
    this.#process(task);
  }

  #process({ data, resolve, reject }) {
    const id = this.#free.shift();
    const worker = this.#workers.get(id);
    worker.once("message", ({ result, error }) => {
      error ? reject(error) : resolve(result);
      this.#free.push(id);
      process.nextTick(() => this.#next());
    });
    worker.postMessage(data);
  }

  close() {
    this.#free.length = 0;
    this.#queue.length = 0;
    const workers = this.#workers;
    for (const worker of workers.values()) worker.terminate();
    workers.clear();
  }

  execute(path, method, ...args) {
    return new Promise((resolve, reject) => {
      const task = { data: { path, method, args }, resolve, reject };
      if (this.#free.length === 0) return void this.#queue.push(task);
      this.#process(task);
    });
  }

  get size() {
    return this.#workers.size;
  }
}

module.exports = WorkersPool;