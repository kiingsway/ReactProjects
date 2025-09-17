import { Button } from "antd";
import Image from "next/image";
import IconText from "./components/IconText";
import { BsJournalBookmarkFill, BsJournalPlus } from "react-icons/bs";

export default function Home() {
  return (
    <div className="p-4">
      <div className="flex gap-4 items-center">
        <Button type="primary"><IconText text="Add to Journal" icon={<BsJournalPlus />} /></Button>
        <Button type="primary"><IconText text="Add Addct Type" icon={<BsJournalBookmarkFill />} /></Button>
      </div>
    </div>
  );
}
