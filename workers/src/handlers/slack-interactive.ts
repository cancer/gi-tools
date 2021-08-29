import { Handler } from "worktop";
import { setReminderFor24HoursLater } from "../applications/set-reminder-for24-hours-later";
import { createContext } from "../context";

type SlackPayload = {
  callback_id: string;
  actions: {
    type: string;
    action_id: string;
    value: string;
  }[];
};

const parsePayload = (payload: string): SlackPayload => JSON.parse(payload);

export const postSlackInteractive: Handler = async (req, res) => {
  const data = await req.body<{ payload: string | null }>();
  const context = createContext();

  if (!data || !data.payload)
    return res.send(400, "Missing required parameter `uuid`");

  // JSONの中にJSONが入ってるなぞ仕様
  const body = parsePayload(data.payload);

  if (body.callback_id === "debug") {
    res.send(200, "");
    return;
  }

  const action = body.actions.find(
    ({ action_id }) => action_id === "remind24Hlater"
  );

  if (!action) {
    res.send(400, "Missing reminder action");
    return;
  }

  req.extend(
    setReminderFor24HoursLater(context, {
      uuid: action.value,
    })
  );

  res.send(200, "");
};
