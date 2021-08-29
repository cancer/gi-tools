type Client = {
  sign: Sign;
  fetchTotalSignDays: FetchTotalSignDays;
};
type Options = {
  uuid: string;
  accountId: string;
  sessionId: string;
};
type ClientFactory = (opts: Options) => Client;

type Context = {
  uuid: string;
  accountId: string;
  cookies: string;
};
type WithContext<T> = (context: Context) => T;

export const mihoyo: ClientFactory = ({ uuid, accountId, sessionId }) => {
  const cookies = `mi18nLang=ja-jp; _MHYUUID=${uuid}; account_id=${accountId}; cookie_token=${
    sessionId ?? ""
  }`;

  const context = { cookies, uuid, accountId };
  return {
    sign: sign(context),
    fetchTotalSignDays: fetchTotalSignDays(context),
  };
};

type Sign = () => Promise<void>;
const sign: WithContext<Sign> =
  ({ cookies, accountId, uuid }) =>
  async () => {
    const json = await fetch(
      "https://hk4e-api-os.mihoyo.com/event/sol/sign?lang=ja-jp",
      {
        method: "POST",
        headers: {
          Cookie: cookies,
        },
        body: JSON.stringify({
          act_id: "e202102251931481",
        }),
      }
    ).then((res) => res.json());

    if (json.code === 0) return;

    throw new Error(json.message);
  };

type FetchTotalSignDays = () => Promise<{ days: number }>;
const fetchTotalSignDays: WithContext<FetchTotalSignDays> =
  ({ cookies }) =>
  async () => {
    const json = await fetch(
      "https://hk4e-api-os.mihoyo.com/event/sol/info?lang=ja-jp&act_id=e202102251931481",
      {
        method: "GET",
        headers: {
          Cookie: cookies,
        },
      }
    ).then((res) => res.json());

    if (json.retcode !== 0) throw new Error(json.message);

    const {
      data: { total_sign_day: days },
    } = json;
    return { days };
  };
