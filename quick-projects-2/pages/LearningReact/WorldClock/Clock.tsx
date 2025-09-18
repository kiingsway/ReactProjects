import React, { useEffect, useState } from 'react';
import { IClock } from '.';
import { Tag } from 'antd';
import { DateTime } from 'luxon';

interface Props {
  myClock?: IClock;
  myClockLoading: boolean;
  selectedTimezoneClock?: IClock;
  selectedLoading: boolean;
}

export default function Clock({ myClock, selectedTimezoneClock, myClockLoading, selectedLoading }: Props): React.JSX.Element {
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const [selectedTime, setSelectedTime] = useState<DateTime | null>(null);

  // controla o meu clock
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (myClock?.datetime) {
      const start = DateTime.fromISO(myClock.datetime, { setZone: true });
      setCurrentTime(start);

      const interval = setInterval(() => {
        setCurrentTime(prev => (prev ? prev.plus({ seconds: 1 }) : start.plus({ seconds: 1 })));
      }, 1000);

      return (): void => clearInterval(interval);
    }
  }, [myClock]);

  // controla o clock selecionado
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (selectedTimezoneClock?.datetime) {
      const start = DateTime.fromISO(selectedTimezoneClock.datetime, { setZone: true });
      setSelectedTime(start);

      const interval = setInterval(() => {
        setSelectedTime(prev => (prev ? prev.plus({ seconds: 1 }) : start.plus({ seconds: 1 })));
      }, 1000);

      return (): void => clearInterval(interval);
    }
  }, [selectedTimezoneClock]);

  const MyClock = (): React.JSX.Element => {
    if (myClockLoading) return <small>Clock loading...</small>;
    if (!myClock || !currentTime) return <small>Something went wrong getting my clock...</small>;

    const date = currentTime.setLocale('fr-CA').toLocaleString({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const time = currentTime.toFormat('HH:mm:ss');

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <small>{date}</small>
        <h1>{time}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Tag>Day #{myClock.day_of_year}</Tag>
            <Tag>Week #{myClock.week_number}</Tag>
          </div>
          <div>
            <Tag>UTC: {myClock.utc_offset} ({myClock.abbreviation})</Tag>
            <Tag>Timezone: {myClock.timezone}</Tag>
          </div>
        </div>
      </div>
    );
  };

  const SelectedClock = (): React.JSX.Element => {
    if (selectedLoading) return <small>Selected clock loading...</small>;
    if (!selectedTimezoneClock || !selectedTime) return <></>;

    const date = selectedTime.setLocale('fr-CA').toLocaleString({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const time = selectedTime.toFormat('HH:mm:ss');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
        <small>{date}</small>
        <h1>{time}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'end' }}>
          <div>
            <Tag>Day #{selectedTimezoneClock.day_of_year}</Tag>
            <Tag>Week #{selectedTimezoneClock.week_number}</Tag>
          </div>
          <div>
            <Tag>UTC: {selectedTimezoneClock.utc_offset} ({selectedTimezoneClock.abbreviation})</Tag>
            <Tag>Timezone: {selectedTimezoneClock.timezone}</Tag>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <MyClock />
        <SelectedClock />
      </div>
    </div>
  );
}
