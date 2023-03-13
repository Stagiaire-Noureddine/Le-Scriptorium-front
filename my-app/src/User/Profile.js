import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { SheetContext } from '../SheetContext';
import axios from 'axios';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import './Profile.scss';


const Profile = () => {
    const { 
      pdfUrl,
      setPdfUrl,
      selectedSheetId,
      setSelectedSheetId
    } = useContext(SheetContext);

    const token = Cookies.get('token');

    const [sheetsList, setSheetsList] = useState([]);
    const [refreshList, setRefreshList] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: '#000000',
      border: '2px solid #000',
      boxShadow: 24,
      p: 3,
    };
    

  useEffect (() => {
    axios.get("http://localhost:8080/api/characters/users", {
      headers: {
        "Authorization":  `Bearer ${token}`
      }})
    .then((response) => {
      const sheetsData = response.data.sheets;
      console.log(sheetsData);
      setSheetsList(sheetsData);
      setPdfUrl(null);
    })
  }, [refreshList]);

  const handleDownload = (sheetId) => {
    axios.get(`http://localhost:8080/api/generator/sheet/${sheetId}`, {
      responseType: 'blob',
      headers: {
        "Authorization":  `Bearer ${token}`
      }})
        .then((response) => {
          console.log(response.data);
          const blob = new Blob([response.data], {type: 'application/pdf'});
          setPdfUrl(URL.createObjectURL(blob));
          console.log(pdfUrl);
          if (pdfUrl !== null) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', `fiche${sheetId}.pdf`);
            document.body.appendChild(link);
            link.click();
            console.log(response);
          }
        })
        .catch((error) => {
          console.error(error);
    });
  };



  const handleEdit = (sheetId) => {
    setSelectedSheetId(sheetId);
    // axios.patch(`http://localhost:8080/api/characters/${sheetId}`, {
    //   responseType: 'json',
    //   headers: {
    //     "Authorization": `Bearer ${token}`
    //   }})
    //   .then((response) => {
    //     console.log(response.data);
    //   })
  };

  const handleDelete = (sheetId) => {
    setSelectedSheetId(sheetId);
    axios.delete(`http://localhost:8080/api/characters/${selectedSheetId}`, {
      responseType: 'json',
      headers: {
        "Authorization": `Bearer ${token}`
      }})
      .then((response) => {
        // alert(response.data.message);
        console.log(response.data);
        setRefreshList(!refreshList);
        handleOpenModal();
      })
  };

  const handleOpenModal = (sheetId) => {
    setSelectedSheetId(sheetId);
    setOpenModal(!openModal);
  };

  return ( 
    <div className="sheet-container">
      <h1>Mes fiches enregistrées</h1>
      <div className="sheet-list">
        {sheetsList.map((sheet, index) => (
          <div className="sheet" key={index}>
            <div className="sheet-infos">
              <div className="sheet-picture">
                <img className="character-picture" src={sheet.picture} alt="Portrait du personnage" height={80} /> {/* height to disable once the picture is really dynamic*/}
              </div>
              <div className="sheet-name">
                {sheet.character_name}
              </div>
              <div className="sheet-race">
                {sheet.race_name}
              </div>
              <div className="sheet-class">
                {sheet.classe.name}
              </div>
            </div>
            <div className="sheet-actions">
              <button className="sheet-button" onClick={() => handleDownload(sheet.id)}>
                <img src="https://fakeimg.pl/20x20/000/?text=DL" alt="Télécharger la fiche" />
              </button>
              <button className="sheet-button" onClick={() => handleEdit(sheet.id)}>
                <Link to={`/general/edit/${sheet.id}`}>                  
                    <img src="https://fakeimg.pl/20x20/000/?test=EDIT" alt="Modifier la fiche" />
                </Link>
            </button>
              <button className="sheet-button" onClick={() => handleOpenModal(sheet.id)}>
                <img src="https://fakeimg.pl/20x20/000/?text=SUPP" alt="Supprimer la fiche" />
              </button>  
              <Modal
                open={openModal}
                onClose={handleOpenModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style}>
                  <p className="modal-title">
                    Etes-vous sûr de vouloir supprimer cette fiche ?
                  </p>
                  <div className="modal-buttons">
                    <Button variant="outlined" size="small" sx={{color: "#fff", border: "1px solid #fff"}} onClick={() => handleDelete(sheet.id)}>
                      Oui
                    </Button>
                    <Button variant="outlined" size="small" sx={{color: "#fff", border: "1px solid #fff"}} onClick={() => handleOpenModal()}>
                      Non
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          </div>
          ))}
      </div>
    </div>
  );
};

export default Profile;
