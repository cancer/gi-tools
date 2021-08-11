import { Handler, listen, Router } from "worktop";
import { setReminderFor24HoursLater } from "./applications/set-reminder-for24-hours-later";
import { signToHoyolab } from "./applications/sign-to-hoyolab";
import { CronDispatcher, schedule } from "./lib/cloudflare";
import { Reminder } from "./models/reminder";

// fetch events
const router = new Router();

type Params = Pick<Reminder, "uuid">;
const handler: Handler = async (req, res) => {
  const body = await req.body<Params>();
  if (!body || body.uuid)
    return res.send(400, "Missing required parameter `uid`");

  await setReminderFor24HoursLater(body);
  
  res.send(200, "");
};

router.add("POST", "/reminder", handler);

// scheduled events
const cron = CronDispatcher();

// ログインボーナスを踏む
cron.add("19 1/12 * * *", signToHoyolab);

// リマインダー
cron.add("* * * * *", () => Promise.resolve());

// listen
listen(router.run);
schedule(cron.dispatch);
