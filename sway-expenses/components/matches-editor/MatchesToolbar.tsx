import { IConvertExpenseRule } from '@/interfaces';
import { Button } from 'antd';
import { DateTime } from 'luxon';
import React from 'react';

interface Props {
  matches: IConvertExpenseRule[];
  onNewMatch: () => void;
  onCategoriesCSV: () => void;
}

export default function MatchesToolbar({ matches, onNewMatch, onCategoriesCSV }: Props): React.JSX.Element {

  function downloadMatchesAsJson() {
    const json = JSON.stringify(matches, null, 2); // bonito e indentado
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `matches-${DateTime.now().toISO()}`;
    a.click();

    URL.revokeObjectURL(url); // libera o recurso
  }

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='flex items-center justify-start gap-4'>
        <Button onClick={onNewMatch}>Create Match</Button>
        <Button onClick={onCategoriesCSV}>Categories CSV</Button>
      </div>
      <div className='flex items-center justify-end'>
        <Button onClick={downloadMatchesAsJson} type='primary'>Export JSON</Button>
      </div>
    </div>
  );
}