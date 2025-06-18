"use strict";

const { resolve } = require("node:path");
const WorkersPool = require("./index.js");

const FILE = resolve(__dirname, "./fn.js");

// (async () => {
//   const framework = await new WorkersPool({ path: FILE, concurrency: 6 });
//   try {
//     for (const i of misc.range(2000)) {
//       const data = await framework.use({ name: "getFloat", data: 1 });
//       console.log({ data, i })
//     }

//   } catch (e) {
//     console.error(e);
//   }
//   console.dir({
//     time: framework.upTime,
//     size: framework.size,
//   });
//   framework.close();
//   console.dir({
//     time: framework.upTime,
//     size: framework.size,
//   });
// })();