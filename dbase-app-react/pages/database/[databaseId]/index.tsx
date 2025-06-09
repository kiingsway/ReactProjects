// pages/database/[databaseId].tsx
import { getErrorMessage } from "@/app/services/helpers";
import DatabasePagesTable from "@/components/DatabasePagesTable";
import { useDatabasePages } from "@/hooks/useDatabasePages";
import { notification, Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function DatabasePage(): React.JSX.Element {

  const router = useRouter();
  const back = (): Promise<boolean> => router.push("/");
  const rawDatabaseId = router.query.databaseId;
  const databaseId = typeof rawDatabaseId === "string" ? rawDatabaseId : undefined;

  const [api, contextHolder] = notification.useNotification();

  const { data, error } = useDatabasePages(databaseId);

  React.useEffect(() => {
    if (error) {
      api.error({
        message: "Error getting data",
        description: getErrorMessage(error),
        duration: 5,
        placement: "topRight",
      });
    }
  }, [error, api]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <div className="flex flex-row gap-x-2 items-center">
        <Button onClick={back} type="text" className="items-center"><IoIosArrowRoundBack /> Back</Button>
        <h1 className="font-semibold text-xl">ID: {databaseId}</h1>
      </div>
      {contextHolder}
      {!data ? <></> : <DatabasePagesTable databasePages={data} />}
    </div>
  );
}
