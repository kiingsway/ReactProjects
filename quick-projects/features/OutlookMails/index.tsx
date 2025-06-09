import React from "react";
import HeaderLogin from "./HeaderLogin";
import { IMe, IMessage } from "@/interfaces";
import Search from "antd/es/transfer/search";
import { getMessages } from "@/services/graph/getMessages";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FriendlyDate } from "@/components/FriendlyDate";
import OutColTitle from "./TableColumns/OutColTitle";
import useBoolean from "@/services/hooks/useBoolean";
import OutColFrom from "./TableColumns/OutColFrom";
import { rawText } from "@/services/helpers";

export default function OutlookMailsComp(): React.JSX.Element {

  const [token, setToken] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");
  const [me, setMe] = React.useState<IMe>();
  const [messages, setMessages] = React.useState<IMessage[]>([]);
  const [loading, { setTrue: startLoading, setFalse: stopLoading }] = useBoolean();

  const onLogin = (newToken: string, newMe: IMe): void => {
    setToken(newToken);
    setMe(newMe);
  };

  React.useEffect(() => {
    if (me && token) {
      const fetchAllMessages = async (): Promise<void> => {
        startLoading();
        try {
          let nextLink: string | undefined;

          // Limpa antes de começar (opcional, evita duplicação)
          setMessages([]);

          do {
            const { data } = await getMessages(token, nextLink);
            console.log("data", data);

            // Adiciona os novos à lista já existente
            setMessages(prev => [...prev, ...data.value]);

            nextLink = data["@odata.nextLink"];
          } while (nextLink);
        } catch (error) {
          console.error("Erro ao buscar mensagens:", error);
        } finally {
          stopLoading();
        }
      };

      fetchAllMessages();
    }
  }, [me, token]);


  const filteredMessages = React.useMemo(() => {
    if (!search) return messages;

    const s = rawText(search);
    return messages.filter(msg => {
      const { subject, from: { emailAddress: { address } } } = msg;
      return rawText(subject).includes(s) || rawText(address).includes(s);
    });
  }, [messages, search]);

  const columns: ColumnsType<IMessage> = [
    {
      title: "Received",
      dataIndex: "receivedDateTime",
      key: "receivedDateTime",
      render: date => <FriendlyDate date={date as string} />,
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (_, r) => <OutColTitle message={r} />,
    },
    {
      title: "From",
      dataIndex: ["from", "emailAddress"],
      key: "from",
      render: (_, r) => <OutColFrom message={r} />,
    },
  ];

  return (
    <div className="w-full">
      <HeaderLogin displayName={me?.displayName} token={token} onLogin={onLogin} loading={loading} />
      <Search value={search} onChange={e => setSearch(e.target.value)} />
      <Table
        rowKey="id"
        dataSource={filteredMessages}
        columns={columns}
        size="small"
        pagination={{ hideOnSinglePage: true }} />
    </div>
  );
}