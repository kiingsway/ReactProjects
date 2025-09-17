import React from 'react';
import { Table, Button, message, Typography, Input, Divider } from 'antd';
import { IConvertExpenseRule } from '@/interfaces';
import { ColumnsType } from 'antd/es/table';
import { rawText, sorter } from '@/services/helpers';
import { getCatRealName } from '../matches-editor/MatchesTableData';

const { TextArea } = Input;
const { Title } = Typography;

interface Props {
  jsonString: string;
  setJsonString: (jsonString: string) => void;
}

export default function ConvertExpenseTable({ jsonString, setJsonString }: Props): React.JSX.Element {

  const [data, setData] = React.useState<IConvertExpenseRule[]>([]);
  const [search, setSearch] = React.useState('');

  const filteredData = React.useMemo(() => {
    if (!search.trim()) return data;
    const s = rawText(search);
    return data.filter(item =>
      item.match.toLowerCase().includes(s) ||
      (item.Title && rawText(item.Title).includes(s)) ||
      rawText(getCatRealName(item)).includes(s)
    );
  }, [data, search]);

  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setData(parsed);
        message.success('JSON carregado com sucesso!');
      } else {
        throw new Error();
      }
    } catch {
      message.error('JSON inválido!');
    }
  };



  const columns: ColumnsType<IConvertExpenseRule> = [
    {
      title: 'Match', dataIndex: 'match', key: 'match',
      sorter: (a, b) => sorter.alphabetically(a.match, b.match),
      render: text => (
        <Button size='small' type="link" onClick={() => copyToClipboard(text)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'Title',
      key: 'Title',
      sorter: (a, b) => sorter.alphabetically(a.Title, b.Title),
      render: (text?: string) =>
        text ? (
          <Button size='small' type="link" onClick={() => copyToClipboard(text)}>
            {text}
          </Button>
        ) : null,
    },
    {
      title: 'Category',
      dataIndex: 'Category',
      key: 'Category',
      sorter: (a, b) => sorter.alphabetically(a.Category, b.Category),
    },
    {
      title: 'Subcategory',
      dataIndex: 'Subcategory',
      key: 'Subcategory',
      sorter: (a, b) => sorter.alphabetically(a.Subcategory, b.Subcategory),
    },
  ];

  return (

    <div style={{ display: 'flex', flexDirection: "column", gap: 16 }}>
      <Title level={4}>Cole seu JSON</Title>
      <TextArea
        rows={8}
        value={jsonString}
        onChange={(e) => setJsonString(e.target.value)}
        placeholder='Cole aqui um array JSON de regras'
      />
      <Button type="primary" onClick={handleParse} style={{ marginTop: 8 }}>
        Carregar na tabela
      </Button>

      <Divider />

      {data.length > 0 && (
        <div style={{}}>
          <Input placeholder='Search...' value={search} onChange={e => setSearch(e.target.value)} />
          <Title level={5} >Regras encontradas</Title>
          <Table
            size='small'
            dataSource={filteredData}
            columns={columns}
            rowKey="match"
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
}

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
    .then(() => message.success('Copiado!'))
    .catch(() => message.error('Erro ao copiar'));
};