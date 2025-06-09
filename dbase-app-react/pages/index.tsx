import DatabasesTable from "@/components/DatabasesTable";
import { useDatabases } from "@/hooks/useDatabases";
import { Button, notification, Tooltip } from "antd";
import React from "react";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import Apps from "./apps";
import { getErrorMessage } from "@/app/services/helpers";

export default function Home(): React.JSX.Element {

  const [api, contextHolder] = notification.useNotification();

  const { data, error, isValidating, updateData } = useDatabases();

  React.useEffect(() => {
    if (error) {
      const e = getErrorMessage(error);
      api.error({
        message: "Error getting data",
        description: e,
        duration: 5,
        placement: "topRight",
      });
    }
  }, [error, api]);


  const Toolbar = (): React.JSX.Element => (
    <div className="flex gap-2 py-2 px-4 rounded-lg bg-gray-100 justify-between">
      <Button type="primary" disabled><IoMdAdd />New Database</Button>
      <Tooltip title={isValidating ? "Updating data..." : "Update data"}>
        <Button
          style={{ fontWeight: 500 }}
          type="text"
          disabled={isValidating}
          loading={isValidating}
          icon={<IoMdRefresh />}
          onClick={updateData} />
      </Tooltip>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      {contextHolder}
      <h1 className="font-semibold text-xl">Notion Databases</h1>
      <div className="flex flex-col gap-y-2 max-w-[800px] w-full mx-auto">
        <Toolbar />
        <DatabasesTable data={data} />
      </div>
      <Apps asComponent />
    </div>
  );
}