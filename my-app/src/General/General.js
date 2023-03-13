import { useSwipeable } from "react-swipeable";
import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { SheetContext } from "../SheetContext";
import raceImages from '../Race/raceImages.js';
import "./General.scss";
// import "./Modal.scss";

import {motion} from "framer-motion";

import mars from "../assets/images/mars.png";
import venus from "../assets/images/venus.png";
import next from "../assets/images/next.png";


// TODO : Dynamiser les religions avec un axios

const General = ({ religions }) => {
  const {
    currentImage,
    setCurrentImage,
    formValues,
    setFormValues,
    selectedReligion,
    setSelectedReligion,
    raceName,
  } = useContext(SheetContext);

  const [direction, setDirection] = useState(null);
  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      setDirection(eventData.dir);
      setModalOpen(false);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleReligionChange = (event) => {
    const religionName = event.target.value;
    const religion = religions.find((religion) => religion.name === religionName);
    setSelectedReligion(religion);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value
    }));
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  // const handleMaleClick = () => {
  //   setCurrentImage(maleOrc);
  // };

  // const handleFemaleClick = () => {
  //   setCurrentImage(femaleOrc);
  // };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Je n'ai pas encore décidé de ce que je ferai au submit
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  return (
    <>
      {/* <button className="general-button" onClick={handleOpenModal}>
      </button>
      {modalOpen && (
        <div className={`general-modal ${direction}`} {...handlers}>
          <div className="general-image" style={{ backgroundImage: `url(${currentImage})` }}>
            <div className="general-buttons">
              <img className="general-button-image" src={mars} onClick={handleMaleClick} alt="Symbole de mars signifiant une personne male"/>
              <img className="general-button-image" src={venus} onClick={handleFemaleClick} alt="Symbole de venus signifiant une personne femelle"/>
            </div>
          </div>
        </div>
      )} */}
      <motion.div className="general-page"
      initial={{ opacity: 0, y: "100vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100vh" }}
      transition={{ duration: 0.2 }}
      >
        <div className="general-gender-image">
          <img className="selected-image" src={raceImages[raceName]} alt="sexe sélectionné" />
        </div>
        <form className="general-form">
          <div className="general-inputs">
            <input type="text" id="lastName" name="lastName" placeholder="Nom" value={formValues.lastName} onChange={handleChange} />
            <input type="number" id="age" name="age" placeholder="Âge" value={formValues.age} onChange={handleChange} min="0" />
            <input type="text" id="eyeColor" name="eyeColor" placeholder="Couleur des yeux" value={formValues.eyeColor} onChange={handleChange} />
            <input type="text" id="firstName" name="firstName" placeholder="Prénom" value={formValues.firstName} onChange={handleChange} />
            <div className="measures">
              <input className="measures-input" type="number" id="weight" name="weight" placeholder="Poids kg" value={formValues.weight} onChange={handleChange} min="0" />
              <input className="measures-input" type="number" id="height" name="height" placeholder="Taille cm" value={formValues.height} onChange={handleChange} min="0" />
            </div>
            <input type="text" id="hairColor" name="hairColor" placeholder="Couleur des cheveux" value={formValues.hairColor} onChange={handleChange} />
          </div>
          <div className="backstory-box">
            <h2>Histoire</h2>
            <textarea className="backstory-box-input" id="backstory" name="backstory" placeholder="Votre histoire" value={formValues.backstory} onChange={handleChange} />
          </div>
        </form>
        <div className="religion-box">
          <div className="religion-header">
            Religion:
            <select className="religion-dropdown" onChange={handleReligionChange}>
              {/* {religions.map((religion) => (
            <option key={religion.name} value={religion.name}>
              {religion.name}
            </option>
          ))} */}
            </select>
          </div>
          <div className="religion-description">{selectedReligion?.description}</div>
        </div>
      </motion.div>
      <Link to="/generation-des-stats">
        <img
          className="next-page"
          src={next}
          alt="Chevron pointing down for the next page"
        />
      </Link>
    </>
  );
};

export default General;


