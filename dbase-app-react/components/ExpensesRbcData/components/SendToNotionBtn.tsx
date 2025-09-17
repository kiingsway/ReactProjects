import IconText from "@/components/IconText";
import { Button } from "antd";
import React from "react";
import { SiNotion } from "react-icons/si";

export default function SendToNotionBtn(): React.JSX.Element {
  return (
    <Button type="primary">
      <IconText icon={<SiNotion />} text="Send to Notion" />
    </Button>
  );
}