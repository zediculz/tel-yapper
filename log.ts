import { Context, Next } from "hono";

export async function log(c: Context, next: Next) {
  const t0 = performance.now();
  const d = new Date();
  const date = `${d.getMonth() + 1}-${d.getDate()}-${d.getFullYear()}`;
  const dtime = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  const datetime = `[${date} ${dtime}]`;
  const path = c.req.path;
  const method = c.req.method;
  const rmsg = `${datetime} ${method} ${path}`;
  console.log(rmsg);

  await next();
  const t1 = performance.now();
  const time = Math.floor(t1 - t0);
  const status = c.res.status;

  const msg = `%c${datetime} ${status} took: ${time}ms\n`;
  console.log(msg, "color:red");
}