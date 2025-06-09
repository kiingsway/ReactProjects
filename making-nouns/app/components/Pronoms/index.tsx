import useGame from '@/app/services/gameState';
import { capitalizeFirstLetter } from '@/app/services/helpers';
import { Button, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React from 'react';

export default function Pronoms(): React.JSX.Element {

  const [verbe, options, gameOver, newGame, checkAnswer] = useGame();
  const initialSelectedValues = Array(options.length).fill("");
  const [selectedValues, setSelectedValues] = React.useState<string[]>(initialSelectedValues);

  const answersNotFilled: boolean = selectedValues.some(v => v === "");

  const handleSelectChange = (value: string, index: number) => {
    const updated = [...selectedValues];
    updated[index] = value;
    setSelectedValues(updated);
  };

  const NewGameButton = () => {
    const onClick = () => { newGame(); setSelectedValues(initialSelectedValues); };
    return <Button onClick={onClick}>{gameOver ? "New Game" : "Restart Game"}</Button>;
  };

  const CheckAnswerButton = () => {
    if (gameOver) return <NewGameButton />;
    if (gameOver || selectedValues.length < 1) return <></>;
    const onClick = () => checkAnswer(selectedValues);
    return <Button onClick={onClick} disabled={answersNotFilled}>Check answer</Button>;
  }

  return (
    <div className='p-4'>
      <div>
        <NewGameButton />
      </div>
      <div>
        {gameOver ? <></> :
          <div className='pb-4'>
            <span className='opacity-75'>Guess the verbe: </span>
            <span>{verbe!.titre}</span>
          </div>
        }
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

