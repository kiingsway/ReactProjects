import LearningNav from '@/components/LearningReact/LearningNav';
import { Button, InputNumber, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import axios from 'axios';
import React from 'react';
import { HiMiniArrowsUpDown } from 'react-icons/hi2';
import useSWR from 'swr';

export default function CurrencyConverter(): React.JSX.Element {

  const [fromCurrency, setFromCurrency] = React.useState('usd');
  const [toCurrency, setToCurrency] = React.useState('cad');
  const [cFromValue, setCFromValue] = React.useState(1000);

  const { data: currencies } = useSWR('currencies', getCurrencies);
  const { data: currencyRate } = useSWR(fromCurrency, getCurrencyRate);

  const rate = currencyRate?.[fromCurrency][toCurrency] || 1;

  const swapCurrencies = (): void => {
    if (fromCurrency === toCurrency) return;
    const [from, to] = [fromCurrency, toCurrency];
    setFromCurrency(to);
    setToCurrency(from);
  };

  const currenciesOptions: DefaultOptionType[] = (currencies || []).map(({ key, title }) => ({
    value: key,
    label: !title || key.toUpperCase() === title ? key.toUpperCase() : `${title} (${key.toUpperCase()})`
  }));

  return (
    <LearningNav name={CurrencyConverter.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20, marginTop: 10, backgroundColor: '#222', borderRadius: 8, alignItems: 'center' }}>
        <small>1 {fromCurrency.toUpperCase()} = {rate.toFixed(3)} {toCurrency.toUpperCase()}</small>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <InputNumber
            min={0}
            formatter={inputNumberFormater}
            parser={value => !value ? 0 : Number(value.replace(/,/g, ''))}
            style={{ width: 300 }}
            prefix="$"
            name="cFromInput"
            value={cFromValue}
            onChange={e => setCFromValue(e || 0)} />
          <Select
            value={fromCurrency}
            onChange={setFromCurrency}
            options={currenciesOptions}
            disabled={!currencies || !currencies.length}
            style={{ width: 300 }}
            showSearch
          />
        </div>

        <Button onClick={swapCurrencies} icon={<HiMiniArrowsUpDown />} />

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <InputNumber
            min={0}
            formatter={inputNumberFormater}
            parser={value => !value ? 0 : Number(value.replace(/,/g, ''))}
            style={{ width: 300 }}
            prefix="$"
            name="cToInput"
            value={cFromValue * rate}
            onChange={e => setCFromValue((e || 0) / rate)} />

          <Select
            value={toCurrency}
            onChange={setToCurrency}
            options={currenciesOptions}
            disabled={!currencies || !currencies.length}
            style={{ width: 300 }}
            showSearch
          />
        </div>

      </div>
    </LearningNav>
  );
}

const inputNumberFormater = (n: number | undefined): string => {
  if (n === undefined || n === null) return '';
  const [integer, decimal] = Number(n).toFixed(2).split('.');
  const intWithSep = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (decimal === '00') return intWithSep;
  return `${intWithSep}.${decimal}`;
};

interface ICurrency {
  key: string;
  title: string;
}

const getCurrencies = async (): Promise<ICurrency[]> => {

  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json';
  const currenciesData = await (await axios.get(url)).data;

  const currencies: ICurrency[] = Object.entries(currenciesData)
    .map(([key, title]) => ({ key, title: String(title) }));

  return currencies;
};

type ICurrencyRate = {
  date: string;
} & {
  [key: string]: {
    [key: string]: number;
  };
};

const getCurrencyRate = async (currency: string): Promise<ICurrencyRate> => {
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.min.json`;
  const rate = (await axios.get<ICurrencyRate>(url)).data;
  console.log('rate', rate);
  return rate;
};