import { Tag, Tooltip } from 'antd';
import React from 'react';

interface Props {
  keyText: string;
}

export default function ColumnKey({ keyText }: Props): React.JSX.Element {
  return (
    <Tooltip title={keyText}>
      <Tag color={stringToColor(keyText)}>{shorterKey(keyText)}</Tag>
    </Tooltip>
  );
}

function stringToColor(text: string): string {
  let hash = 0;

  // Cria um hash numérico a partir do texto
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // força a ser int32
  }

  // Converte o hash em cor hexadecimal
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

const shorterKey = (key:string):string => `${key.slice(0,4)}...${key.slice(-4)}`;