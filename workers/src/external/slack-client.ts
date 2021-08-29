type Client = {
  notify: Notify;
  notifyWithBlocks: NotifyWithBlocks;
};
type ClientFactory = () => Client;
export const slack: ClientFactory = () => ({ notify, notifyWithBlocks });

type NotifyParams = {
  text: string;
};
type Notify = (params: NotifyParams) => Promise<void>;
const notify: Notify = ({ text }) => {
  const blocks = [{ type: "section", text: { type: "mrkdwn", text } }];
  return notifyWithBlocks(blocks);
};

type Block = { [key: string]: string | Block };
type Blocks = Record<string, string | Block | Blocks>[];
type NotifyWithBlocks = (blocks: Blocks) => Promise<void>;
const notifyWithBlocks: NotifyWithBlocks = async (blocks) => {
  const body = {
    channel: "C02APA64T3N",
    unfurl_links: false,
    blocks,
  };

  const res = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bearer ${SLACK_BOT_USER_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await res.text());

  const json = await res.json();

  if (!json.ok) throw new Error(json.error);

  return json;
};
