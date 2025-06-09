import useBoolean from "@/hooks/useBoolean";
import { NotionDatabasePagePropertiesName } from "@/interfaces";
import { Tooltip, Button, Modal } from "antd";
import React from "react";
import { VscJson } from "react-icons/vsc";

export default function UnhandledColumnRenderer({ column }: { column: NotionDatabasePagePropertiesName }): React.JSX.Element {
  const [open, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  return (
    <>
      <Tooltip title="Tipo não suportado">
        <span style={{ marginRight: 8 }}>⚠️ Não suportado</span>
      </Tooltip>
      <Button size="small" onClick={openModal} icon={<VscJson />} />
      <Modal
        open={open}
        title={`Conteúdo de "${column.prop_name}"`}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(column, null, 2)}</pre>
      </Modal>
    </>
  );
}