import { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../UserContext';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

function LoginForm(props) {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openModal, setOpenModal] = useState(true);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: '#0D1717',
    border: '2px solid #000',
    borderRadius: '1em',
    boxShadow: 24,
    p: 3,
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const data = {
      username: username,
      password: password
    };

    try {
      const response = await axios.post('https://jdr-api.com/api/login_check', data);
      if (response.data.token) {
        Cookies.set('token', response.data.token, { secure: true, sameSite: 'strict' });
        const decodedToken = jwtDecode(response.data.token);
        setUser({ username: username, pseudo: decodedToken.pseudo });
        setErrorMessage('');
        props.onSuccess();
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  }

  return (
    <Modal
      open={openModal}
      onClose={props.handleShowLoginForm}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style}>
        <form className="signin-form" onSubmit={handleSubmit}>
          {errorMessage && <div>{errorMessage}</div>}
          <Box sx={{mb: 1}}>
            <label htmlFor="username" className="modal-title">Nom d'utilisateur</label>
          </Box>
          <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
          <Box sx={{mb: 1, mt: 2}}>
            <label htmlFor="password" className="modal-title">Mot de passe</label>
          </Box>
          <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <div className="modal-buttons">
            <button className="button button-modal" type="submit">
              Connexion
            </button>
          </div>
      </form>
      </Box>
    </Modal>
  );
}

export default LoginForm;
