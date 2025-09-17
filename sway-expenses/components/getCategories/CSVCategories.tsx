import React from 'react';
import { Input, Typography, List, Button } from 'antd';
import { copyToClipboard } from './ConvertExpenseTable';

const { TextArea } = Input;
const { Title } = Typography;

interface CategoryCount {
  name: string;
  count: number;
}

interface Props {
  csv: string;
  setCsv: (csv: string) => void;
}

export default function CSVCategories({ csv, setCsv }: Props): React.JSX.Element {
  const [categories, setCategories] = React.useState<CategoryCount[]>([]);

  const handleCsvChange = (value: string) => {
    setCsv(value);

    const lines = value.trim().split('\n');
    if (lines.length < 2) return;

    const headers = lines[0].split(';').map(h => h.trim());
    const categoryIndex = headers.findIndex(h => h.toLowerCase() === 'category');
    if (categoryIndex === -1) return;

    const counts: Record<string, number> = {};

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(';');
      const categoryField = parts[categoryIndex]?.trim();
      if (!categoryField) continue;

      const mainCategory = categoryField.trim();
      if (mainCategory) counts[mainCategory] = (counts[mainCategory] || 0) + 1;
    }

    const result: CategoryCount[] = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count); // ordena por quantidade

    setCategories(result);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16 }}>
      <Title level={4}>Cole seu CSV</Title>
      <TextArea
        rows={10}
        value={csv}
        onChange={e => handleCsvChange(e.target.value)}
        placeholder="Cole aqui o conteúdo do CSV..."
      />

      {categories.length > 0 && (
        <>
          <Title level={5} style={{ marginTop: 24 }}>Categorias encontradas:</Title>
          <List
            bordered
            dataSource={categories}
            renderItem={item => (
              <List.Item>
                <Button size='small' type='link' onClick={() => copyToClipboard(item.name)}>{item.name}</Button>: {item.count}
              </List.Item>
            )}
          />
        </>
      )}
    </div>
  );
}