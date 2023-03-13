import { useState } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const SignUpForm = (props) => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
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

  const handleResendActivation = async (event) => {
    event.preventDefault();

    try {
      await axios.post('https://jdr-api.com/resend-activation', {
        email: email,
      });
      setSuccessMessage('Un nouvel e-mail d\'activation a été envoyé.');
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite lors de l\'envoi de l\'e-mail d\'activation.');
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?=.*\d).{8,64}$/;
    if (!passwordRegex.test(password)) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/inscription', {
        pseudo: pseudo,
        email: email,
        password: password
      });
      setSuccessMessage('Inscription réussie. Veuillez activer votre compte en cliquant sur le lien qui vous a été envoyé par e-mail.');
      setIsSubmitted(true);
      setPseudo('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite lors de l\'inscription.');
      console.log(error);
    }
  };

  return (
    <>
        {successMessage ? (
          <div className="success-message">{successMessage}</div>
        ) : (
          <Modal
            open={openModal}
            onClose={props.handleShowSignUpForm}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
            {/* <h2>Inscription</h2> */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form className="signup-form" onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{mb: 1, mt: 1.5}}>
                <label className="modal-title" htmlFor="username">Nom d'utilisateur</label>
              </Box>
                <input type="text" id="pseudo" value={pseudo} onChange={(event) => setPseudo(event.target.value)} />
              <Box sx={{mb: 1, mt: 1.5}}>
                <label className="modal-title" htmlFor="email">Adresse e-mail</label>
              </Box>
                <input type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              <Box sx={{mb: 1, mt: 1.5}}>
                <label className="modal-title" htmlFor="password">Mot de passe</label>
              </Box>
                <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              <Box sx={{mb: 1, mt: 1.5}}>
                <label className="modal-title" htmlFor="confirmPassword">Confirmer le mot de passe</label>
              </Box>
                <input type="password" id="confirmPassword" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
              </Box>  
                <div className="modal-buttons modal-buttons-signup">
                  <button className="button button-modal" type="submit">
                    S'inscrire
                  </button>
                {isSubmitted && (
                  <>
                  <button type="button" className="button button-modal" onClick={handleResendActivation}>
                    Renvoyer l'e-mail d'activation
                  </button>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                  </>
                )}
                {!isSubmitted && <button className="button button-modal" type="button" onClick={() => setOpenModal(false)}>Annuler</button>}
                </div>              
            </form>
            </Box>
          </Modal>
        )}
    </>
  );
};

export default SignUpForm;