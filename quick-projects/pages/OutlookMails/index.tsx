import IconText from "@/components/IconText";
import OutlookMailsComp from "@/features/OutlookMails";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { TiHome } from "react-icons/ti";

export const pageInfo = {
  title: "Outlook Mails",
  description: "Obter e filtrar e-mails do Outlook por Graph.",
};

export default function OutlookMails(): React.JSX.Element {

  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center min-h-screen" style={{ width: 1000 }}>

        <div className="w-full">
          <Button onClick={() => router.push("/")} type="text" className="opacity-50">
            <IconText icon={<TiHome />} text="Home" />
          </Button>
        </div>

        <div className="w-full rounded-lg flex text-center items-center justify-center bg-gray-50">
          <OutlookMailsComp />
        </div>

      </div>
    </div>
  );
}