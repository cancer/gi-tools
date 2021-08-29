import type { CronHandler } from "worktop";
import { slack } from "../external/slack-client";
import { getReminder } from "../models/reminder";

export const remind: CronHandler = async ({ scheduledTime }) => {
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
};
