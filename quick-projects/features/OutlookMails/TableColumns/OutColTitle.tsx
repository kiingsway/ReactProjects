import { Button, Tooltip } from "antd";
import React from "react";
import { IoMailOpenOutline, IoMailUnread } from "react-icons/io5";
import { TbMailQuestion } from "react-icons/tb";

interface Props {
  subject: string;
  isRead: boolean;
  onClick: () => void
}

export default function OutColTitle({ isRead, subject, onClick }: Props): React.JSX.Element {

  return (
    <Btn onClick={onClick}>
      <IsReadIcon isRead={isRead} />
      <Tooltip title={subject}>
        <Subject show={Boolean(subject)} text={subject} />
      </Tooltip>
    </Btn>
  );
}

const IsReadIcon = ({ isRead }: { isRead: boolean }): JSX.Element => {
  const style = { flexShrink: 0 };

  const icons = [
    <TbMailQuestion key="0" style={style} />,
    <IoMailUnread key="1" style={style} />,
    <IoMailOpenOutline key="2" style={style} />
  ];

  const tooltips = ["Unknown", "Unread", "Read"];
  const index = isRead === true ? 2 : isRead === false ? 1 : 0;

  return <Tooltip title={tooltips[index]}>{icons[index]}</Tooltip>;
};

const Btn = ({ onClick, children }: React.PropsWithChildren<{ onClick: () => void }>): React.JSX.Element => (
  <Button className="flex items-center gap-4 overflow-hidden text-ellipsis"
    style={{ maxWidth: 500 }} type="text" onClick={onClick}>
    {children}
  </Button>
);

const Subject = ({ show, text }: { text: string; show: boolean }): React.JSX.Element => {
  const style: React.CSSProperties = { overflow: "hidden", textOverflow: "ellipsis", opacity: show ? 1 : 0.3 };
  return <span className="truncate whitespace-nowrap" style={style}>{text || "(No subject)"}</span>;
};