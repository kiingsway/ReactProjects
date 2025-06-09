import React from 'react';
import verbesData, { ConjugaisonTypes, getConjugasions } from '../data/verbes';
import { getRandomIndexes, shuffleArray } from './helpers';
import pronoms from '../data/pronoms';
import { GameSettings, IVerbe, IVerbeAvecConjugaison } from '../interfaces';

export default function useGame(settings: GameSettings) {

  const [verbe, setVerbe] = React.useState<IVerbe>();
  const [options, setOptions] = React.useState<IAnswerOption[]>([]);
  const [gameOver, setGameOver] = React.useState<boolean>(false);

  const newGame = (): void => {
    setGameOver(false);

    const filteredVerbes = (() => {
      if (Object.values(ConjugaisonTypes).length == settings.conjugaisonTypes.length) return verbesData;
      return verbesData.filter(verbe => {
        if (verbe.conjugaisonType) return settings.conjugaisonTypes.includes(verbe.conjugaisonType);
        return settings.conjugaisonTypes.includes(ConjugaisonTypes.IRREGULIERS);
      });
    })();

    const randomVerb = filteredVerbes[Math.floor(Math.random() * filteredVerbes.length)];

    const verbe = {
      ...randomVerb,
      conjugaison: getConjugasions(randomVerb),
      remove_letters: undefined,
      conjugaisonType: undefined,
    };

    setVerbe(verbe);
    setOptions(getAnswerOptions(verbe));
  };

  const checkAnswer = (answers: string[]): void => {
    if (!verbe || !options || answers.length < 1) return;
    setOptions(options.map((option, index) => ({ ...option, isCorrect: option.correct === answers[index] })));
    setGameOver(true);
  };

  return [verbe, options, gameOver, newGame, checkAnswer] as const;
}

interface IAnswerOption {
  pronom: string;
  correct: string;
  options: string[];
  isCorrect?: boolean;
}

function getAnswerOptions(verbe: IVerbeAvecConjugaison): IAnswerOption[] {
  const randomIndexes: number[] = getRandomIndexes(pronoms.length);

  return randomIndexes.map((randomIndex) => {
    const pronom = pronoms[randomIndex];
    const correct = verbe.conjugaison[randomIndex];

    // Embaralha todas as conjugaisons, exceto a correta
    const shuffledConj = getRandomIndexes(verbe.conjugaison.length)
      .map(i => verbe.conjugaison[i])
      .filter((value, i, self) => value !== correct && self.indexOf(value) === i);

    // Junta com a correta e embaralha de novo
    const options = shuffleArray([correct, ...shuffledConj]);

    return { pronom, correct, options };
  });
}
