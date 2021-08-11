import { paginate, remove, write } from "worktop/kv";
import type { KV } from "worktop/kv";

export declare const REMINDER: KV.Namespace;

export type Reminder = {
  uuid: string;
  time: number;
  createdAt: number;
};

const toPrefix = (time: Reminder["time"]): string => `time:${time}`;
const toKey = ({ uuid, time }: Reminder) => `${toPrefix(time)}::user:${uuid}`;

type Save = (reminder: Reminder) => Promise<void>;
export const save: Save = async (reminder) => {
  await write<Reminder>(REMINDER, toKey(reminder), reminder);
};

type List = (time: number) => Promise<string[]>;
export const list: List = async (time) => {
  const prefix = toPrefix(time);
  const keys = await paginate<string[]>(REMINDER, { prefix });
  return keys.map((key) => key.substring(prefix.length));
};

type Destroy = (reminder: Reminder) => Promise<void>;
export const destroy: Destroy = async (reminder) => {
  await remove(REMINDER, toKey(reminder));
};
