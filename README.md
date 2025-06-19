# Nodejs Workers Pool / Noroutine

## Workers Pool

```js
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
```

## Noroutine
```js
  const modules = { api, crypto };

  const noroutine = register({ modules, concurrency: 10 });
  
  noroutine.api.some("test", 42, { a: 1 }).then(console.log);
  noroutine.api.fail("test", 42).then(console.log, console.error);

  setTimeout(finalize, 2000, noroutine);
```