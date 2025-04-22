import { MDBCardGroup, MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardFooter, MDBContainer, MDBRow, MDBCol, MDBCardHeader, MDBSwitch } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import { DateTime } from 'luxon';
import classNames from 'classnames';
import { v4 as guid } from 'uuid'

const range = (min: number, max: number) => {
  let array = [];
  for (let i = min; i <= max; i++) array.push(i);
  return array
}

const tiposDatasDefault = {
  conclusao: { title: 'Conclusão', show: true },
  lembretes: { title: 'Lembretes', show: true },
  concluidos: { title: 'Concluídos', show: true },
  criados: { title: 'Criados', show: false },
  modificados: { title: 'Modificados', show: false },
}

const diasTrasFrente = 5;
interface Props {
  tarefas: any[]
}

export default function Weekly(props: Props) {
  const [tiposDatas, setTiposDatas] = useState(tiposDatasDefault);

  const colsProps = Object.entries(tiposDatas).map(t => t[0]);

  const handleHideShowColumn = (e: any) => {
    const col = e.target.id as keyof typeof tiposDatas;
    const name = e.target.name;
    const show = e.target.checked;

  }

  return (
    <MDBContainer fluid className='d-none'>
      <MDBRow className='align-items-cente justify-content-between'>

        <h5 className='text-light'>Mostrar:</h5>

        <MDBRow className='px-3'>
          {colsProps.map(tipo => {
            const tipoData = tiposDatas[tipo as keyof typeof tiposDatas];
            return (
              <MDBCol size={12} xxl={2} key={tipoData.title}>
                <div className='text-light'>
                  <MDBSwitch
                    id={tipo}
                    name={tipoData.title}
                    label={tipoData.title}
                    onChange={handleHideShowColumn}
                    checked={tipoData.show}
                  />
                </div>
              </MDBCol>
            )
          })}
        </MDBRow>

        {range(-diasTrasFrente, diasTrasFrente).map(dayCard => {

          const dataAtual = DateTime.local({ locale: 'pt-BR' }).plus({ days: dayCard })
          const dataDiaMes = (data: DateTime) => DateTime.now().hasSame(data, 'month') ? data.toFormat('dd') : data.toFormat('dd/LL')
          const isToday = DateTime.now().hasSame(dataAtual, 'day')

          const conclusao = props.tarefas.filter(t => Boolean(t.dueDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.dueDateTime.dateTime), 'day'));
          const lembretes = props.tarefas.filter(t => Boolean(t.reminderDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.reminderDateTime.dateTime), 'day'));
          const concluidos = props.tarefas.filter(t => Boolean(t.completedDateTime?.dateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.completedDateTime.dateTime), 'day'));
          const criados = props.tarefas.filter(t => Boolean(t.createdDateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.createdDateTime), 'day'));
          const modificados = props.tarefas.filter(t => Boolean(t.lastModifiedDateTime)).filter(t => dataAtual.hasSame(DateTime.fromISO(t.lastModifiedDateTime), 'day'));

          return (
            <MDBCol key={dayCard} className='p-0 mb-4' size={12} sm={6} md={4} lg={3} xl={2} xxl={2}>
              <MDBCard className={classNames('h-100 my-4 mx-1', { 'text-white': !isToday })} background={isToday ? 'light' : 'dark'}>
                <MDBCardHeader>
                  {dataAtual.toFormat('cccc')} {dataDiaMes(dataAtual)}
                </MDBCardHeader>
                <MDBCardBody>
                  <div className={classNames('border-bottom mb-2 pb-2', { 'd-none': !conclusao.length || !tiposDatas.conclusao.show })} style={{ lineHeight: '1.1em' }}>
                    <h6>Conclusão em:</h6>
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {conclusao.map(t => <span key={t.id} className='d-block'>{t.title}</span>)}
                    </div>
                  </div>
                  <div className={classNames('border-bottom mb-2 pb-2', { 'd-none': !lembretes.length })} style={{ lineHeight: '1.1em' }}>
                    <h6>Lembretes:</h6>
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {lembretes.map(t => <span key={t.id} className='d-block'>- {t.title}</span>)}
                    </div>
                  </div>
                  <div className={classNames('border-bottom mb-2 pb-2', { 'd-none': !concluidos.length })} style={{ lineHeight: '1.1em' }}>
                    <h6>Concluídos:</h6>
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {concluidos.map(t => <span key={t.id} className='d-block'>- {t.title}</span>)}
                    </div>
                  </div>
                  <div className={classNames('border-bottom mb-2 pb-2', { 'd-none': !criados.length })} style={{ lineHeight: '1.1em' }}>
                    <h6>Criados:</h6>
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {criados.map(t => <span key={t.id} className='d-block'>- {t.title}</span>)}
                    </div>
                  </div>
                  <div className={classNames('border-bottom mb-2 pb-2', { 'd-none': !modificados.length || true })} style={{ lineHeight: '1.1em' }}>
                    <h6>Modificados:</h6>
                    <div style={{ height: '150px', overflow: 'auto' }}>
                      {modificados.map(t => <span key={t.id} className='d-block'>- {t.title}</span>)}
                    </div>
                  </div>
                </MDBCardBody>
                <MDBCardFooter>
                  <small className='text-muted'>Last updated 3 mins ago</small>
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          )
        })}
      </MDBRow >
    </MDBContainer >
  )
}
