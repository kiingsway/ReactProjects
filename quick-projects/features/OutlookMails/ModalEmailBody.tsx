import IconText from "@/components/IconText";
import { IMessage } from "@/interfaces";
import { Modal, Button, Tabs, TabsProps, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React from "react";
import { TbExternalLink } from "react-icons/tb";

interface Props {
  message?: IMessage;
  loading: boolean;
  open: boolean;
  onClose: () => void;
  getFullBody: () => void;
}

export default function ModalEmailBody({ open, message, loading, onClose, getFullBody }: Props): React.JSX.Element {

  const mailData = React.useMemo(() => ({
    fromName: message?.from?.emailAddress?.name ?? "",
    fromAddress: message?.from?.emailAddress?.address ?? "",
    subject: message?.subject ?? "",
    preview: message?.bodyPreview ?? "",
    webLink: message?.webLink ?? "",
    content: message?.body?.content ?? ""
  }), [message]);

  const { fromName, fromAddress, subject, preview, webLink, content } = mailData;

  const mailSubject = subject || "(No subject)";

  const tabContentStyle: React.CSSProperties = {
    minHeight: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  const items: TabsProps["items"] = [
    {
      key: "true",
      label: "E-mail Body",
      children: (
        <div className="w-full" style={tabContentStyle}>
          <BodyContent content={content} loading={loading} />
        </div>
      ),
    },
    {
      key: "false",
      label: "E-mail Body Preview",
      children: (
        <div className="w-full" style={tabContentStyle}>
          <BodyPreview preview={preview} />
        </div>
      ),
    },
  ];

  // React.useEffect(() => {
  //   if (!content && open && !loading) {
  //     getFullBody();
  //   }
  // }, [content, open, loading, getFullBody]);

  const onTabChange = (key: string): void => {
    if (key === "true" && !content && !loading) getFullBody();
  };

  return (
    <Modal
      title={mailSubject}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="outlook" onClick={onClose} type="primary" target="_blank" href={webLink}>
          <IconText icon={<TbExternalLink />} text="Abrir no Outlook" iconPosition="right" />
        </Button>
      ]}>
      <small>{fromName} &lt;{fromAddress}&gt;</small>
      <Tabs defaultActiveKey={String(Boolean(content))} items={items} onChange={onTabChange} />
    </Modal>
  );
}

const BodyContent = ({ content, loading }: { content?: string; loading: boolean }): React.JSX.Element => {
  if (loading) return <div className="w-full text-center"><Spin indicator={<LoadingOutlined spin />} size="large" />  </div>;
  if (!content) return <span style={{ opacity: 0.3 }}><i>No body content</i></span>;
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

const BodyPreview = ({ preview }: { preview?: string }): React.JSX.Element => {
  if (preview) return <div style={{ whiteSpace: "pre-wrap" }}>{preview}</div>;
  return <span style={{ opacity: 0.3 }}><i>No body preview</i></span>;
};