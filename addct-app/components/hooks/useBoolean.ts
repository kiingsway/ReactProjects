import { useState } from 'react';

type TUseBoolean = readonly [
  boolean,
  {
    readonly setTrue: () => void;
    readonly setFalse: () => void;
    readonly set: (_: boolean) => void;
    readonly toggle: () => void;
  }
];

export default function useBoolean(initialValue = false): TUseBoolean {

  const [bool, setBool] = useState(initialValue);

  const setTrue = (): void => setBool(true);
  const setFalse = (): void => setBool(false);
  const set = (bool: boolean): void => setBool(bool);
  const toggle = (): void => setBool(prev => !prev);

  return [bool, { setTrue, setFalse, set, toggle }] as const;

}