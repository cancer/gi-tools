import { CronEvent } from "worktop";

type Handler = (ev: CronEvent) => Promise<void>;

type Dispatcher = {
  add(trigger: string, handler: Handler): void;
  dispatch(ev: CronEvent): Promise<void>;
};
export function CronDispatcher(): Dispatcher {
  const handlers = new Map<string, Handler>();

  return {
    add(trigger, handler) {
      handlers.set(trigger, handler);
    },

    dispatch(ev) {
      const handler = handlers.get(ev.cron);
      if (!handler) return Promise.resolve();
      return handler(ev);
    },
  };
}

type Schedule = (fn: (ev: CronEvent) => Promise<void>) => void;
export const schedule: Schedule = (fn: (ev: CronEvent) => Promise<void>) => {
  addEventListener("scheduled", (ev: CronEvent) => ev.waitUntil(fn(ev)));
};
