import { Hono } from 'hono'
import "jsr:@std/dotenv/load"
import { cors } from 'hono/cors'
import { checkChat, sendMsg } from "./utils.ts"
import { log } from "./log.ts"

const app = new Hono()

app.use('*', cors())
app.use((c, next) => log(c, next))
const BOT = Deno.env.get("BOT")


const o = {
    ch: "-1002623552220",
    user: "1175308172",
    g: "-4637741828"
}

app.post("/bot", async (c) => {
  const { message, mode, id } = await c.req.parseBody()
  const res = await sendMsg(BOT, message, id, mode)
  return c.json(res)
})


app.post("/botd", async (c) => {
  const body = await c.req.parseBody()
  const { chat, message, type, mode } = body
  const checked = await checkChat({ bot: BOT, type, chat })
  if (checked?.ok) {
    const res = await sendMsg(BOT, message, String(checked?.id), mode)
    return c.json(res)
  } else {
    return c.json(checked)
  }
})

//receive the channel, group name
//check bot update and
//return result if channel 0r group exist 

app.post('/check', async (c) => {
  const { chat, type } = await c.req.parseBody()
  if (chat == undefined || chat == null || chat == "") {
    return c.json({ok: false,  msg: "no channel or group id"})
  } else {
    const res = await checkChat({ bot: BOT, type, chat })
    return c.json(res)
  }
})


Deno.serve({ port: 6707 }, app.fetch)