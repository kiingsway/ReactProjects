import React from 'react';
import './App.css';
import QuickTable, { IQuickTableColumnDefinition, IQuickTableStyleDefinition } from './components/QuickTable';
import fluxos from './data/fluxos.json'
import pessoas from './data/pessoas.json'

function App() {

  const data1 = fluxos as any[];
  const dataColumns1: IQuickTableColumnDefinition[] = [
    { title: 'Título', acessor: 'properties.displayName' },
    { title: 'Status', acessor: 'properties.state' },
    { title: 'Modificado', acessor: 'properties.lastModifiedTime' },
    { title: 'Criado', acessor: 'properties.createdTime' },
  ]

  const data2 = pessoas as any[];
  const dataColumns2: IQuickTableColumnDefinition[] = [
    { title: 'Nome', acessor: 'nome' },
    { title: 'Idade', acessor: 'idade' },
    { title: 'Telefone Fixo', acessor: 'telefone_fixo' },
    { title: 'Nascimento', acessor: 'data_nasc' },
    { title: 'Sexo', acessor: 'sexo' },
    { title: 'Signo', acessor: 'signo' },
    { title: 'Endereço', acessor: 'endereco' },
    { title: 'Número', acessor: 'numero' },
  ]

  const style: IQuickTableStyleDefinition = {
    all: {
      fontFamily: 'Segoe UI',
      backgroundColor: '#333',
      color: 'white',
    },
    searchText: {
      border: '1px solid #999',
      padding: '4px 8px',
      marginRight: '15px',
      borderRadius: '.375rem',
      backgroundColor: '#232323',
    },
    filterSelect: {
      padding: '3px 8px',
      backgroundColor: '#232323',
    },
    filterSelectOutline: {
      borderRadius: 4,
      padding: 1,
      margin: '3px 3px 3px 0',
      border: '1px solid #999',
    },
    table: {
      marginTop: '10px',
    },
    th: {
      fontWeight: 500
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #555'
    }
  }

  return (
    <QuickTable
      columns={dataColumns2}
      data={data2}
      style={style}
    />
  );
}

export default App;