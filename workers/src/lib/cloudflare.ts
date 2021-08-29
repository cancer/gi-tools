import { CronEvent, CronHandler } from "worktop";

type Dispatcher = {
  add(trigger: string, handler: CronHandler): void;
  dispatch(ev: CronEvent): void;
};
export function CronDispatcher(): Dispatcher {
  const handlers = new Map<string, CronHandler>();

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

type Schedule = (fn: (ev: CronEvent) => void) => void;
export const schedule: Schedule = (fn) => {
  addEventListener("scheduled", (ev: CronEvent) => ev.waitUntil(fn(ev)));
};
