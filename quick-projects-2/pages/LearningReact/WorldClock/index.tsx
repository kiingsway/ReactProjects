import LearningNav from '@/components/LearningReact/LearningNav';
import { Divider, notification } from 'antd';
import React from 'react';
import axios from 'axios';
import Timezones from './Timezones';
import useSWR from 'swr';

export default function WorldClock(): React.JSX.Element {

  // SWR para buscar timezones
  // Instale o SWR se necessário: npm install swr

  const fetcher = (url: string): Promise<string[]> => axios.get(url).then(res => res.data as string[]);
  const { data: timezones, error: tzError, isLoading: tzLoading } = useSWR<string[]>('https://worldtimeapi.org/api/timezone', fetcher);

  React.useEffect(() => {
    const errors = [tzError].filter(Boolean);
    errors.forEach(error => {
      notification.error({ message: 'Erro ao buscar timezones', description: String(error) });
    });
  }, [tzError]);



  return (
    <LearningNav name={WorldClock.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: 20, marginTop: 10, backgroundColor: '#222', borderRadius: 8 }}>
        <h3>Clock...</h3>
        <Divider style={{ borderColor: '#DDD' }} />
        <Timezones timezones={timezones} loading={tzLoading} />
      </div>
    </LearningNav>
  );
}