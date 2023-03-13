import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';

import './Settings.scss';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const navigate = useNavigate ();

  const handleChangePassword = (e) => {
    e.preventDefault();

    // Check if the new password and verify password match
    if (newPassword !== verifyPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Call the API to update the password with the current password and new password
    fetch('/api/users/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        // Clear the form
        setCurrentPassword('');
        setNewPassword('');
        setVerifyPassword('');

        alert('Votre mot de passe a bien été changé');
      })
      .catch((error) => {
        alert(`Erreur lors du changement de mot de passe : ${error.message}`);
      });
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();

    // Call the API to delete the user's account with the current password
    fetch('/api/users/deleteAccount', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        currentPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(() => {
        // Clear the local storage and redirect to the login page
        localStorage.removeItem('token');
        navigate.push('/login');
      })
      .catch((error) => {
        alert(`Erreur lors de la suppression du compte : ${error.message}`);
      });
  };

  return (
    <div className="settings-container">
      <h1>Paramètres</h1>
      <div className="settings-form-container">
        <form className="settings-form" onSubmit={handleChangePassword}>
          <h2 className="settings-subtitle">Changer le mot de passe</h2>
          <label>
            Mot de passe actuel :
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Nouveau mot de passe :
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </label>
          <label>
            Confirmation du mot de passe :
            <input
              type="password"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
            />
          </label>
          {newPassword !== verifyPassword && (
            <p style={{ color: 'red' }}>Les mots de passe ne correspondent pas</p>
          )}
          <button className="button button-settings" type="submit">Changer le mot de passe</button>
        </form>
        <form className="settings-form" onSubmit={handleDeleteAccount}>
          <h2 className="settings-subtitle">Supprimer mon compte</h2>
          <h3>Etes-vous sûr.e de vouloir supprimer votre compte ? <br /> Cette action est irréversible.</h3>
          <label>
          Mot de passe :
          <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
          />
          </label>
          <button className="button button-settings" type="submit">Supprimer mon compte</button>
        </form>
      </div>
    </div>
    );
};

export default Settings;
