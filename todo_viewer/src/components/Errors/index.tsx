import React from 'react'
import { FaCross } from 'react-icons/fa';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCardText, MDBCardTitle } from 'mdb-react-ui-kit';
import styles from './Errors.module.scss'
import { DateTime } from 'luxon'

interface Props {
  errorsList: any[];
  setErrorsList: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function Errors(props: Props) {

  const handleFecharErro = (erroId: any) => {
    props.setErrorsList(prevErrors => prevErrors.filter(erro => erro.id !== erroId))
  }

  return (
    <div>
      {props.errorsList.map(error => {
        return (
          <MDBCard key={error.id} shadow='0' border='danger' background='danger' className='mb-1 text-light hover-shadow'>
            <MDBCardHeader className='px-2 py-1 d-flex flex-row justify-content-between align-items-center'>
              <span>Erro</span>
              <MDBBtn
                onClick={() => handleFecharErro(error.id)}
                title='Fechar mensagem de erro'
                outline
                color='light'
                className='py-0 px-3 text-light shadow-sm'
                placeholder='Fechar mensagem de erro'>
                <FaCross />
              </MDBBtn>
            </MDBCardHeader>
            <MDBCardBody className='px-0 py-1'>
              <MDBCardTitle className='px-2 py-0 m-0' style={{ maxHeight: '60px', overflow: 'auto' }}>{error.title}</MDBCardTitle>
              <small className='m-2'>{error.datetime}</small>
              {error.action ? <small className='m-2'>{error.action}</small> : <></>}
              <MDBCardText className={styles.errorCard_Body + ' p-2'} style={{ lineHeight: '1em', fontFamily: 'Consolas', maxHeight: '140px', overflow: 'auto' }}>
                {error.description}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>

        )
      })}


    </div>
  )
}
