import { IMessage } from "@/interfaces";
import { Tooltip } from "antd";
import React from "react";

interface Props {
  message: IMessage;
}

export default function OutColFrom({ message }: Props): React.JSX.Element {

  const fromText = message.from?.emailAddress?.address || "-";

  return (
    <Tooltip title={fromText}>
      <div style={{ maxWidth: 200 }}
        className="flex items-center gap-4 overflow-hidden text-ellipsis">
        <span className="truncate whitespace-nowrap" style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {fromText}
        </span>
      </div>
    </Tooltip>
  );
}