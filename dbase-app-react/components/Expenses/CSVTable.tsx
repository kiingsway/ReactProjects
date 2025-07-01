import { defaultSorter, rawText } from "@/app/services/helpers";
import { Input, Table, Tooltip } from "antd";
import React from "react";
import { TypeCSV } from "./interfaces";
import { ColumnsType } from "antd/es/table";
import ClickableSwitch from "../ClickableSwitch";
import useBoolean from "@/hooks/useBoolean";
import { HiKey } from "react-icons/hi";
import { SiNotion } from "react-icons/si";
import EditableRowsTableTest from "./EditableRowsTableTest";
import CSVEditableTable from "./CSVEditableTable";

interface Props {
  data?: TypeCSV[];
}

export default function CSVTable({ data: d }: Props): React.JSX.Element {
  const [search, setSearch] = React.useState("");
  const [showKey, { set: setShowKey }] = useBoolean();
  const [notionTable, { set: setNotionTable }] = useBoolean();

  //if (!data || data.length === 0) return <p>Nenhum dado para exibir.</p>;
  const data = d || [];

  const dataSource = data.filter(row =>
    Object.values(row).some((value) => rawText(value).includes(rawText(search)))
  );

  const dataKeys = Object.keys(data[0]);
  const dataProps = showKey ? dataKeys : dataKeys.filter(p => p !== "key");

  const columns: ColumnsType<TypeCSV> = dataProps.map((key) => ({
    key,
    title: key,
    dataIndex: key,
    sorter: (a, b): number => defaultSorter(b, a, key),
    ...(key === "key" && {
      render: (key: string) => !key ? <></> : <Tooltip title={key}><HiKey /></Tooltip>
    }),
  }));


  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <ClickableSwitch label="Show key" checked={showKey} onChange={setShowKey} icon={<HiKey />} />
        <ClickableSwitch label="Convert to Notion" checked={notionTable} onChange={setNotionTable} icon={<SiNotion />} />
      </div>
      <Input.Search
        placeholder="Pesquisar..."
        allowClear
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {notionTable ?
        <CSVEditableTable data={dataSource} showKey={showKey} />
        :
        <Table
          size="small"
          columns={columns} dataSource={dataSource}
          pagination={{ hideOnSinglePage: true, pageSizeOptions: [10, 20, 40] }}
        />}
      <EditableRowsTableTest />
    </div>
  );
}
