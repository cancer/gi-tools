import { listen, Router } from "worktop";
import { preflight } from "worktop/cors";
import { remind } from "./applications/remind";
import { signToHoyolab } from "./applications/sign-to-hoyolab";
import { postReminder } from "./handlers/reminder";
import { postSetReminder } from "./handlers/set-reminder";
import { postSlackInteractive } from "./handlers/slack-interactive";
import { CronDispatcher, schedule } from "./lib/cloudflare";

// fetch events
const router = new Router();

router.prepare = preflight({
  origin: "*",
  headers: ["Content-Type"],
  methods: ["GET", "POST"],
});

router.add("POST", "/reminder", postReminder);
router.add("POST", "/set-reminder", postSetReminder);

// Slackのボタンクリックなんかで飛んでくるイベント
router.add("POST", "/slack-interactive", postSlackInteractive);

// scheduled events
const cron = CronDispatcher();

// ログインボーナスを踏む
cron.add("19 1/12 * * *", signToHoyolab);

// リマインダー
cron.add("* * * * *", remind);

// listen
listen(router.run);
schedule(cron.dispatch);
