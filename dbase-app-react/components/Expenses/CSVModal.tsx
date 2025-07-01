/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Modal, Input } from "antd";
import { parseCsvWithTypes } from "@/app/services/helpers";
import { TypeCSV } from "./interfaces";

const { TextArea } = Input;

interface CsvModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (data: TypeCSV[]) => void;
}

const CsvModal: React.FC<CsvModalProps> = ({ open, onClose, onSuccess }) => {
  const [csvText, setCsvText] = useState("");

  const handleImport = (): void => {
    const data = parseCsvWithTypes(csvText);
    if (onSuccess) onSuccess(data);
    onClose();
  };

  return (
    <Modal
      title="Importar CSV"
      open={open}
      onCancel={onClose}
      onOk={handleImport}
      okText="Importar"
      cancelText="Cancelar"
    >
      <p>Cole aqui o conteúdo do seu CSV:</p>
      <TextArea
        rows={8}
        value={csvText}
        onChange={e => setCsvText(e.target.value)}
        placeholder='Ex: "nome","idade"\n"João",30\n"Maria",25'
      />
    </Modal>
  );
};

export default CsvModal;
