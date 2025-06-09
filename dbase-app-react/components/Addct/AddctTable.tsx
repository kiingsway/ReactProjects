import { friendlyDate } from "@/app/services/helpers";
import { DateProperties, Page, RollupProperties } from "@/interfaces";
import { Button, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import ColDate from "../ColumnRenderers/ColDate";
import ColRollup from "../ColumnRenderers/ColRollup";
import AddctModalEditForm from "./AddctModalEditForm";
import useBoolean from "@/hooks/useBoolean";
import { DefaultOptionType } from "antd/es/select";

interface Props {
  data?: Page[];
  addctTypes: DefaultOptionType[];
  updateData: () => void
}

export default function AddctTable({ data, addctTypes, updateData }: Props): React.JSX.Element {

  const [addct, setAddct] = React.useState<Page>();
  const [formOpen, { setTrue: openModalForm, setFalse: closeModalForm }] = useBoolean();
  const openForm = (item: Page): void => { setAddct(item); openModalForm(); };
  const closeForm = (): void => { closeModalForm(); setAddct(undefined); };

  const columns: ColumnsType<Page> = [
    { title: "Date", render: (_, r): React.ReactNode => <ColDate column={r.properties["Data"] as DateProperties} />, width: 150 },
    {
      title: "Addct", render: (_, r): React.ReactNode => {
        return (
          <Tooltip title="Edit item">
            <Button type="text" size="small" onClick={() => openForm(r)}>
              <ColRollup column={(r.properties["Type (Title)"] as RollupProperties)} />
            </Button>
          </Tooltip>
        );
      }
    },
    { dataIndex: "created_time", key: "created_time", title: "Created", render: (v): React.ReactNode => friendlyDate(v), width: 120 },
    { dataIndex: "created_time", key: "last_edited_time", title: "Edited", render: (v): React.ReactNode => friendlyDate(v), width: 120 },
  ];

  return (
    <>
      <AddctModalEditForm
        open={formOpen}
        addctItem={addct}
        onClose={closeForm}
        updateData={updateData}
        addctTypes={addctTypes} />
      <Table
        columns={columns}
        dataSource={data}
        size="small"
        rowKey="id"
        pagination={{
          hideOnSinglePage: true
        }}
      />
    </>
  );
}