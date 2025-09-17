import { Input, Tooltip } from 'antd';
import { DateTime } from 'luxon';
import React from 'react';

interface Props {
  value: string | null;
  as: 'text' | 'input';
}

export default function ColumnDate({ value, as }: Props): React.JSX.Element {

  if (!value) return <></>;

  const dateHasTime = ((): boolean => {
    const timeRegex = /\b([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?\b/;
    return timeRegex.test(value);
  })();

  const time = {
    hm: dateHasTime ? 'HH:mm' : '',
    hms: dateHasTime ? 'HH:mm:ss' : '',
  };

  const date = DateTime.fromISO(value || '');
  const tooltip = date.isValid ? date.toFormat(`dd/LL/yyyy ${time.hms}`) : String(value) || '(no value)';

  const DateText = (): React.JSX.Element => {
    const value = date.isValid ? date.toFormat(`LLLL dd, yyyy ${time.hm}`) : 'Invalid Date';

    if (as === 'input') return <Input value={value} />;
    return <span>{value}</span>;
  };

  return (
    <Tooltip title={tooltip}>
      <DateText />
    </Tooltip>
  );
}