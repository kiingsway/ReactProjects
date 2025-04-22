import axios from 'axios'

const HostGraph = 'https://graph.microsoft.com/v1.0'

export async function obterListasTodo(token: string) {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  return axios.get(`${HostGraph}/me/todo/lists`, config)
}

export async function obterTarefasTodo(listId: string, token: string) {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  return axios.get(`${HostGraph}/me/todo/lists/${listId}/tasks`, config)
}
export async function obterEu(token: string) {

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  return axios.get(`${HostGraph}/me`, config)
}
export async function obterMinhaFoto(token: string) {

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain'
    }
  }

  return axios.get(`${HostGraph}/me/photo/$value`, config)
}