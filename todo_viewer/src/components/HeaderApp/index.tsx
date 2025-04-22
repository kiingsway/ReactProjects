import { MDBNavbar, MDBContainer, MDBNavbarBrand, MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import { MdLogin, MdLogout } from 'react-icons/md';
import { FaPaste, FaTrash } from 'react-icons/fa';
import { obterEu } from '../../obterListasTarefas';
import { IUserInfo } from '../../interfaces';

interface Props {
  userInfo: Partial<IUserInfo>
  setUserInfo: React.Dispatch<React.SetStateAction<Partial<IUserInfo>>>
}

export default function HeaderApp(props: Props) {

  const pasteText = () => {
    navigator.clipboard.readText()
      .then(
        token => props.setUserInfo(prev => ({ ...prev, token })),
        err => alert(err)
      );
  }

  const handleLogout = () => {
    if (window.confirm('Certeza que quer fazer log-out?')) props.setUserInfo({ id: null });
    
  }

  const handleLogin = () => {
    const token = props.userInfo?.token;
    if (token)
      obterEu(token)
        .catch(e => alert(JSON.stringify(e)))
        .then((userResp: any) => props.setUserInfo({...userResp.data, token}))
  }

  return (
    <MDBNavbar dark bgColor='dark'>
      <MDBContainer fluid className='justify-content-center'>
        <MDBNavbarBrand className='mx-2'>To-Do Viewer</MDBNavbarBrand>
        {props.userInfo?.id ?
          <>
            <div className='d-flex flex-column text-light mx-4' style={{ lineHeight: '1.2em' }}>
              <span>{props.userInfo.displayName}</span>
              <span>{props.userInfo.userPrincipalName}</span>
            </div>
            <MDBBtn
              onClick={handleLogout}
              className='mx-2 my-1 pt-1 fs-6' color='light' outline
              title='Fazer log-out...'>
              <MdLogout />
            </MDBBtn>
          </>
          :
          <div className='d-flex align-items-center'>
            <MDBBtn
              onClick={pasteText}
              className='mx-2 my-1 pt-1 fs-6' color='light' outline
              title='Colar texto...'>
              <FaPaste />
            </MDBBtn>
            <span
              title={props.userInfo?.token}
              className='text-muted'
              style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {props.userInfo?.token}
            </span>
            {
              props.userInfo?.token ?
                <>
                  <MDBBtn
                    onClick={() => props.setUserInfo({ id: null })}
                    className='ms-2 my-1 pt-1 fs-6' color='light' outline>
                    <FaTrash />
                  </MDBBtn>
                  <MDBBtn
                    onClick={handleLogin}
                    className=' my-1 pt-1 fs-6' color='light' outline>
                    <MdLogin />
                  </MDBBtn>
                </>
                :
                <></>
            }
          </div>
        }
      </MDBContainer>
    </MDBNavbar>
  )
}