import './App.css'
import { useEffect, useState } from 'react'
import HeaderApp from './components/HeaderApp'
import { ITarefa, ITodoList, IUserInfo } from './interfaces'
import { VscFoldUp } from 'react-icons/vsc';
import { obterListasTodo, obterTarefasTodo } from './obterListasTarefas';
import WeeklyTasks from './components/WeeklyTasks';

export default function App() {

  const [userInfo, setUserInfo] = useState<Partial<IUserInfo>>({ id: null });
  const [listasTodo, setListasTodo] = useState<Partial<ITodoList>[]>([]);
  const [tarefasTodo, setTarefasTodo] = useState<Partial<ITarefa>[]>([]);
  const [errorsList, setErrorsList] = useState<any[]>([]);

  useEffect(() => {

    if (userInfo?.id && userInfo?.token) {
      const token = userInfo.token;
      setTarefasTodo([])
      setListasTodo([])

      obterListasTodo(token)
        .catch(e => setErrorsList(prevErrors => ([...prevErrors, e])))
        .then(listasList => {
          const listas = listasList?.data.value || [];
          setListasTodo(listas);
          let listaCont = 0;
          for (let lista of listas) {
            setTimeout(() => {
              obterTarefasTodo(lista.id, token)
                .catch(e => setErrorsList(prevErrors => ([...prevErrors, e])))
                .then(tarefasList => {
                  const tarefas: any[] = tarefasList?.data.value
                    .map((t: any) => ({ ...t, lista }));
                  setTarefasTodo((prev: any) => ([...prev, ...tarefas]))
                })
            }, 200 * listaCont);
            listaCont++;
          }
        })
    }
  }, [userInfo])

  return (
    <>
      <HeaderApp
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      {
        Boolean(userInfo?.id) ?
          <>
            <WeeklyTasks tasks={tarefasTodo as ITarefa[]} />
          </>
          :
          <Welcome showWhen={!Boolean(userInfo?.id)} />
      }
    </>
  )
}

const Welcome = (props: { showWhen: boolean }) => {
  return props.showWhen ? (
    <div className='w-100 text-center d-flex align-items-center justify-content-center flex-column mt-4 text-light fs-4'>

      <VscFoldUp />
      <span>Faça o login...</span>
    </div>
  ) : <></>

}