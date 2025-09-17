import IconText from "@/components/IconText";
import useBoolean from "@/hooks/useBoolean";
import { Button, Input, Modal } from "antd";
import React from "react";
import { IoMdAdd, IoMdCopy } from "react-icons/io";
import { copyScript, parseStringArray } from "./helpers";
import { hashIRItem } from "./convertToExpenses/hashIRItem";
import { IRbcItem } from "./interfaces";
import ClickableSwitch from "../ClickableSwitch";

interface AddJsonModalProps {
  // eslint-disable-next-line no-unused-vars
  onRealData: (data: unknown[], concat: boolean) => void
  dataExists: boolean;
}

export default function AddJsonModal({ onRealData, dataExists }: AddJsonModalProps): React.JSX.Element {

  const [jsonText, setJsonText] = React.useState("");
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [concatItems, { set: setConcatItems }] = useBoolean();

  const [data, isArray] = React.useMemo(() => {
    const data = (parseStringArray(jsonText) || []) as IRbcItem[];
    return [data.map(d => ({ ...d, key: hashIRItem(d) })), Boolean(data?.length)];
  }, [jsonText]);

  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(copyScript);
    } catch (error) {
      console.error("Failed to copy script:", error);
    }
  };

  const onFinish = (): void => {
    if (!jsonText || !isArray) return;
    onRealData(data, concatItems);
    closeModal();
  };

  return (
    <>
      <Button type="primary" onClick={openModal}>
        <IconText icon={<IoMdAdd />} text="Add JSON" />
      </Button>
      <Modal
        title="Importar JSON"
        open={modalOpen}
        onCancel={closeModal}
        onOk={onFinish}
        okText="Import"
        cancelText="Cancel"
        okButtonProps={{ disabled: !isArray }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-between items-center">
            <p>Paste your JSON content here:</p>
            <Button onClick={onCopy}><IconText icon={<IoMdCopy />} text="Copy Script" /></Button>
          </div>
          <Input.TextArea
            rows={8}
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            placeholder='Ex: [{Date: 123, Value: 999.99}, ...]'
          />
          {!dataExists ? <></> : (
            <ClickableSwitch
              checked={concatItems}
              onChange={setConcatItems}
              label="Concatenar com os expenses existentes" />
          )}
        </div>
      </Modal>
    </>
  );
}