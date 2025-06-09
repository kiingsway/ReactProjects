import React from "react";
import { Button, Descriptions, DescriptionsProps, Modal, Table, Tooltip } from "antd";
import { friendlyDate } from "@/app/services/helpers";
import { IoMdInformationCircleOutline, IoMdTrash } from "react-icons/io";
import useBoolean from "@/hooks/useBoolean";
import { SiNotion } from "react-icons/si";
import { useRouter } from "next/router";
import { ColumnsType } from "antd/es/table";
import { DatabaseItem, SimplifiedDatabaseItem } from "@/interfaces";

export default function DatabasesTable({ data }: { data?: DatabaseItem[] }): React.JSX.Element {

  const router = useRouter();

  const dataSource = (data || []).map(simplifyDatabaseItem);

  const [database, setDatabase] = React.useState<SimplifiedDatabaseItem>();
  const [infoDBOpen, { setTrue: openDBInfo, setFalse: closeDBInfo }] = useBoolean();

  const openDBModal = (database: SimplifiedDatabaseItem): void => {
    setDatabase(database);
    openDBInfo();
  };

  const closeDBModal = (): void => {
    setDatabase(undefined);
    closeDBInfo();
  };

  const columns: ColumnsType<SimplifiedDatabaseItem> = [
    {
      title: "Title",
      key: "title",
      render: (_: unknown, db: SimplifiedDatabaseItem): React.JSX.Element => {
        const goToDB = (): Promise<boolean> => router.push(`/database/${db.id}`);
        const openModal = (): void => openDBModal(db);
        return (
          <div className="flex flex-row pl-1 items-center">
            <Tooltip title="Database information">
              <Button size="small" type="text" icon={<IoMdInformationCircleOutline />} onClick={openModal} />
            </Tooltip>
            <Tooltip title={`Open ${db.in_trash ? "deleted" : ""} database`}>
              <Button
                size="small"
                type="link"
                onClick={goToDB}
                className={!db.in_trash ? "" : "line-through"}
                danger={db.in_trash}>
                {db.title}
              </Button>
            </Tooltip>
            {!db.in_trash ? <></> : <Tooltip title="Deleted">
              <IoMdTrash style={{ color: "red" }} />
            </Tooltip>}
          </div>
        );
      },
    },
    { title: "Columns", width: 80, render: (_: unknown, db: SimplifiedDatabaseItem) => db.properties.length },
    { title: "Created Time", dataIndex: "created_time", key: "created_time", width: 125 },
    { title: "Last Edited Time", dataIndex: "last_edited_time", key: "last_edited_time", width: 125 }
  ];

  const ModalData = (): React.JSX.Element => {

    if (!database) return <></>;

    const DescTitle = (): React.JSX.Element => {
      if (!database?.title) return <span className="opacity-50">(no title)</span>;
      else return (
        <div className="flex flex-row gap-x-2 items-center">
          <span>{database.title}</span>
          <Tooltip title="Open Notion">
            <Button type="link" size="small" href={database.url} target="_blank">
              <SiNotion />
            </Button>
          </Tooltip>
        </div>
      );
    };

    const DescProperties = (): React.JSX.Element => {
      if (!database.properties || database.properties.length <= 0) return <></>;
      else return (
        <div>
          {database.properties.map(col => {
            return (
              <p key={col.id}>{col.name} (<b>Type</b>: {col.type} - <b>ID</b>: {col.id})</p>
            );
          })}
        </div>
      );
    };

    const items: DescriptionsProps["items"] = [
      {
        key: "1",
        label: "Title",
        children: <DescTitle />,
      },
      {
        key: "2",
        label: "ID",
        children: database?.id,
      },
      {
        key: "3",
        label: "Created Time",
        children: database?.created_time,
      },
      {
        key: "4",
        label: "Last Edited Time",
        children: database?.last_edited_time,
      },
      {
        key: "5",
        label: "Columns",
        children: <DescProperties />
      }
    ];

    return (
      <Modal
        title={`Database: "${database?.title}"`}
        closable={{ "aria-label": "Close Button" }}
        open={infoDBOpen}
        onCancel={closeDBModal}
        width={600}
      >
        <Descriptions column={1} items={items} bordered size="small" />
      </Modal>
    );
  };

  return (
    <>
      <ModalData />
      <Table
        size="small"
        rowKey="id"
        dataSource={dataSource}
        className="w-full max-w-[800px] table-auto"
        columns={columns}
        pagination={{ hideOnSinglePage: true }} />
    </>
  );
}

const simplifyDatabaseItem = (item: DatabaseItem): SimplifiedDatabaseItem => ({
  id: item.id,
  title: item.title.at(-1)?.plain_text || "(sem título)",
  created_time: friendlyDate(item.created_time),
  last_edited_time: friendlyDate(item.last_edited_time),
  properties: Object.values(item.properties),
  url: item.url,
  in_trash: item.in_trash,
});