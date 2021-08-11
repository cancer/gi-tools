import { mihoyo } from "../external/mihoyo-client";
import { slack } from "../external/slack-client";

type SignToHoyolab = (params: { scheduledTime: number }) => Promise<void>;
export const signToHoyolab: SignToHoyolab = async ({ scheduledTime }) => {
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
