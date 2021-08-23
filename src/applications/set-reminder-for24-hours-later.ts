import { slack } from "../external/slack-client";
import { save } from "../models/reminder";
import type { Reminder } from "../models/reminder";

type Context = {
  now: () => number;
};

type Params = Pick<Reminder, "uuid">;
type RegisterReminder = (context: Context, params: Params) => Promise<void>;
export const setReminderFor24HoursLater: RegisterReminder = async (
  { now },
  { uuid }
) => {
  const createdAt = now();
  const later24h = createdAt + 24 * 60 * 60 * 1000;
  // 秒単位では実行できないのでminutesで切り捨て
  const time = Math.floor(later24h / 1000 / 60) * 1000 * 60;

  await save({
    uuid,
    time,
    message: "<@U024GBKH0MR> 聖遺物回収の時間だぞ",
    createdAt,
  });

  const { notify } = slack();
  const date = new Date(time);
  await notify({
    text: `明日の${date.getUTCHours() + 9}:${date.getMinutes()}にお知らせするぞ`,
  });
};
