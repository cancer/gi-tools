import { Handler, listen, Router } from "worktop";
import { setReminderFor24HoursLater } from "./applications/set-reminder-for24-hours-later";
import { signToHoyolab } from "./applications/sign-to-hoyolab";
import { createContext } from "./context";
import { slack } from "./external/slack-client";
import { CronDispatcher, schedule } from "./lib/cloudflare";
import { getReminder, save } from "./models/reminder";
import type { Reminder } from "./models/reminder";

// fetch events
const router = new Router();

type Params = Pick<Reminder, "uuid">;
const handler: Handler = async (req, res) => {
  const context = createContext();

  const body = await req.body<Params>();
  if (!body || !body.uuid)
    return res.send(400, "Missing required parameter `uid`");

  req.extend(await setReminderFor24HoursLater(context, body));

  res.send(200, "");
};

router.add("POST", "/reminder", handler);

type SlackPayload = {
  callback_id: string;
  actions: {
    type: string;
    action_id: string;
    value: string;
  }[];
};

const parsePayload = (payload: string): SlackPayload => JSON.parse(payload);

router.add("POST", "/slack-interactive", async (req, res) => {
  const data = await req.body<{ payload: string | null }>();
  const context = createContext();

  if (!data || !data.payload)
    return res.send(400, "Missing required parameter `uuid`");

  // JSONの中にJSONが入ってるなぞ仕様
  const body = parsePayload(data.payload);

  if (body.callback_id === "debug") {
    res.send(200, "");
    return;
  }

  const action = body.actions.find(
    ({ action_id }) => action_id === "remind24Hlater"
  );

  if (!action) {
    res.send(400, "Missing reminder action");
    return;
  }

  req.extend(
    setReminderFor24HoursLater(context, {
      uuid: action.value,
    })
  );

  res.send(200, "");
});

// scheduled events
const cron = CronDispatcher();

// ログインボーナスを踏む
cron.add("19 1/12 * * *", signToHoyolab);

// リマインダー
cron.add("* * * * *", async ({ scheduledTime }) => {
  const { notifyWithBlocks } = slack();
  // 保存されてるのにあわせて秒単位に詰める
  const time = Math.floor(scheduledTime / 60 / 1000) * 60 * 1000;
  const reminders = await getReminder(time);

  reminders.forEach(({ uuid, message }) => {
    notifyWithBlocks([
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `${message}:${uuid}`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Remind 24h later",
          },
          value: uuid,
          action_id: "remind24Hlater",
        },
      },
    ]);
  });
});

// listen
listen(router.run);
schedule(cron.dispatch);
