import { rawText } from '@/services/scripts/rawText';
import { Button, Input } from 'antd';
import React from 'react';

interface Props {
  timezones?: string[];
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick: (tz: string) => void;
  selectedTimezone: string | null
}

export default function Timezones({ timezones, loading, onClick, selectedTimezone }: Props): React.JSX.Element {

  const [search, setSearch] = React.useState('');

  const gridStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px', // espaçamento horizontal e vertical
    maxHeight: '300px',
    overflowY: 'auto',
    padding: '8px',
  };

  const filteredTimeZones = React.useMemo(() => {
    if (!search) return timezones;
    return (timezones || []).filter(t => rawText(t).includes(rawText(search)));
  }, [search, timezones]);

  const Main = (): React.JSX.Element => {
    if (loading) return <span style={gridStyle}>Loading timezones...</span>;
    if (!timezones || !filteredTimeZones) return <span style={gridStyle}>Timezones unloaded</span>;
    if (!timezones.length) return <span style={gridStyle}>No timezones</span>;

    return (
      <div style={gridStyle}>
        {filteredTimeZones.map(tz => (
          <TimezoneButton
            checked={selectedTimezone === tz}
            key={tz}
            tz={tz}
            onClick={() => onClick(tz)} />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3>Timezones:</h3>
      <Input
        allowClear
        disabled={loading || !timezones || !timezones.length}
        size='small'
        placeholder='Search timezones...'
        value={search}
        onChange={e => setSearch(e.target.value)} />
      <Main />
    </div>
  );
}

const TimezoneButton = ({ tz, checked, onClick }: { tz: string, checked: boolean, onClick: () => void }): React.JSX.Element => {

  const tagStyle: React.CSSProperties = {
    fontWeight: 500,
  };

  return (
    <Button
      type={checked ? 'primary' : 'default'}
      onClick={onClick}
      style={tagStyle}
      size='small'>
      {tz}
    </Button>
  );
};