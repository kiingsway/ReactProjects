import { Tag } from 'antd';
import React from 'react';

interface Props {
  value: string | null;
  color: string | null;
}

export default function ColumnSelect({ color, value }: Props): React.JSX.Element {
  if (!value) return <></>;
  return (
    <Tag color={color || 'default'}>{value}</Tag>
  );
}