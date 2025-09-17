import { Tag } from 'antd';
import React from 'react';

interface Props {
  timezones?: string[];
  loading: boolean;
}

export default function Timezones({ timezones, loading }: Props): React.JSX.Element {

  const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px', // espaçamento horizontal e vertical
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '8px',
  };

  const tagStyle: React.CSSProperties = {
    fontWeight: 500
  };

  const Main = (): React.JSX.Element => {
    if (loading) return <span>Loading timezones...</span>;
    if (!timezones) return <span>Timezones unloaded</span>;
    if (!timezones.length) return <span>No timezones</span>;
    return (
      <div style={gridStyle}>
        {timezones.map(tz => <Tag style={tagStyle} color='black' key={tz}>{tz}</Tag>)}
      </div>
    );
  };

  return (
    <div>
      <h3>Timezones:</h3>
      <Main />
    </div>
  );
}