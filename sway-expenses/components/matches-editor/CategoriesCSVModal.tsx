import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { formItemLayout } from './MatchesModalForm';
import { IConversionCategory } from '@/pages/matches-editor';

interface Props {
  open: boolean;
  onClose: () => void;
  setPossibleCategories: (cats: IConversionCategory[]) => void;
}

interface ICatCSV {
  CSV: string;
}

export default function CategoriesCSVModal({ setPossibleCategories, onClose, open }: Props): React.JSX.Element {

  const [form] = Form.useForm<ICatCSV>();

  const handleFinish = (newMatch: ICatCSV) => {
    console.log("Raw CSV:", newMatch);
    console.log("Conversion", csvToJson(newMatch.CSV));
    setPossibleCategories(csvToJson(newMatch.CSV));

    onClose();
  };

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      form.setFieldsValue({ CSV: text });
    } catch (err) {
      console.error('Erro ao ler a área de transferência:', err);
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={"Categories CSV"}
      onOk={form.submit}
    >
      <p>Exporte as categorias do HomeBank (.csv) e insira aqui para fazer a verificação de categorias inexistentes nos seus matches</p>
      <Form<ICatCSV>
        style={{ padding: "20px 0 10px" }}
        form={form}
        onFinish={handleFinish}
        {...formItemLayout}
      >
        <Form.Item
          rules={[{ required: true }]}
          label="CSV"
          name="CSV">
          <Input addonBefore={<Button size='small' type='text' onClick={pasteFromClipboard}>Paste</Button>} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function csvToJson(csv: string): IConversionCategory[] {
  const lines = csv.trim().split('\n');
  const result: IConversionCategory[] = [];

  let currentCategory = '';

  for (const line of lines) {
    const parts = line.split(';');
    if (parts.length < 3) continue;

    const level = parts[0].trim();
    // const ignore = parts[1]; // Ignorado
    const name = parts[2].trim();

    if (level === '1') {
      currentCategory = name;
      result.push({ Category: currentCategory, Subcategory: "" });
    } else if (level === '2') {
      if (!currentCategory) {
        throw new Error('Subcategoria sem categoria pai encontrada');
      }
      result.push({ Category: currentCategory, Subcategory: name });
    }
  }

  return result;
}