import { Fragment } from "preact";
import type { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

const isDisabled = (uuid: string, dateTime: string): boolean => {
  if (uuid === "") return true;
  if (dateTime === "") return true;
  // is past
  if (new Date(dateTime).getTime() < new Date().getTime()) return true;
  return false;
};

// format to yyyy-MM-ddThh:mm
const formatToyyyyMMddThhmm = (dateTime: Date) =>
  new Date(
    Date.UTC(
      dateTime.getFullYear(),
      dateTime.getMonth(),
      dateTime.getDate(),
      dateTime.getHours(),
      dateTime.getMinutes()
    )
  )
    .toISOString()
    .slice(0, 16);

type Props = {};
export const Reminders: FunctionalComponent<Props> = () => {
  const [uuid, setUuid] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => setDateTime(formatToyyyyMMddThhmm(new Date())), []);
  useEffect(() => setDisabled(isDisabled(uuid, dateTime)), [uuid, dateTime]);

  return (
    <Fragment>
      <h2>Set reminder</h2>
      <input
        type="text"
        value={uuid}
        onInput={({ currentTarget: { value } }) => setUuid(value)}
      />
      <input
        type="datetime-local"
        value={dateTime}
        onInput={({ currentTarget: { value } }) => setDateTime(value)}
      />
      <button
        type="submit"
        onClick={async (ev) => {
          ev.preventDefault();
          await fetch("https://gilba.cancer6.workers.dev/set-reminder", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid,
              time: new Date(dateTime).getTime(),
            }),
          });
        }}
        disabled={disabled}
      >
        Set
      </button>
    </Fragment>
  );
};
