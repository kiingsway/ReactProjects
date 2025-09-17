import { IConvertExpenseRule } from '@/interfaces';
import { IConversionCategory } from '@/pages/matches-editor';
import { rawText, sorter } from '@/services/helpers';
import { Button, Input, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React from 'react';
import CategoriesFilterWall from './CategoriesFilterWall';
import CategoriesPossibleWall from './CategoriesPossibleWall';

interface Props {
  onMatchSelect: (match?: IConvertExpenseRule) => void;
  dataSource: IConvertExpenseRule[];
  possibleCategories: IConversionCategory[]
}

export default function MatchesTableData({ onMatchSelect, dataSource, possibleCategories }: Props): React.JSX.Element {

  const [search, setSearch] = React.useState("");
  const [selectedCategories, selectCategories] = React.useState<string[]>([]);

  const filteredData = React.useMemo(() => {
    const s = rawText(search);

    return dataSource.filter(m => {
      const matchesSearch =
        rawText(m.match).includes(s) ||
        rawText(m.Title).includes(s) ||
        rawText(m.Category + ":" + m.Subcategory).includes(s);

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(getCatRealName(m));

      return matchesSearch && matchesCategory;
    });
  }, [search, dataSource, selectedCategories]);

  const columns: ColumnsType<IConvertExpenseRule> = [
    {
      key: "match", dataIndex: "match", title: "Match",
      sorter: (a, b) => sorter.alphabetically(a.match, b.match),
      render: (_, m) => <Button onClick={() => onMatchSelect(m)}>{_}</Button>
    },
    {
      key: "title", dataIndex: "Title", title: "Title",
      sorter: (a, b) => sorter.alphabetically(a.Title, b.Title)
    },
    {
      key: "category", dataIndex: "Category", title: "Category",
      sorter: (a, b) => sorter.alphabetically(a.Category, b.Category)
    },
    {
      key: "subcategory", dataIndex: "Subcategory", title: "Subcategory",
      sorter: (a, b) => sorter.alphabetically(a.Subcategory, b.Subcategory)
    },
  ];

  return (
    <>
      <Input
        allowClear
        placeholder='Search...'
        value={search}
        onChange={e => setSearch(e.target.value)} />
      <CategoriesPossibleWall
        possibleCategories={possibleCategories}
        selectedCategories={selectedCategories}
        selectCategories={selectCategories}
      />
      <CategoriesFilterWall
        dataSource={dataSource}
        possibleCategories={possibleCategories}
        selectedCategories={selectedCategories}
        selectCategories={selectCategories}
      />
      <Table
        size='small'
        columns={columns}
        dataSource={filteredData}
        scroll={{ y: 500 }}
        style={{ height: '100%' }}
        pagination={{
          hideOnSinglePage: true,
          defaultPageSize: 100,
          pageSizeOptions: [100, 200]
        }}
      />
    </>
  );
}

export function getCatRealName(match: IConversionCategory) {
  return [match.Category, match.Subcategory].filter(Boolean).join(":");
}