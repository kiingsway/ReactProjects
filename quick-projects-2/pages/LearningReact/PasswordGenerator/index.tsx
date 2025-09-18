import LearningNav from '@/components/LearningReact/LearningNav';
import { Checkbox, InputNumber, Slider } from 'antd';
import React from 'react';
import PassInput from './PassInput';

interface IOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}

const initialOptions: IOptions = {
  length: 8,
  upper: true,
  lower: true,
  numbers: true,
  symbols: false,
};

export default function PasswordGenerator(): React.JSX.Element {

  const [settings, setSettings] = React.useState<IOptions>(initialOptions);
  const [pass, setPass] = React.useState(generatePassword(settings));

  const changeManuallyPass = (value: string): void => {
    setPass(value);
  };

  React.useEffect(() => {
    setPass(generatePassword(settings));
  }, [settings]);

  const setLength = (length: number): void => setSettings(prev => ({ ...prev, length }));
  const toggleUpper = (): void => setSettings(prev => ({ ...prev, upper: !prev.upper }));
  const toggleLower = (): void => setSettings(prev => ({ ...prev, lower: !prev.lower }));
  const toggleNumbers = (): void => setSettings(prev => ({ ...prev, numbers: !prev.numbers }));
  const toggleSymbols = (): void => setSettings(prev => ({ ...prev, symbols: !prev.symbols }));

  return (
    <LearningNav name={PasswordGenerator.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20, marginTop: 10, backgroundColor: '#222', borderRadius: 8 }}>

        <PassInput
          value={pass}
          onChange={changeManuallyPass}
          onUpdate={() => setPass(generatePassword(settings))}
        />

        <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>

          <div style={{ maxWidth: 180, backgroundColor: '#444', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', borderRadius: 8, padding: '15px 12px', display: 'flex', flexDirection: 'column' }}>
            <small>Length:</small>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
              <Slider
                style={{ width: 120 }}
                min={4}
                max={50}
                onChange={setLength}
                value={settings.length}
              />
              <InputNumber
                min={4}
                max={50}
                onChange={n => typeof n === 'number' ? setLength(n) : null}
                value={settings.length}
              />
            </div>
          </div>

          <div style={{ maxWidth: 220, backgroundColor: '#444', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px', borderRadius: 8, padding: '15px 12px', display: 'flex', flexDirection: 'column' }}>
            <Checkbox style={{ color: 'white', fontWeight: 500, fontSize: 18 }} checked={settings.upper} onChange={toggleUpper}>Letra maiúscula</Checkbox>
            <Checkbox style={{ color: 'white', fontWeight: 500, fontSize: 18 }} checked={settings.lower} onChange={toggleLower}>Letra minúscula</Checkbox>
            <Checkbox style={{ color: 'white', fontWeight: 500, fontSize: 18 }} checked={settings.numbers} onChange={toggleNumbers}>Números</Checkbox>
            <Checkbox style={{ color: 'white', fontWeight: 500, fontSize: 18 }} checked={settings.symbols} onChange={toggleSymbols}>Símbolos</Checkbox>
          </div>

        </div>

      </div>
    </LearningNav>
  );
}


interface IOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}
const generatePassword = (settings: IOptions): string => {

  const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowers = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%&*()-=_';

  let chars = '';
  if (settings.upper) chars += uppers;
  if (settings.lower) chars += lowers;
  if (settings.numbers) chars += numbers;
  if (settings.symbols) chars += symbols;
  if (!chars) return '';

  let result = '';
  for (let i = 0; i < settings.length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};
