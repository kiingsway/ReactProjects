import { MDBBtn, MDBCard, MDBCardBody, MDBCardGroup, MDBCol, MDBContainer, MDBRow, MDBTable, MDBTableBody, MDBTableHead, MDBTextArea } from 'mdb-react-ui-kit';
import { useState } from 'react';
import './App.css'
import { obterListasTodo, obterTarefasTodo } from './obterListasTarefas';
import { DateTime } from 'luxon'
import { FaBell, FaBellSlash } from 'react-icons/fa';
import classNames from 'classnames';
import Contribution from './components/Contribution';
import Errors from './components/Errors';
import { v4 as guid } from 'uuid'
import Weekly from './components/Weekly';

const totalDays: number = 369;

const startDate = DateTime.now().minus({ days: totalDays - 1 });

const blankData = Array.from(new Array(totalDays)).map((_, index) => ({
  date: startDate.plus({ days: index }),
  value: 0
}));

interface IErrors {
  id: string;
  title: string;
  action: string;
  datetime: string;
  description: string;
}

export default function App() {

  const [token, setToken] = useState('');
  const [listasTarefasTodo, setListasTarefasTodo] = useState<any[]>([]);
  const [todasTarefasTodo, setTodasTarefasTodo] = useState<any[]>([]);
  const [errorsList, setErrorsList] = useState<IErrors[]>([]);

  const handleErrors = (error: any) => {

    const dataErrorCode = error.response.data.error.code;
    const dataErrorMsg = error.response.data.error.message;

    const status = error.response.status || error.name;
    const name = error.response.statusText || error.name;
    const message = dataErrorCode || error.message;
    const description = dataErrorMsg || error.code

    const erro: IErrors = {
      id: guid(),
      action: error.action,
      title: `(${status}) ${name} : ${message}`,
      datetime: DateTime.now().toFormat('dd/LL - HH:mm:ss.SSS'),
      description
    }

    setErrorsList(prev => [erro, ...prev])
  }

  const handleGetListsAndTasks = () => {
    if (!token) { alert('Insira o token...'); return }
    setTodasTarefasTodo([])
    setListasTarefasTodo([])

    obterListasTodo(token)
      .catch(e => handleErrors(e))
      .then(listasList => {
        const listas = listasList?.data.value || [];
        setListasTarefasTodo(listas)
        let listaCont = 0;
        for (let lista of listas) {
          setTimeout(() => {
            obterTarefasTodo(lista.id, token)
              .catch(e => handleErrors({ ...e, action: `Erro ao obter a lista "${lista.displayName}"` }))
              .then(tarefasList => {
                const tarefas: any[] = tarefasList?.data.value;
                setTodasTarefasTodo(prevTarefas => [...prevTarefas, ...(tarefas || []).map(t => ({ ...t, list: lista }))])
              })
          }, 200 * listaCont);
          listaCont++;
        }
      })
  }

  const pasteText = () => {
    navigator.clipboard
      .readText()
      .then(
        cliptext => setToken(cliptext),
        err => alert(err)
      );
  }

  const tarefasConcluidas = todasTarefasTodo.filter(t => t.status === 'completed');
  const datasConclusaoTarefas = tarefasConcluidas.map(t => DateTime.fromISO(t.completedDateTime.dateTime).toISODate())
  const concluidasDados = blankData.map(blankItem => ({ ...blankItem, value: datasConclusaoTarefas.filter(d => d === blankItem.date.toISODate()).length }))

  const datasCriacaoTarefas = tarefasConcluidas.map(t => DateTime.fromISO(t.createdDateTime).toISODate())
  const criacaoDados = blankData.map(blankItem => ({ ...blankItem, value: datasCriacaoTarefas.filter(d => d === blankItem.date.toISODate()).length }))

  return (
    <MDBContainer fluid className={`m-0 px-2 pt-1 pb-0`}>
      <MDBRow className='mb-3'>
        <Errors errorsList={errorsList} setErrorsList={setErrorsList} />
      </MDBRow>
      <MDBRow>
        <MDBCol size={12} className=''>
          <MDBTextArea
            label='To-Do Token'
            id='textAreaExample'
            rows={3}
            style={{ color: 'white', fontSize: '12px' }}
            labelClass='text-light'
            value={token}
            onChange={e => setToken(e.target.value)}
          />
          <MDBBtn className='me-3 mt-3' color='info' outline onClick={pasteText}>Colar texto</MDBBtn>
          <MDBBtn className='me-3 mt-3' color='success' onClick={handleGetListsAndTasks}>Obter tarefas</MDBBtn>
          <hr />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol>
          <ListasTarefas listasTarefas={listasTarefasTodo} />
          <hr />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol size={2} />
        <MDBCol size={9}>
          <div className='text-light'>
          </div>
        </MDBCol>
        <MDBCol size={1} />
      </MDBRow>
      <MDBRow>
        <MDBCol size={12}>
          <Contribution title={'Tarefas criadas'} data={criacaoDados} colorFunc={({ alpha }: any) => `rgba(160, 160, 160, ${alpha * 3})`} className='text-light' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol size={12}>
          <Contribution title={'Tarefas resolvidas'} data={concluidasDados} colorFunc={({ alpha }: any) => `rgba(3, 160, 3, ${alpha * 3})`} className='text-light' />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <hr />
        <MDBCol size={12} xl={12}><TabelaTarefas todasTarefas={todasTarefasTodo} /></MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}


const ListasTarefas = (props: { listasTarefas: any[] }) => {

  return (
    <>
      <small className='text-light mx-3'>{props.listasTarefas?.length} listas</small>
      <MDBCardGroup className='p-0 m-0' style={{ maxHeight: '150px', overflow: 'auto' }}>
        {props.listasTarefas?.map(lista => {

          return (
            <MDBCol size={12} sm={6} md={4} lg={3} xxl={2} key={lista.id}>
              <MDBCard className='p-0 m-1 rounded'>
                <MDBCardBody className='px-2 py-1'>{lista.displayName}</MDBCardBody>
              </MDBCard>
            </MDBCol>
          )
        })}
      </MDBCardGroup>
    </>
  )
}



const TabelaTarefas = (props: { todasTarefas: any[] }) => {
  if (!props.todasTarefas.length) return <>Obtendo tarefas...</>

  const hoje = DateTime.now();
  const data = {
    ontem: hoje.minus({ days: 1 }),
    anteontem: hoje.minus({ days: 2 }),
    semPassada: hoje.minus({ weeks: 1 }),
    semRetrasada: hoje.minus({ weeks: 2 }),
    mesPassado: hoje.minus({ months: 1 }),
    mesRetrasado: hoje.minus({ months: 2 }),
    anoPassado: hoje.minus({ years: 1 }),
    anoRetrasado: hoje.minus({ years: 2 }),
    anoDoisRetrasado: hoje.minus({ years: 3 }),
    anoTresRetrasado: hoje.minus({ years: 4 }),
    anoQuatroRetrasado: hoje.minus({ years: 5 }),
    anoCincoRetrasado: hoje.minus({ years: 6 }),
  }

  const tarefasAbertas = props.todasTarefas.filter(t => t.status !== 'completed');
  const tarefasConcluidas = props.todasTarefas.filter(t => t.status === 'completed');
  const tarefasComConclusao = tarefasAbertas.filter(t => t.dueDateTime?.dateTime);
  const tarefasSemConclusao = tarefasAbertas.filter(t => !t.dueDateTime?.dateTime);

  const tarefasResolvidas = {
    hoje: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(hoje, 'day')),
    ontem: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.ontem, 'day')),
    anteontem: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anteontem, 'day')),

    essaSem: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(hoje, 'week')),
    semPassada: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.semPassada, 'week')),
    semRetrasada: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.semRetrasada, 'week')),

    esseMes: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(hoje, 'month')),
    mesPassado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.mesPassado, 'month')),
    mesRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.mesRetrasado, 'month')),

    esseAno: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(hoje, 'year')),
    anoPassado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoPassado, 'year')),
    anoRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoRetrasado, 'year')),
    anoDoisRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoDoisRetrasado, 'year')),
    anoTresRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoTresRetrasado, 'year')),
    anoQuatroRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoQuatroRetrasado, 'year')),
    anoCincoRetrasado: tarefasConcluidas.filter((t: any) => DateTime.fromISO(t.completedDateTime.dateTime).hasSame(data.anoCincoRetrasado, 'year')),
  }

  const tarefasCriadas = {
    hoje: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(hoje, 'day')),
    ontem: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.ontem, 'day')),
    anteontem: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anteontem, 'day')),

    essaSem: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(hoje, 'week')),
    semPassada: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.semPassada, 'week')),
    semRetrasada: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.semRetrasada, 'week')),

    esseMes: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(hoje, 'month')),
    mesPassado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.mesPassado, 'month')),
    mesRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.mesRetrasado, 'month')),

    esseAno: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(hoje, 'year')),
    anoPassado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoPassado, 'year')),
    anoRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoRetrasado, 'year')),
    anoDoisRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoDoisRetrasado, 'year')),
    anoTresRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoTresRetrasado, 'year')),
    anoQuatroRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoQuatroRetrasado, 'year')),
    anoCincoRetrasado: props.todasTarefas.filter((t: any) => DateTime.fromISO(t.createdDateTime).hasSame(data.anoCincoRetrasado, 'year')),
  }

  const tarefasPrevias = {
    criadas: {
      hoje: tarefasCriadas.hoje.map((t: any) => t.title).join(', '),
      ontem: tarefasCriadas.ontem.map((t: any) => t.title).join(', '),
      anteontem: tarefasCriadas.anteontem.map((t: any) => t.title).join(', '),

      essaSem: tarefasCriadas.essaSem.map((t: any) => t.title).join(', '),
      semPassada: tarefasCriadas.semPassada.map((t: any) => t.title).join(', '),
      semRetrasada: tarefasCriadas.semRetrasada.map((t: any) => t.title).join(', '),
    },
    resolvidas: {
      hoje: tarefasResolvidas.hoje.map((t: any) => t.title).join(', '),
      ontem: tarefasResolvidas.ontem.map((t: any) => t.title).join(', '),
      anteontem: tarefasResolvidas.anteontem.map((t: any) => t.title).join(', '),

      essaSem: tarefasResolvidas.essaSem.map((t: any) => t.title).join(', '),
      semPassada: tarefasResolvidas.semPassada.map((t: any) => t.title).join(', '),
      semRetrasada: tarefasResolvidas.semRetrasada.map((t: any) => t.title).join(', '),
    }
  }

  const qtdDataConclusao = tarefasAbertas.filter(t => t.dueDateTime?.dateTime).length;
  const qtdVencidas = tarefasAbertas.filter(t =>
    t.dueDateTime?.dateTime ? hoje > DateTime.fromISO(t.dueDateTime.dateTime) : false
  ).length;

  const sortByCreatedDateTime = (a: any, b: any) => a.createdDateTime < b.createdDateTime ? -1 : +(a.createdDateTime > b.createdDateTime)
  const sortByDueDateTime = (a: any, b: any) => a.dueDateTime.dateTime < b.dueDateTime.dateTime ? -1 : +(a.dueDateTime.dateTime > b.dueDateTime.dateTime)

  const tarefasPorConclusao = tarefasComConclusao.sort(sortByDueDateTime);

  const tarefasPorCriacao = props.todasTarefas.sort(sortByCreatedDateTime);
  const tarefasSemConclusaoPorCriacao = tarefasSemConclusao.sort(sortByCreatedDateTime);
  const dataCriacao = DateTime.fromISO(tarefasPorCriacao[0].createdDateTime)
  const qtdDiasTodo = DateTime.now().diff(dataCriacao, 'days').days;
  const tarefasDia = (props.todasTarefas.length / qtdDiasTodo).toFixed(2)
  const resolvidasDia = (tarefasConcluidas.length / qtdDiasTodo).toFixed(2)

  const CriadasResolvidas = (props: { className?: string, dataExtenso: string, dataFormatada?: string, qtdResolvidas: number, qtdCriadas: number, criadasPrevia?: string, resolvidasPrevia?: string }) => (
    <small className={props.className} style={{ cursor: 'default' }}>
      {props.dataExtenso}{props?.dataFormatada ? ` (${props.dataFormatada})` : ''}:
      <span title={props.criadasPrevia ? `Tarefas criadas: ${props.criadasPrevia}` : ''} className='mx-1'> {props.qtdCriadas} 🌟</span>
      <span title={props.resolvidasPrevia ? `Tarefas resolvidas: ${props.resolvidasPrevia}` : ''}> {props.qtdResolvidas} ✅</span>
    </small>
  )

  return (
    <>
      <div className='text-light'>

        <small className='mx-3'>{tarefasAbertas.length} tarefas (total: {props.todasTarefas.length})</small>
        <small className='mx-3'>{qtdVencidas} vencidas de {qtdDataConclusao} com conclusão</small>
        <small className='mx-3'>{qtdDiasTodo.toFixed(0)} dias de To-Do</small>
        <small className='mx-3'>{tarefasDia} tarefas criadas/dia</small>
        <small className='mx-3'>{resolvidasDia} resolvidas/dia</small>
        <hr />
        <CriadasResolvidas dataExtenso='Hoje' dataFormatada={hoje.toFormat('dd/LL')} criadasPrevia={tarefasPrevias.criadas.hoje} resolvidasPrevia={tarefasPrevias.resolvidas.hoje}
          qtdCriadas={tarefasCriadas.hoje.length} qtdResolvidas={tarefasResolvidas.hoje.length} className='mx-3' />
        <CriadasResolvidas dataExtenso='Ontem' dataFormatada={data.ontem.toFormat('dd/LL')} criadasPrevia={tarefasPrevias.criadas.ontem} resolvidasPrevia={tarefasPrevias.resolvidas.ontem}
          qtdCriadas={tarefasCriadas.ontem.length} qtdResolvidas={tarefasResolvidas.ontem.length} className='mx-3' />
        <CriadasResolvidas dataExtenso='Anteontem' dataFormatada={data.anteontem.toFormat('dd/LL')} criadasPrevia={tarefasPrevias.criadas.anteontem} resolvidasPrevia={tarefasPrevias.resolvidas.anteontem}
          qtdCriadas={tarefasCriadas.anteontem.length} qtdResolvidas={tarefasResolvidas.anteontem.length} className='mx-3' />
        <br />
        <CriadasResolvidas dataExtenso='Essa semana' dataFormatada={hoje.toFormat('WW')} qtdCriadas={tarefasCriadas.essaSem.length} qtdResolvidas={tarefasResolvidas.essaSem.length} className='mx-3' criadasPrevia={tarefasPrevias.criadas.essaSem} resolvidasPrevia={tarefasPrevias.resolvidas.essaSem} />
        <CriadasResolvidas dataExtenso='Semana passada' dataFormatada={data.semPassada.toFormat('WW')} qtdCriadas={tarefasCriadas.semPassada.length} qtdResolvidas={tarefasResolvidas.semPassada.length} className='mx-3' criadasPrevia={tarefasPrevias.criadas.semPassada} resolvidasPrevia={tarefasPrevias.resolvidas.semPassada} />
        <CriadasResolvidas dataExtenso='Semana retrasada' dataFormatada={data.semRetrasada.toFormat('WW')} qtdCriadas={tarefasCriadas.semRetrasada.length} qtdResolvidas={tarefasResolvidas.semRetrasada.length} className='mx-3' criadasPrevia={tarefasPrevias.criadas.semRetrasada} resolvidasPrevia={tarefasPrevias.resolvidas.semRetrasada} />
        <br />
        <CriadasResolvidas dataExtenso={hoje.toFormat('LL/yy')} qtdCriadas={tarefasCriadas.esseMes.length} qtdResolvidas={tarefasResolvidas.esseMes.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.mesPassado.toFormat('LL/yy')} qtdCriadas={tarefasCriadas.mesPassado.length} qtdResolvidas={tarefasResolvidas.mesPassado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.mesRetrasado.toFormat('LL/yy')} qtdCriadas={tarefasCriadas.mesRetrasado.length} qtdResolvidas={tarefasResolvidas.mesRetrasado.length} className='mx-3' />
        <br />
        <CriadasResolvidas dataExtenso={hoje.toFormat('yyyy')} qtdCriadas={tarefasCriadas.esseAno.length} qtdResolvidas={tarefasResolvidas.esseAno.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoPassado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoPassado.length} qtdResolvidas={tarefasResolvidas.anoPassado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoRetrasado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoRetrasado.length} qtdResolvidas={tarefasResolvidas.anoRetrasado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoDoisRetrasado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoDoisRetrasado.length} qtdResolvidas={tarefasResolvidas.anoDoisRetrasado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoTresRetrasado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoTresRetrasado.length} qtdResolvidas={tarefasResolvidas.anoTresRetrasado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoQuatroRetrasado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoQuatroRetrasado.length} qtdResolvidas={tarefasResolvidas.anoQuatroRetrasado.length} className='mx-3' />
        <CriadasResolvidas dataExtenso={data.anoCincoRetrasado.toFormat('yyyy')} qtdCriadas={tarefasCriadas.anoCincoRetrasado.length} qtdResolvidas={tarefasResolvidas.anoCincoRetrasado.length} className='mx-3' />
        <br />
        <hr />
      </div>
      <Weekly tarefas={props.todasTarefas} />

      <hr />
      <MDBTable align='middle' responsive="xxl" color='dark' style={{ tableLayout: 'fixed' }} hover>
        <MDBTableHead>
          <tr>
            <th>Tarefa</th>
            <th>Lista</th>
            <th>Conclusão</th>
            <th>Lembrete</th>
            <th>Criado</th>
            <th>Modificado</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {[...tarefasPorConclusao, ...tarefasSemConclusaoPorCriacao].map(tarefa => {

            const ReminderIcon = (pr: { isReminderOn: boolean, isReminderFilled: boolean }) => pr.isReminderOn ? <FaBell className='text-success me-2' /> : (pr.isReminderFilled ? <FaBellSlash className='text-warning me-2' /> : <></>)


            const DateText = (pr: { date: string, datetime?: boolean, overdue?: boolean }) => {
              if (!pr.date) return <></>
              const date = DateTime.fromISO(pr.date, { locale: 'pt-BR' })
              const vencido = date.toISODate() < hoje.toISODate() && pr.overdue;
              const vencimentoHoje = date.toISODate() === hoje.toISODate() && pr.overdue;
              const formatoData = date.toFormat('yyyy') === hoje.toFormat('yyyy') ? (pr.datetime ? 'dd LLL hh:mm' : 'dd LLL') : (pr.datetime ? 'dd LLL yyyy hh:mm' : 'dd LLL yyyy')
              return (
                <span className={classNames({ 'text-danger': vencido }, { 'text-warning': vencimentoHoje })} title={pr.date + ' - ' + date.toFormat('dd/LL/yyyy hh:mm:ss')} >
                  {date.toFormat(formatoData)}
                </span>
              )
            }

            return (
              <tr key={tarefa.id}>
                <td>{tarefa.title}</td>
                <td>{tarefa.list?.displayName}</td>
                <td><DateText date={tarefa.dueDateTime?.dateTime ? tarefa.dueDateTime.dateTime + 'Z' : ''} overdue /></td>
                <td>
                  <ReminderIcon isReminderOn={tarefa.isReminderOn} isReminderFilled={Boolean(tarefa.reminderDateTime?.dateTime)} />
                  {tarefa.reminderDateTime?.dateTime ? <DateText date={tarefa.reminderDateTime.dateTime + 'Z'} datetime /> : <></>}
                </td>
                <td><DateText date={tarefa.createdDateTime} datetime /></td>
                <td><DateText date={tarefa.lastModifiedDateTime} datetime /></td>
              </tr>
            )
          })}
        </MDBTableBody>
      </MDBTable>
    </>
  )
}