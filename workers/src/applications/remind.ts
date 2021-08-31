import type { CronHandler } from "worktop";
import { slack } from "../external/slack-client";
import { getReminder, remove } from "../models/reminder";

export const remind: CronHandler = async ({ scheduledTime }) => {
  const { notifyWithBlocks } = slack();
  // 保存されてるのにあわせて秒単位に詰める
  const time = Math.floor(scheduledTime / 60 / 1000) * 60 * 1000;
  const reminders = await getReminder(time);

  // リマインドするものがない
  if (reminders.length === 0) return;

  reminders.forEach(({ uuid, time, message }) => {
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
    remove({ uuid, time, message });
  });
};
