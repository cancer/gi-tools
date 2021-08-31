import type { KV } from "worktop/kv";

export declare const SCHEDULE: KV.Namespace;

export type Reminder = {
  uuid: string;
  time: number;
  message: string;
  createdAt: number;
};

const toPrefix = (time: Reminder["time"]): string => `time:${time}::`;
const toKey = ({ uuid, time, message }: Omit<Reminder, "createdAt">) =>
  `${toPrefix(time)}user:${uuid}::message:${message}`;
const parseKey = (
  key: string,
  prefix: string
): Pick<Reminder, "uuid" | "message"> => {
  const matches = key.match(new RegExp(`^${prefix}user:(.*?)::message:(.*?)$`));

  if (matches === null) throw new Error("Invalid key.");

  const [_, uuid, message] = matches;
  return {
    uuid,
    message,
  };
};

type Save = (reminder: Reminder) => Promise<void>;
export const save: Save = async (reminder) => {
  // リマインドしたのに残しとく意味はないので消す
  // 1000ms経ってればさすがに実行されてるはず
  const expiration = reminder.time + 1000;
  await SCHEDULE.put(toKey(reminder), JSON.stringify(reminder));
  // await write<Reminder>(SCHEDULE, toKey(reminder), reminder, { expiration });
};

type GetReminder = (time: number) => Promise<Omit<Reminder, "createdAt">[]>;
export const getReminder: GetReminder = async (time) => {
  const prefix = toPrefix(time);
  const keyList = await SCHEDULE.list({ prefix });
  return keyList.keys.map((key) => ({ ...parseKey(key.name, prefix), time }));
  //const keys = await paginate(SCHEDULE, { prefix });
  //return keys.map((key) => parseKey(key, prefix));
};

export const remove = async ({
  uuid,
  time,
  message,
}: Omit<Reminder, "createdAt">) => {
  await SCHEDULE.delete(toKey({ uuid, time, message }));
};
