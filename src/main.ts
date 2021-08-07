import { mihoyo } from "./external/mihoyo-client";
import { slack } from "./external/slack-client";

type Handler = (ev: Pick<ScheduledEvent, "scheduledTime">) => Promise<void>;
const handler: Handler = async ({ scheduledTime }) => {
  const accounts = [ACCOUNT_A, ACCOUNT_B];
  const [uuid, accountId, sessionId] =
    accounts[Math.floor(new Date(scheduledTime).getUTCHours() / 12)].split(":");

  const { sign, fetchTotalSignDays } = await mihoyo({
    uuid,
    accountId,
    sessionId,
  });
  const { notify } = slack();

  try {
    await sign();
  } catch (e) {
    await notify({ text: `${e.message}: ${uuid}` });
    return;
  }

  let days;
  try {
    const { days: _ } = await fetchTotalSignDays();
    days = _;
  } catch {
    // Slackに undefined日 で通知されれば気づく
  }

  await notify({ text: `累計ログイン: ${days}日: ${uuid}` });
};

// for app
addEventListener("scheduled", (ev) => {
  ev.waitUntil(handler(ev));
});

// for debug
//
// const paths = ["/", "/debug"] as const;
// type Path = typeof paths[number];
// const isAllowedPath = (path: string): path is Path => {
//   return paths.some((v) => v === path);
// };
//
// addEventListener("fetch", (ev) => {
//   const url = new URL(ev.request.url);
//   if (!isAllowedPath(url.pathname)) {
//     return ev.respondWith(new Response("Not Found", { status: 404 }));
//   }
//
//   if (url.pathname === "/debug") {
//     return ev.respondWith(new Response("debug", { status: 200 }));
//   }
//
//   ev.respondWith(
//     handler({ scheduledTime: 0 }).then(() => new Response("", { status: 200 }))
//   );
// });
