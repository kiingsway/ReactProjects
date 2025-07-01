import AppsFrame from "@/components/AppsFrame";
import CloudTable from "@/components/Expenses/CloudTable";
import CsvModal from "@/components/Expenses/CSVModal";
import CSVTable from "@/components/Expenses/CSVTable";
import { TypeCSV } from "@/components/Expenses/interfaces";
import IconText from "@/components/IconText";
import useBoolean from "@/hooks/useBoolean";
import { Button, message, Tabs, TabsProps } from "antd";
import React from "react";
import { IoMdAdd } from "react-icons/io";

/**
 * Iniciar na tabela do Notion
 * Aba de tabela CSV bloqueada
 * Botão para adicionar CSV
 * Selecionar o arquivo e enviar
 * Quando enviar, fazer verificação do arquivo para ver se é CSV memso e se é legível
 * Se sim, desbloqueia a aba Tabela CSV e mostra o CSV lá
 *  Caso já tenha dados, concatenar sem duplicar
 * Mostrar tabela com caixa de seleção
 * Os itens da tabela devem fazer uma comparação com os itens do Notion
 *  Se tiverem iguais, impedir a adição
 */

export default function Expenses(): React.JSX.Element {

  const [jsonCSV, setJsonCSV] = React.useState<TypeCSV[]>();
  const [open, { setTrue: openModal, setFalse: closeModal }] = useBoolean();

  const items: TabsProps["items"] = [
    {
      key: "notion",
      label: "Cloud Table",
      children: <CloudTable />,
    },
    {
      key: "csv",
      label: "CSV Table",
      children: <CSVTable data={jsonCSV} />,
      disabled: !jsonCSV,
    }
  ];

  const onSuccess = (data: TypeCSV[]): void => {
    setJsonCSV(prev => {
      const old = prev || [];
      const all = [...old, ...data];
      const unique = Array.from(new Map(all.map(i => [i.key, i])).values());

      const added = unique.length - old.length;
      const ignored = data.length - added;

      message.success(`CSV imported - ${added} of ${data.length} items added.` + (ignored ? ` (${ignored} ignored)` : ""));
      return unique;
    });
  };

  return (
    <AppsFrame>
      <div>
        <Button type="primary" onClick={openModal}>
          <IconText icon={<IoMdAdd />} text="Add CSV" />
        </Button>
      </div>
      <Tabs defaultActiveKey="1" items={items} />
      <CsvModal open={open} onClose={closeModal} onSuccess={onSuccess} />
    </AppsFrame>
  );
}