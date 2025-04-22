import React from 'react'
import styles from './Contribution.module.scss'

interface Props {
  date: any;
  color: any;
  value: any;
}

export default function Cell(props: Props) {

  let style = {
    backgroundColor: props.color
  };

  let poptext = `${props.value === 0 ? 'No contributions' : props.value + ` contribution${props.value >1 ? 's' : ''}`} on ${props.date.toFormat('DD')}`

  return (
    <div
      className={styles.timeline_cells_cell}
      style={style}
      title={poptext}
    />
  )
}
