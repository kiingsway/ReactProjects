import { Button, Input, Tooltip } from 'antd';
import React from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { RxUpdate } from 'react-icons/rx';

interface Props {
  value: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void;
  onUpdate: () => void;
}

export default function PassInput({ onChange, onUpdate, value }: Props): React.JSX.Element {

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
      <Input value={value} onChange={e => onChange(e.target.value)} />
      <Tooltip title='Update'>
        <Button icon={<RxUpdate />} onClick={onUpdate} />
      </Tooltip>
      <Tooltip title='Copy'>
        <Button icon={<FaRegCopy />} onClick={() => copyToClipboard(value)} />
      </Tooltip>
    </div>
  );
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error('Erro ao copiar para a área de transferência:', err);
  }
}