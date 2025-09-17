import React from 'react';
import { Tag } from 'antd';

interface Props {
  categories: string[];
}

export default function TagWall({ categories }: Props): React.JSX.Element {

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-100 rounded-lg">
      {categories.map(c => <Tag key={c}>{c}</Tag>)}
    </div>
  );
}