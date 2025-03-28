// deno-lint-ignore-file
interface RES {
  ok: boolean
  text: string
  id?: number|null
}

interface CC {
  bot: string | undefined;
  type: string | File;
  chat?: string | File;
  message?: string | File
  id?: number | File
}

export async function checkChat({ bot, type, chat }: CC):Promise<RES|undefined> {
  const req = await fetch(`https://api.telegram.org/bot${bot}/getUpdates`);
  const res = await req.json();

  if (res?.ok) {
    const results = res?.result;

    if (type == "channel") {
      const exist = results?.filter((res: any, i: number) => {
        if (res?.channel_post?.sender_chat?.title === chat) {
          return res;
        }
      });
     
      if (exist?.length > 0) {
        const id = exist[0]?.channel_post?.sender_chat?.id;
        return { ok: true, text: `${type} found`, id };
      } else {
       return { ok: false, text: `${type} not found`, id: null };
      }
    } else if (type === "group") {
      const exist = results?.filter((res: any, i: number) => {
        if (res?.message?.chat?.title === chat) {
          return res;
        }
      });

      if (exist?.length > 0) {
        const id = exist[0]?.message?.chat?.id;
        return { ok: true, text: `${type} found`, id };
      } else {
        return { ok: false, text: `${type} not found`, id: null };
      }
    } else {
      return { ok: false, text: "type not allowed" };
    }
  }
}


export function modeSlices(mode:string|File, message: string|File) {
  const modes = ["order", 'warn', "info", "basic", "error"]
  if (modes.includes(mode as string)) {
    let text = ''
    switch (mode) {
      case "order":
          text = `[New Order] ${message}`
          return {ok: true, text }
      case "warn":
          text = `[Warning] ${message}`
        return { ok: true, text }
      case "info":
        text = `[Info] ${message}`
        return { ok: true, text }
      case "error":
        text = `[Error] ${message}`
        return { ok: true, text }
      case "basic":
        text = `${message}`
        return {ok: true, text }
      default:
        text = `${message}`
        return {ok: true, text }
    }
  } else {
    return {ok: false}
  }
}

export async function sendMsg(bot: string | undefined,
  message: string | File,
  id: string | File,
  mode: string | File) {
  const sm = modeSlices(mode, message)

  if (sm?.ok) {
    const url = `https://api.telegram.org/bot${bot}/sendMessage?chat_id=${id}&text=${sm?.text}`
    const req = await fetch(url)
    const res = await req.json()

    if (res?.ok) {
       return {ok: true, text: "message sent"}
    } else {
      return {ok: false, text: "message not sent", reason: res?.description}
    }
  } else {
    return {ok: false, text: "mode not allowed"}
  }
}


//setup a bot ===
//add bot to channel, group, personal  ===

//create func to access the channel with channel name
//create func to send message

//expect dev to have create a channel, group or personal chat