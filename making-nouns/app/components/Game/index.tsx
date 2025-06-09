import { GameSettings } from '@/app/interfaces';
import useGame from '@/app/services/gameState';
import { capitalizeFirstLetter, getShuffledColors } from '@/app/services/helpers';
import { Button, Tag, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React from 'react';

export default function Game({ settings, onQuitGame }: { settings: GameSettings, onQuitGame: () => void }): React.JSX.Element {

  const [verbe, options, gameOver, newGame, checkAnswer] = useGame(settings);
  const initialSelectedValues = Array(options.length).fill("");
  const [selectedValues, setSelectedValues] = React.useState<string[]>(initialSelectedValues);

  const startNewGame = () => {
    setSelectedValues(initialSelectedValues);
    newGame();
  };

  const answersNotFilled: boolean = selectedValues.some(v => v === "");

  const randomColors = React.useMemo(() => {
    return getShuffledColors(settings.conjugaisonTypes.length);
  }, [settings.conjugaisonTypes.length]);

  const onBack = () => {
    const sure = confirm('Are you sure you want to quit the game?');
    if (!sure) return;
    onQuitGame();
  }

  const handleSelectChange = (value: string, index: number) => {
    const updated = [...selectedValues];
    updated[index] = value;
    setSelectedValues(updated);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(startNewGame, []);

  const CheckAnswerButton = () => {
    const onClick = () => checkAnswer(selectedValues);
    return <Button onClick={onClick} disabled={answersNotFilled}>Check answer</Button>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-gray-200 p-4 rounded flex flex-col items-center">

        <div className="flex w-full gap-2">
          <Button className="flex-1 py-2" style={{ fontWeight: 500 }} type='text' onClick={onBack}>Quit Game</Button>
          <Button className="flex-1 py-2" style={{ fontWeight: 500 }} type='text' onClick={startNewGame}>Restart Game</Button>
        </div>

        <div className='mt-4 mb-2'>
          <span className='text-xs font-semibold pr-1'>Categories: </span>
          {settings.conjugaisonTypes.map((type, index) => (
            <Tag key={type} color={randomColors[index]}>{type}</Tag>
          ))}
        </div>

        <div className='mt-4 mb-2'>
          <span className='text-xs font-semibold pr-1'>Verb: </span>
          <span className='text-lg font-semibold'>{verbe?.titre}</span>
        </div>

        <div className='pb-4'>
          {options.map((option, index) => {

            const options: DefaultOptionType[] = option.options.map((value, i) => ({
              key: `${option}-${i}`, label: value, value,
            }));

            const IsCorrect = (): React.JSX.Element => {
              if (option.isCorrect == undefined) return <></>;
              return (
                <div className='pl-4 inline-block'>
                  <span>{option.isCorrect ? "✅" : "❌"} </span>
                  <span className={option.isCorrect ? "text-green-50" : "text-red-50"}>{option.correct}</span>
                </div>
              );
            }

            return (
              <div key={option.pronom}>
                <span style={{ width: 100, display: 'inline-block' }}>{capitalizeFirstLetter(option.pronom)}</span>
                <Select
                  disabled={gameOver}
                  showSearch
                  placeholder="Select a conjugaison"
                  options={options}
                  style={{ width: 120 }}
                  value={selectedValues[index]}
                  onChange={(value) => handleSelectChange(value, index)} />
                <IsCorrect />
              </div>
            )
          })}
        </div>
        <CheckAnswerButton />
      </div>
    </div>
  );
}