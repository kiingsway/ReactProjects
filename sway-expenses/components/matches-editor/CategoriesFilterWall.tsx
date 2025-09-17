import React from 'react';
import { getCatRealName } from './MatchesTableData';
import { Button, Tooltip } from 'antd';
import { IConvertExpenseRule } from '@/interfaces';
import { IConversionCategory } from '@/pages/matches-editor';

interface Props {
  dataSource: IConvertExpenseRule[]
  possibleCategories: IConversionCategory[];
  selectCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
}

export default function CategoriesFilterWall(props: Props): React.JSX.Element {

  const {
    possibleCategories,
    selectCategories,
    dataSource,
    selectedCategories
  } = props;

  const categories = [...new Set(dataSource.map(d => getCatRealName(d)))].sort();

  const toggleCategory = (category: string) => {
    selectCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category) // Remove
        : [...prev, category]              // Adiciona
    );
  };

  const CatToggleBtn = ({ category }: { category: string }) => {

    const categoryExists = (() => {
      if (!possibleCategories.length) return true;
      else return possibleCategories.some(c => getCatRealName(c).includes(category));
    })();

    const Btn = (): React.JSX.Element => (
      <Button
        danger={!categoryExists}
        key={category}
        size='small'
        type={selectedCategories.includes(category) ? 'primary' : 'default'}
        onClick={() => toggleCategory(category)}
        style={{ margin: 0 }}>
        {category}
      </Button>
    );

    if (!categoryExists) return <Tooltip title="Categoria não existe na definição CSV"><Btn /></Tooltip>
    return <Btn />
  };

  if (categories.length <= 0) return <></>;
  return (
    <div className='p-4 bg-gray-50 rounded-lg flex flex-wrap gap-3'>
      {categories.map(ct => <CatToggleBtn key={ct} category={ct} />)}
      {categories.length > 0 && selectedCategories.length > 0 && (
        <Button
          size="small"
          type="text"
          danger
          onClick={() => selectCategories([])}
          style={{ margin: 0 }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}