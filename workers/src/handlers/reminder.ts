import { Handler } from "worktop";
import { setReminderFor24HoursLater } from "../applications/set-reminder-for24-hours-later";
import { createContext } from "../context";
import { Reminder } from "../models/reminder";

type Params = Pick<Reminder, "uuid">;
export const postReminder: Handler = async (req, res) => {
  const context = createContext();
  
  const body = await req.body<Params>();
  if (!body || !body.uuid)
    return res.send(400, "Missing required parameter `uuid`");
  
  req.extend(await setReminderFor24HoursLater(context, body));
  
  res.send(200, "");
};
