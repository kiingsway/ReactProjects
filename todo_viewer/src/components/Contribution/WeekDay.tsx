import React from 'react'
import styles from './Contribution.module.scss'

interface Props {
  index: any
  startDate: any
}

const DayNames: any = {
  1: 'Seg',
  3: 'Qua',
  5: 'Sex'
}

export default function WeekDay(props: Props) {
  return (

    <div className={styles.timeline_weekdays_weekday}>
      {DayNames[props.index]}
    </div>
  )
}
