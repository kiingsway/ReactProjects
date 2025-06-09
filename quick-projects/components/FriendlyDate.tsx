import React from "react";
import { DateTime } from "luxon";

interface Props {
  date: string; // string ISO 8601
};

export function FriendlyDate({ date }: Props): JSX.Element {
  const dateTime = DateTime.fromISO(date, { locale: "pt-BR" });

  // Validação da string de data
  if (!dateTime.isValid)
    return <span title="Data inválida">⚠️ Data inválida: <code>{date}</code></span>;

  const now = DateTime.now().setLocale("pt-BR");
  const isSameMonth = dateTime.hasSame(now, "month");

  const friendlyDates = {
    tomorrow: `amanhã às ${dateTime.toFormat("HH:mm")}`,
    today: `hoje às ${dateTime.toFormat("HH:mm")}`,
    yesterday: `ontem às ${dateTime.toFormat("HH:mm")}`,
    week: `${dateTime.toFormat(`cccc (dd${isSameMonth ? "" : " LLL"})`)} às ${dateTime.toFormat("HH:mm")}`,
    year: `${dateTime.toFormat("dd LLL")} às ${dateTime.toFormat("HH:mm")}`,
    fullDate: dateTime.toFormat("dd LLL yyyy HH:mm"),
  };

  const Span = ({ children }: React.PropsWithChildren): JSX.Element =>
    <span title={dateTime.toFormat("dd/LL/yyyy HH:mm:ss")}>{children}</span>;

  if (dateTime.hasSame(now.plus({ days: 1 }), "day"))
    return <Span>{friendlyDates.tomorrow}</Span>;

  if (dateTime.hasSame(now, "day"))
    return <Span>{friendlyDates.today}</Span>;

  if (dateTime.hasSame(now.minus({ days: 1 }), "day"))
    return <Span>{friendlyDates.yesterday}</Span>;

  if (dateTime.hasSame(now, "week"))
    return <Span>{friendlyDates.week}</Span>;

  if (dateTime.hasSame(now, "year"))
    return <Span>{friendlyDates.year}</Span>;

  return <Span>{friendlyDates.fullDate}</Span>;
}
