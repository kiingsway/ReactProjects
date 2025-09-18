import LearningNav from '@/components/LearningReact/LearningNav';
import { Divider, notification } from 'antd';
import React from 'react';
import axios from 'axios';
import Timezones from './Timezones';
import useSWR from 'swr';
import Clock from './Clock';
import { noRefetcher } from '@/services/helpers';

const keys = {
  ip: 'ip',
  tz: 'https://worldtimeapi.org/api/timezone',
  myClock: 'http://worldtimeapi.org/api/ip/',
  sltz: 'https://worldtimeapi.org/api/timezone/',
};

async function fetcher<T>(url: string): Promise<T> { return (await axios.get(url)).data; }

export default function WorldClock(): React.JSX.Element {

  const [selectedTz, selectTz] = React.useState<string | null>(null);

  const { data: myIp, error: ipError } = useSWR<string>(keys.ip, getIP, noRefetcher);
  const { data: timezones, error: tzError, isLoading: tzLoading } = useSWR<string[]>(keys.tz, fetcher<string[]>, noRefetcher);
  const { data: myClock, error: myClockError, isLoading: isMyClockLoading } = useSWR<IClock>(myIp ? `${keys.myClock}${myIp}` : null, fetcher, noRefetcher);
  const { data: tzData, error: sltzError, isLoading: tzDataLoading } = useSWR<IClock>(selectedTz ? `${keys.sltz}${selectedTz}` : null, fetcher, noRefetcher);

  React.useEffect(() => {
    const errors = [tzError, ipError, myClockError, sltzError].filter(Boolean);
    errors.forEach(error => {
      notification.error({ message: 'Erro ao buscar timezones', description: String(error) });
    });
  }, [tzError, ipError, myClockError, sltzError]);

  return (
    <LearningNav name={WorldClock.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20, marginTop: 10, backgroundColor: '#222', borderRadius: 8 }}>
        <Clock
          myClockLoading={isMyClockLoading}
          selectedLoading={tzDataLoading}
          myClock={myClock}
          selectedTimezoneClock={tzData} />
        <Divider style={{ borderColor: '#DDD' }} />
        <Timezones
          selectedTimezone={selectedTz}
          timezones={timezones}
          loading={tzLoading}
          onClick={tz => selectTz(tz)} />
      </div>
    </LearningNav>
  );
}

export interface IClock {
  utc_offset: string
  timezone: string
  day_of_week: number
  day_of_year: number
  datetime: string
  utc_datetime: string
  unixtime: number
  raw_offset: number
  week_number: number
  dst: boolean
  abbreviation: string
  dst_offset: number
  dst_from: string
  dst_until: string
  client_ip: string
}

const getIP = async (): Promise<string> => {
  interface IPResp { ip: string };
  return (await axios.get<IPResp>('https://api.ipify.org?format=json')).data.ip;
};