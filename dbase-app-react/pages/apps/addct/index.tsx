
import React from "react";
import { Page, TAdcTypes, TitleProperties } from "@/interfaces";
import useSWR from "swr";
import axios from "axios";
import AddctGraph, { typeColors } from "@/components/Addct/AddctGraph";
import type { MenuProps } from "antd";
import { Button, Tooltip, Dropdown, Tabs, notification } from "antd";
import { IoMdRefresh } from "react-icons/io";
import { IoAddOutline } from "react-icons/io5";
import { BiBarChartAlt2, BiTable } from "react-icons/bi";
import { getDBUrl, getErrorMessage, swrNoRefresh } from "@/app/services/helpers";
import { TiHome } from "react-icons/ti";
import { useRouter } from "next/router";
import useBoolean from "@/hooks/useBoolean";
import AddctModalForm from "@/components/Addct/AddctModalForm";
import AddctTable from "@/components/Addct/AddctTable";
import { SuccessResponse } from "@/app/services/requests";
import { DefaultOptionType } from "antd/es/select";
import IconText from "@/components/IconText";

export const addctDatabaseId = "1fe52d77-45e1-8025-8aa2-c545ef1af6f1";
export const addctTypesDatabaseId = "1fe52d77-45e1-8088-b672-d744ef011401";

const addctDatabaseUrl = getDBUrl(addctDatabaseId);
const addctTypesDatabseUrl = getDBUrl(addctTypesDatabaseId);

const fetcher = async (url: string): Promise<Page[]> => (await axios.get<SuccessResponse<Page[]>>(url)).data.data || [];

export default function Addct(): React.JSX.Element {

  const router = useRouter();
  const [notify, contextHolder] = notification.useNotification();
  const [formOpen, { setTrue: openModalForm, setFalse: closeModalForm }] = useBoolean();
  const [formType, setFormType] = React.useState<TAdcTypes>();

  const openForm = (type?: TAdcTypes): void => { setFormType(type); openModalForm(); };
  const closeForm = (): void => { setFormType(undefined); closeModalForm(); };

  const {
    data: addctItems,
    isValidating: addctValidating,
    error: addctError, mutate: mutateAddct } = useSWR<Page[]>(addctDatabaseUrl, fetcher, { ...swrNoRefresh });

  const {
    data: addctTypesData,
    isValidating: addctTypesValidating,
    error: addctTypesError, mutate: mutateAddctTypes } = useSWR<Page[]>(addctTypesDatabseUrl, fetcher, { ...swrNoRefresh });

  const addctTypes = getTypesFromData(addctTypesData);

  const isLoading = addctValidating || addctTypesValidating;
  const updateData = (): void => { mutateAddctTypes(addctTypesData); mutateAddct(addctItems); };

  const onMenuClick: MenuProps["onClick"] = e => { openForm(e.key as TAdcTypes); };

  const items: MenuProps["items"] = (["A1", "B1", "F1", "PhHs"] as TAdcTypes[]).map(t => ({
    key: t, disabled: isLoading, label: <IconText text={t} icon={<IoAddOutline style={{ color: typeColors[t] }} />} />,
  }));

  const tabs: { key: string; label: React.ReactNode; children: React.ReactNode; }[] = [
    { key: "graph", label: <IconText text="Graph" icon={<BiBarChartAlt2 />} />, children: <AddctGraph data={addctItems} /> },
    {
      key: "list", label: <IconText text="Table" icon={<BiTable />} />, children: (
        <AddctTable
          data={addctItems}
          addctTypes={addctTypes}
          updateData={updateData} />
      )
    },
  ];

  React.useEffect(() => {
    const errors = [addctError, addctTypesError].filter(Boolean);
    console.error(...errors);
    if (errors.length > 0) {
      errors.forEach(error => {
        const description = getErrorMessage(error);
        console.error(description);
        notify.error({ message: "Error loading data", description, duration: 5 });
      });
    }
  }, [addctError, addctTypesError, notify]);


  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 max-w-4xl w-full mx-auto">
      {contextHolder}
      <div className="flex gap-2 py-2 px-2 w-full">
        <Button onClick={() => router.push("/")} type="text" className="opacity-50"><IconText icon={<TiHome />} text="Home" /></Button>
      </div>
      <div className="flex gap-2 py-2 px-2 rounded-lg bg-gray-100 justify-between w-full">
        <div className="flex gap-2">
          <Dropdown.Button
            type="primary"
            disabled={isLoading}
            loading={isLoading}
            onClick={() => openForm()}
            menu={{ items, onClick: onMenuClick }}>
            <IconText text="Add" icon={<IoAddOutline />} />
          </Dropdown.Button>
        </div>
        <Tooltip title={isLoading ? "Updating data..." : "Update data"}>
          <Button
            style={{ fontWeight: 500 }}
            type="text"
            disabled={isLoading}
            loading={isLoading}
            icon={<IoMdRefresh />}
            onClick={updateData} />
        </Tooltip>
      </div>
      <div className="bg-gray-50 w-full p-4 rounded-lg">
        <Tabs defaultActiveKey="graph" items={tabs} />
      </div>
      <AddctModalForm
        open={formOpen}
        formType={formType}
        onClose={closeForm}
        updateData={updateData}
        addctTypes={addctTypes}
      />
    </div>
  );
}

function getTypesFromData(data?: Page[]): DefaultOptionType[] {
  if (!data || !data.length) return [];

  return data.map(d => ({
    label: (d.properties.Nome as TitleProperties).title[0].plain_text,
    value: d.id,
  }));
}