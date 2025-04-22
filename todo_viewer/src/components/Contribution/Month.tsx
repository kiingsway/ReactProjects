import React from 'react'
import styles from './Contribution.module.scss'

interface Props {
  index: any
startDate: any
showedMonths: any
}

export default function Month(props:Props) {
  

  let date = props.startDate.plus({ days: props.index * 7 });
  let monthName = date.toFormat('MMM');

  if (props.showedMonths[0] !== monthName) props.showedMonths.shift()

  if (props.showedMonths.includes(monthName)) {

    return (
      <div className={`${styles.timeline_months_month} ${monthName}`} />
    )
  } else {

    props.showedMonths.push(monthName)

    return (
      <div className={`${styles.timeline_months_month} ${monthName}`}>
        {monthName}
      </div>
    )
  }

}
