import LearningNav from '@/components/LearningReact/LearningNav';
import { Button, InputNumber } from 'antd';
import React from 'react';
import styles from './Counter.module.scss';

const storageKey = 'learningCounter';

export default function Counter(): React.JSX.Element {

  const [counter, setCounter] = React.useState(0);
  const increment = (): void => setCounter(prev => prev + 1);
  const decrement = (): void => setCounter(prev => prev - 1);
  const reset = (): void => setCounter(0);

  React.useEffect(() => {
    const storedCounter = localStorage.getItem(storageKey);
    if (storedCounter) setCounter(parseInt(storedCounter));
  }, []);

  React.useEffect(() => {
    localStorage.setItem(storageKey, String(counter));
  }, [counter]);

  return (
    <LearningNav name={Counter.name}>
      <div className={styles.main}>
        <Button onClick={decrement}>-</Button>
        <InputNumber value={counter} onChange={n => setCounter(n || 0)} />
        <Button onClick={increment}>+</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </LearningNav>
  );
}