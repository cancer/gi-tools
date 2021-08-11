import { save } from "../models/reminder";
import type { Reminder } from "../models/reminder";

type Params = Pick<Reminder, "uuid">;
type RegisterReminder = (params: Params) => Promise<void>;
export const setReminderFor24HoursLater: RegisterReminder = async ({ uuid }) => {
  const createdAt = Date.now();
  const later24h = createdAt + 24 * 60 * 60 * 1000;
  // 秒単位では実行できないのでminutesで切り捨て
  const time = Math.floor(later24h / 1000 / 60) * 1000 * 60;
  
  await save({
    uuid,
    time,
    createdAt,
  });
};
