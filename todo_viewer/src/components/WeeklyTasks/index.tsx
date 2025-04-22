import classNames from 'classnames';
import { DateTime } from 'luxon';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle, MDBCheckbox, MDBCol, MDBContainer, MDBListGroup, MDBListGroupItem, MDBRow } from 'mdb-react-ui-kit'
import React, { useEffect } from 'react'
import { ITarefa } from '../../interfaces'
import styles from './WeeklyTasks.module.scss'
import { BsCircle, BsBell, BsBellSlash } from 'react-icons/bs';
import { AiOutlineCheckCircle } from 'react-icons/ai';

const range = (min: number, max: number) => {
  let array = [];
  for (let i = min; i <= max; i++) array.push(i);
  return array
}

interface Props {
  tasks: ITarefa[]
}

export default function WeeklyTasks(props: Props) {
  const dataDiaMes = (data: DateTime) => DateTime.now().hasSame(data, 'month') ? data.toFormat('dd') : data.toFormat('dd/LL')
  useEffect(() => console.log(props.tasks), [])

  return (
    <MDBContainer>
      <MDBRow className='mt-1'>
        {range(-5, 6).map(dayCard => {
          const dataAtual = DateTime.local({ locale: 'pt-BR' }).plus({ days: dayCard })
          const isToday = DateTime.now().hasSame(dataAtual, 'day')


          const conclusao = props.tasks.filter(t => Boolean(t.dueDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.dueDateTime.dateTime), 'day'));
          const lembretes = props.tasks.filter(t => Boolean(t.reminderDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.reminderDateTime.dateTime), 'day'));
          const concluidos = props.tasks.filter(t => Boolean(t.completedDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.completedDateTime.dateTime), 'day'));
          const criados = props.tasks.filter(t => Boolean(t.createdDateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.createdDateTime), 'day'));
          const modificados = props.tasks.filter(t => Boolean(t.lastModifiedDateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.lastModifiedDateTime), 'day'));
          const lembretesSemConclusao = lembretes.filter(t => !conclusao.map(t => t.id).includes(t.id))

          return (
            <MDBCol key={dayCard} size={12} sm={6} lg={3} className='p-0 m-0'>
              <div className="p-1 h-100">

                <MDBCard key={dayCard} className='text-light h-100' background='dark' border={isToday ? 'light' : ''}>
                  <MDBCardHeader>{dataAtual.toFormat('cccc')}, {dataDiaMes(dataAtual)}</MDBCardHeader>
                  <MDBCardBody className='p-2'>

                    <MDBCard>
                      <MDBListGroup className={`bg-dark ${styles.list_group}`} >
                        {conclusao.map(t => {
                          const isCompleted = t.completedDateTime?.dateTime;
                          return (
                            <MDBListGroupItem key={t.id} className={`p-2 text-light ${styles.listGroupItem}`}>
                              <div className={classNames('d-flex flex-nowrap align-items-center', { 'text-decoration-line-through': isCompleted })}>
                                <div className='me-2' style={{ width: '20px' }}>
                                  {isCompleted ?
                                    <AiOutlineCheckCircle className='text-success' width={16} /> :
                                    <BsCircle className='text-light' width={16} />}
                                </div>
                                <span>{t.title}</span>
                              </div>
                            </MDBListGroupItem>
                          )
                        })}
                        {lembretesSemConclusao.map(t => {
                          const isCompleted = t.completedDateTime?.dateTime;
                          const reminder = DateTime.fromISO(t.reminderDateTime?.dateTime)
                          const hadRemided = reminder < DateTime.now()
                          return (
                            <MDBListGroupItem key={t.id} className={`p-2 text-light ${styles.listGroupItem}`}>
                              <div className={classNames('d-flex flex-nowrap align-items-center', { 'text-decoration-line-through': isCompleted })}>
                                <div className='me-1' style={{ width: '30px' }}>
                                  {isCompleted ?
                                    <AiOutlineCheckCircle className='text-success' width={16} /> :
                                    <BsCircle className='text-light' width={16} />}
                                </div>
                                <div className='me-1' style={{ width: '30px' }} title={reminder.toFormat('dd/LL/yyyy HH:mm')}>
                                  {hadRemided ?
                                    <BsBellSlash className='text-light' width={16} /> :
                                    <BsBell className='text-success' width={16} />}
                                </div>
                                <span>{t.title}</span>
                              </div>
                            </MDBListGroupItem>
                          )
                        })}
                      </MDBListGroup>
                    </MDBCard>
                  </MDBCardBody>
                </MDBCard>
              </div>
            </MDBCol>
          )
        })}

      </MDBRow>

    </MDBContainer>
  )
}
