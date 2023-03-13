import { useSwipeable } from "react-swipeable";
import React, { useState, useContext, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import { SheetContext } from "../SheetContext";
import { UserContext } from "../UserContext";

import "./General.scss";
// import "./Modal.scss";
import "../Preview/Preview.scss";

import maleOrc from "../assets/images/male-orc.jpg";
import femaleOrc from "../assets/images/female-orc.png";
import mars from "../assets/images/mars.png";
import venus from "../assets/images/venus.png";
import next from "../assets/images/next.png";

// TODO : Dynamiser les religions avec un axios

const Edit = ({ religions }) => {

  const token = Cookies.get('token');

  const navigate = useNavigate();

  const { sheetId } = useParams();

  const {
    currentImage,
    setCurrentImage,
    formValues,
    setFormValues,
    selectedReligion,
    setSelectedReligion,
    pdfUrl,
    setPdfUrl,
    selectedSheetId,
    setSelectedSheetId,
  } = useContext(SheetContext);

  const { user } = useContext(UserContext);

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

  const handleMaleClick = () => {
    setCurrentImage(maleOrc);
  };

  const handleFemaleClick = () => {
    setCurrentImage(femaleOrc);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Je n'ai pas encore décidé de ce que je ferai au submit
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  }

  useEffect(() => {
    axios.get(`https://jdr-api.com/api/characters/${selectedSheetId}`, {
        headers: {
          "Authorization":  `Bearer ${token}`
        }})
      .then((response) => {
        const sheetData = response.data.sheet
        console.log(sheetData);
        setFormValues({
            firstName: sheetData.character_name.split(" ")[0],
            lastName: sheetData.character_name.split(" ")[1],
            age: sheetData.age,
            height: sheetData.height,
            weight: sheetData.weight,
            hairColor: sheetData.hair,
            backstory: sheetData.description,
        });
        setCurrentImage(sheetData.picture);
      })
  }, []);

  const dataToUpdate = {
    character_name: formValues.firstName + " " + formValues.lastName,
    description: formValues.backstory,
    age: Number(formValues.age),
    picture: currentImage,
    height: Number(formValues.height),
    weight: Number(formValues.weight),
    hair: formValues.hairColor,
    eyes: formValues.eyeColor,
  }

  const handleEdit = () => {
    if (user) {
        const token = Cookies.get('token');
        axios.patch(`https://jdr-api.com/api/characters/${selectedSheetId}`, dataToUpdate,
        {responseType: 'blob',
        headers: {
            'accept': 'application/json',
            'Authorization':`Bearer ${token}`
        }})
            .then((response) => {
                const blob = new Blob([response.data], {type: 'application/pdf'});
                setPdfUrl(URL.createObjectURL(blob));
                setSelectedSheetId(null);
                console.log(pdfUrl);
                alert("Votre fiche a bien été modifiée");
                navigate("/profile");
            })
            .catch((error) => {
                console.log(error);
            })
    }
};
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
      <div className="general-page">
        <div className="general-gender-image">
          <img className="selected-image" src={currentImage} alt="image du sexe sélectionné" />
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
      </div>
      <div className="generate">
        <button className="generate-button" onClick={handleEdit}>Valider mes changements</button>
    </div>
    </>
  );
};

export default Edit;