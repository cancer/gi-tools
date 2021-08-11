import { signToHoyolab } from "./applications/sign-to-hoyolab";
import { CronDispatcher, schedule } from "./lib/cloudflare";

// scheduled events
const cron = CronDispatcher();

// ログインボーナスを踏む
cron.add("19 1/12 * * *", signToHoyolab);

// listen
schedule(cron.dispatch);
