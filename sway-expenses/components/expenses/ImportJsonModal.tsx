import useBoolean from '@/hooks/useBoolean';
import { IRbcItem } from '@/interfaces';
import { Button, Modal, Input } from 'antd';
import React from 'react';
import { IoMdCopy } from 'react-icons/io';
import IconText from '../Elements/IconText';
import ClickableSwitch from '../Elements/ClickableSwitch';
import { parseStringArray, hashIRItem } from '@/services/helpers';
import { copyScript } from '@/services/constants';
import { VscJson } from 'react-icons/vsc';

interface Props {
  onRealData: (data: unknown[], concat: boolean) => void
  dataExists: boolean;
  buttonDisabled?: boolean;
}

export default function ImportJsonModal({ onRealData, dataExists, buttonDisabled }: Props): React.JSX.Element {

  const [jsonText, setJsonText] = React.useState("");
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean();
  const [concatItems, { set: setConcatItems }] = useBoolean();

  const [data, isArray] = React.useMemo(() => {
    try {
      const data = (parseStringArray(jsonText) || []) as IRbcItem[];
      return [data.map(d => ({ ...d, key: hashIRItem(d) })), Boolean(data?.length)];
    } catch {
      return [[], false];
    }
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
      <Button onClick={openModal} disabled={buttonDisabled}>
        <IconText text="Import JSON" icon={<VscJson />} />
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