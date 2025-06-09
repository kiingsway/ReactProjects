import IconText from "@/components/IconText";
import { IMessage } from "@/interfaces";
import useBoolean from "@/services/hooks/useBoolean";
import { Button, Modal, Tabs, TabsProps, Tooltip } from "antd";
import React from "react";
import { IoMailOpenOutline, IoMailUnread } from "react-icons/io5";
import { TbExternalLink, TbMailQuestion } from "react-icons/tb";

interface Props {
  message: IMessage;
}

export default function OutColTitle({ message }: Props): React.JSX.Element {

  const [emailModal, { setTrue: openEmailModal, setFalse: closeEmailModal }] = useBoolean(false);

  const { subject, isRead } = message;

  const IsReadIcon = (): JSX.Element => {
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


  const BodyContent = (): React.ReactNode => {
    if (message?.body?.content) return message?.body?.content;
    if (message.bodyPreview) return message.bodyPreview;
    return <span style={{ opacity: .3 }}><i>No body preview</i></span>;
  };

  const mailSubject = subject || "(No subject)";

  return (
    <>
      <Button
        style={{ maxWidth: 500 }}
        className="flex items-center gap-4 overflow-hidden text-ellipsis"
        type="text"
        onClick={openEmailModal}
      >
        <IsReadIcon />
        <Tooltip title={subject}>
          <span className="truncate whitespace-nowrap"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              opacity: subject ? 1 : 0.3
            }}>
            {mailSubject}
          </span>
        </Tooltip>
      </Button>

      <Modal
        title={mailSubject}
        open={emailModal}
        onCancel={closeEmailModal}
        footer={[
          <Button key="outlook" onClick={closeEmailModal} type="primary" target="_blank" href={message.webLink}>
            <IconText icon={<TbExternalLink />} text="Abrir no Outlook" iconPosition="right" />
          </Button>
        ]}>
        <BodyContent1 msg={message} />
        {/* <div style={{ whiteSpace: "pre-wrap" }}><BodyContent /></div> */}
      </Modal>
    </>
  );
}

function BodyContent1({ msg }: { msg: IMessage }): React.JSX.Element {

  const activeKey = msg?.body?.content ? "full" : "preview";

  const Children = ({ text }: { text?: string }): React.ReactNode => {
    if (text) return <div style={{ whiteSpace: "pre-wrap" }}>{text}</div>;
    return <span style={{ opacity: .3 }}><i>No body preview</i></span>;
  };

  const items: TabsProps["items"] = [
    {
      key: "full",
      label: "E-mail Body",
      children: <Children text={msg?.body?.content} />
    },
    {
      key: "preview",
      label: "E-mail Body Preview",
      children: <Children text={msg?.bodyPreview} />
    },
  ];


  return <Tabs defaultActiveKey={activeKey} items={items} />;
}