import { save } from "../models/reminder";

type Context = {
  now: () => number;
};

type SetReminder = (
  context: Context,
  params: { uuid: string; time: number }
) => Promise<void>;
export const setReminder: SetReminder = async ({ now }, { uuid, time }) => {
  await save({
    uuid,
    time,
    message: "<@U024GBKH0MR> 聖遺物回収の時間だぞ",
    createdAt: now(),
  });
};
