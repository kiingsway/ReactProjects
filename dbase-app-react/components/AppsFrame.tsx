import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { TiHome } from "react-icons/ti";
import IconText from "./IconText";

interface Props {
  contextHolder?: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>
}

export default function AppsFrame({ contextHolder, children }: React.PropsWithChildren<Props>): React.JSX.Element {

  const router = useRouter();

  const childrenStyle: React.CSSProperties = { backgroundColor: "#222222" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 max-w-8xl w-full mx-auto px-4">
      {contextHolder}
      <div className="flex gap-2 py-2 px-2 w-full">
        <Button onClick={() => router.push("/")} type="text" className="opacity-50">
          <IconText icon={<TiHome />} text="Home" />
        </Button>
      </div>
      <div
        style={childrenStyle}
        className="flex flex-col gap-4 p-4 rounded-lg justify-between w-full">
        {children}
      </div>
    </div>
  );
}