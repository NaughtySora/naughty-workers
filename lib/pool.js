"use strict";

const { Worker } = require("node:worker_threads");
const { resolve } = require("node:path");

const workerResource = resolve(__dirname, "./worker.js");

class WorkersPool {
  #workers = new Map();
  #free = [];
  #queue = [];
  #resource;

  constructor({ path, concurrency } = {}) {
    this.#resource = path;
    return this.#init(concurrency);
  }

  async #init(concurrency) {
    for (let i = 0; i < concurrency; i++) await this.#create();
    return this;
  }

  #create() {
    const workers = this.#workers;
    const worker = new Worker(workerResource);
    const threadId = worker.threadId;
    workers.set(threadId, worker);
    worker.once('error', async () => {
      worker.terminate();
      workers.delete(threadId);
      await this.#create();
      this.#next();
    });
    return new Promise((resolve, reject) => {
      worker.once('message', ({ error }) => {
        if (error) reject(new Error("Can't import a module"));
        else resolve();
      });
      worker.postMessage({ event: "resource", data: this.#resource });
      this.#free.push(threadId);
    });
  }

  #next() {
    const free = this.#free;
    const queue = this.#queue;
    if (free.length === 0 || queue.length === 0) return;
    const task = queue.shift();
    this.#finish(task);
  }

  #finish({ event, data, resolve, reject }) {
    const free = this.#free;
    const workerId = free.shift();
    const worker = this.#workers.get(workerId);
    worker.once("message", ({ result, error }) => {
      error ? reject(error) : resolve(result);
      free.push(workerId);
      this.#next();
    });
    worker.postMessage({ event, data });
  }

  close() {
    this.#free.length = 0;
    this.#queue.length = 0;
    this.#resource = undefined;
    const workers = this.#workers;
    for (const worker of workers.values()) worker.terminate();
    workers.clear();
  }

  execute(data) {
    return new Promise((resolve, reject) => {
      const task = { event: "execute", data, resolve, reject };
      if (this.#free.length === 0) return void this.#queue.push(task);
      this.#finish(task);
    });
  }

  use(data) {
    return new Promise((resolve, reject) => {
      const task = { event: "use", data, resolve, reject };
      if (this.#free.length === 0) return void this.#queue.push(task);
      this.#finish(task);
    });
  }

  get size() {
    return this.#workers.size;
  }
}

module.exports = WorkersPool;