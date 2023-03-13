import React, { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import { GlobalContext } from '../GlobalContext';
import { SheetContext } from '../SheetContext';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Navbar.scss';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import home from '../assets/images/home.png';
const Navbar = () => {
  const {
    setSelectedClass,
    setSelectedRace,
    setSelectedRaceAbility,
    setDiceRolls,
    setPrimaryStats,
    setSecondaryStats,
    setStats,
   } = useContext(GlobalContext);

  const {
    setSelectedRaceAbilityId,
    setCurrentImage,
    setFormValues,
    setSelectedReligion,
    setSelectedWayAbilityId,
    updateSelectedWayAbilityId,
    setPdfUrl,
    setSelectedSheetId
  } = useContext(SheetContext);
  const { user, setUser } = useContext(UserContext);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  // Menu burger - MUI
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const BasicMenu = () => {

      return (
        <Menu
          id="basic-menu"
          className={"burger-menu"}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
          >
            <MenuItem sx={{color: 'white'}} onClick={handleClose}>
              <Link to="/profile">Mes fiches</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
            <Link to="/parametres">Paramètres</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
            <Link to="mentions-legales">Mentions légales</Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              {user && (
                <Link to="/classes" onClick={handleLogout}>
                  Déconnexion
                </Link>
              )}
            </MenuItem>
        </Menu>
      );
    };

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const handleShowLoginForm = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignUpForm(false);
  };

  const handleShowSignUpForm = () => {
    setShowSignUpForm(!showSignUpForm);
    setShowLoginForm(false);
  };

  const clearStates = () => {
    // WIP : fonctionne à peu près sauf pour les informations générales
    //  (voir la fonction qui gère le préremplissage des inputs) et les way_abilities (cumul des valeurs dans le tableau)
    setSelectedClass(null);
    setSelectedRace(null);
    setSelectedRaceAbility(null);
    setDiceRolls(Array(6).fill(0));
    setPrimaryStats({ FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 });
    setSecondaryStats({ PV: 0, INIT: 0, AC: 0, DIST: 0, CAC: 0, MAG: 0 });
    setStats(Array(6).fill(""));

    setSelectedRaceAbilityId(null);
    setCurrentImage("");
    setFormValues({
      firstName: "",
      lastName: "",
      eyeColor: "",
      age: "",
      height: "",
      weight: "",
      hairColor: "",
      backstory: ""
    });
    setSelectedReligion(null);
    setSelectedWayAbilityId([]);
    setPdfUrl(null);
    setSelectedSheetId(null);
  };

  const isLoggedIn = user != null;
  return (
    <div className="navbar-container">
      <div className="logo" onClick={clearStates}>
        <Link to="/classes">
          <img src={home} alt="home" />
        </Link>
      </div>
      <nav className="navbar">
        <div className="menu">
          {user ? (
            <div className="user-info">{`${user.pseudo}`}</div>
          ) : (
            <div className="auth-buttons">
              <button className="button" type="button" onClick={handleShowLoginForm}>
                Connexion
              </button>
              <button className="button" type="button" onClick={handleShowSignUpForm}>
                Inscription
              </button>
            </div>
          )}
        </div>
        {isLoggedIn && (
        <Button
        sx={{minWidth: 30, minHeight: 20}}
        size="small"
        className="burger"
        onClick={handleClick}
        id="burger-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </Button>
        )}
      </nav>
      {showLoginForm && <LoginForm onSuccess={() => setShowLoginForm(false)} handleShowLoginForm={handleShowLoginForm} />}
      {showSignUpForm && <SignUpForm onSuccess={() => setShowSignUpForm(false)} handleShowSignUpForm={handleShowSignUpForm} />}
      <BasicMenu />
    </div>
  );
};

export default Navbar;
