import { Tooltip } from "antd";
import { DateTime } from "luxon";
import React from "react";

interface Props {
  date?: string;
  className?: string;
}

export default function ColumnDate({ className, date: dateString }: Props): React.JSX.Element {

  if (!dateString) return <></>;

  const date = DateTime.fromISO(dateString);

  const tooltipText = ((): string => {
    if (!date.isValid) return `Date: "${String(dateString)}"`;
    return date.toFormat("dd/MM/yyyy HH:mm:ss");
  })();

  return (
    <Tooltip title={tooltipText}>
      <span className={className}>{date.isValid ? date.toFormat("dd MMMM yyyy HH:mm") : "Invalid Date"}</span>
    </Tooltip>
  );
}