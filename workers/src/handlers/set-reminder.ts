import { Handler } from "worktop";
import { setReminder } from "../applications/set-reminder";
import { Reminder } from "../models/reminder";

type Params = Pick<Reminder, "uuid"> & {
  time: number;
};

export const postSetReminder: Handler = async (req, res) => {
  const body = await req.body<Partial<Params>>();

  if (!body) return res.send(400, "Missing body.");
  if (body.uuid === undefined)
    return res.send(400, "Missing required parameter uuid.");
  if (body.time === undefined)
    return res.send(400, "Missing required parameter time.");
  
  const { uuid, time } = body;

  try {
    await setReminder({ now: Date.now }, { uuid, time });
  } catch (e) {
    if (e instanceof Error) {
      return res.send(400, e.message);
    }
  }

  res.send(200, "");
};
