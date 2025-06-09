import { ConjugaisonTypes } from '@/app/data/verbes';
import { TSettingsState } from '@/app/interfaces';
import { Button, Collapse, CollapseProps, Transfer, TransferProps } from 'antd';
import React from 'react';


export default function NewGame({ settingsState, onStartGame }: { settingsState: TSettingsState, onStartGame: () => void }): React.JSX.Element {

  const [settings, setSettings] = settingsState;

  const Settings = (): React.JSX.Element => {

    const onChange: TransferProps['onChange'] = (nextTargetKeys) => {
      setSettings(prev => ({ ...prev, conjugaisonTypes: nextTargetKeys as string[] }));
    };

    const dataSource = Object.values(ConjugaisonTypes).map(title => ({ key: title, title }));

    return (
      <div>
        <p className='text-base font-semibold mb-2'>Conjugasion Types:</p>
        <Transfer
          dataSource={dataSource}
          titles={['Hide', 'In-Game']}
          targetKeys={settings.conjugaisonTypes}
          onChange={onChange}
          render={item => item.title}
        />
      </div>
    );
  }

  const items: CollapseProps['items'] = [
    {
      key: 'settings',
      label: `Settings ${settings.conjugaisonTypes.length > 0 ? `(${settings.conjugaisonTypes.length} conjugaison types)` : ''}`,
      children: <Settings />,
    }
  ];

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-200 p-4 rounded flex flex-col items-center">
        <h1 className="text-2xl font-bold pb-2">Making Nouns - Translate Game</h1>
        <Collapse items={items} bordered={false} />
        <Button onClick={onStartGame} disabled={settings.conjugaisonTypes.length < 1}>Start Game</Button>
      </div>
    </div>
  );
}