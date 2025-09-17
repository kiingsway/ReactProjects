import { IConversionCategory } from '@/pages/matches-editor';
import { Button } from 'antd';
import React from 'react';
import { getCatRealName } from './MatchesTableData';

interface Props {
  possibleCategories: IConversionCategory[];
  selectCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
}

export default function CategoriesPossibleWall(props: Props): React.JSX.Element {

  const {
    possibleCategories,
    selectCategories,
    selectedCategories
  } = props;

  const toggleCategory = (category: string) => {
    selectCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category) // Remove
        : [...prev, category]              // Adiciona
    );
  };

  const CatToggleBtn = ({ category }: { category: string }) => {

    return (
      <Button
        key={category}
        size='small'
        type={selectedCategories.includes(category) ? 'primary' : 'default'}
        onClick={() => toggleCategory(category)}
        style={{ margin: 0 }}>
        {category}
      </Button>
    );

  };

  if (possibleCategories.length <= 0) return <></>;
  return (
    <div className='p-4 bg-gray-50 rounded-lg flex flex-wrap gap-3'>
      {possibleCategories.map(ct => <CatToggleBtn key={getCatRealName(ct)} category={getCatRealName(ct)} />)}
      {possibleCategories.length > 0 && selectedCategories.length > 0 && (
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