import { useContext, useEffect, useState } from "react";
import { PDFViewer } from '@react-pdf/renderer';

import { GlobalContext } from "../GlobalContext";
import { SheetContext } from "../SheetContext";
import { UserContext } from "../UserContext";

import Sheet from "./Sheet";

import axios from "axios";
import Cookies from 'js-cookie';

import "./Preview.scss";

import { motion } from "framer-motion";

const Preview = () => {
    const {
        // Classes
        classId,
        // Races
        selectedRaceAbility,
        // Stats
        secondaryStats,
        finalPrimaryStats,
        // Ways
    } = useContext(GlobalContext);

    const {
         // Classes
         equipment,
         // Races
         raceName,
         selectedRaceAbilityId,
         // General
         currentImage,
         formValues,
         selectedReligion,
         // Ways
         selectedWayAbilityId,
         // Preview
         pdfUrl,
         setPdfUrl,
    } = useContext(SheetContext);

    const { user } = useContext(UserContext);

    const [numPage, setNumPage] = useState(null);

    const sheetData = {
        character_name: formValues.firstName + " " + formValues.lastName,
        race_name: raceName,
        religion_name: "Fromage", // A dynamiser quand la religion sera récupérable de l'API (vide pour l'instant)
        description: formValues.backstory,
        age: Number(formValues.age),
        level: 1,
        picture: currentImage,
        height: Number(formValues.height),
        weight: Number(formValues.weight),
        hair: formValues.hairColor,
        eyes: formValues.eyeColor,
        stats: {
            Dextérité: finalPrimaryStats.DEX,
            Constitution: finalPrimaryStats.CON,
            Force: finalPrimaryStats.FOR,
            Charisme: finalPrimaryStats.CHA,
            Sagesse: finalPrimaryStats.SAG,
            Intelligence: finalPrimaryStats.INT,
        },
        user: null,
        classe: classId,
        way_abilities: selectedWayAbilityId, // WIP : Tableau avec 2 valeurs, voir comment les assigner correctement
        racialAbility: selectedRaceAbilityId
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPage(numPages);
    };

    const handleGeneration = () => {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', 'fiche.pdf');
        document.body.appendChild(link);
        link.click();

        if(user) {
            const token = Cookies.get('token');
            axios.post("http://localhost:8080/api/characters", sheetData,
            {responseType: 'arraybuffer',
            headers: {
                'accept': 'application/json',
                'Authorization':`Bearer ${token}`
            }})
                .then((response) => {
                    console.log(response);

                })
        }
    };

    useEffect(() => {       
        console.log(sheetData);
        axios.post("http://localhost:8080/api/generator", sheetData, {responseType: 'arraybuffer', headers: {'accept': 'application/json'}})
            .then((response) => {
                const blob = new Blob([response.data], {type: 'application/pdf'});
                setPdfUrl(URL.createObjectURL(blob));
                console.log(pdfUrl);

                console.log(response);
            })
            .catch((error) => {
                // alert("Erreur API : Les données de la fiche n'ont pas pu être envoyées.");
                console.error(error);
            });
    }, []);

    return (
        <motion.div className="preview-container"
            initial={{ opacity: 0, y: "100vh" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100vh" }}
            transition={{ duration: 0.3 }}
        >
            <h1 className="preview-title">Aperçu</h1>
            <div className="preview">
                {/* <img className="preview-image" src="https://fakeimg.pl/250x450/EFC874/?text=Preview" alt="Prévisualisation de votre fiche de personnage" /> */}
                {pdfUrl &&
                <PDFViewer>
                    <Sheet pdfUrl={pdfUrl} onDocumentLoadSuccess={onDocumentLoadSuccess}/>
                </PDFViewer>
                }
            </div>
            <div className="generate">
                <button className="generate-button" onClick={handleGeneration}>Générer ma fiche</button>
            </div>
        </motion.div>
    );
};

export default Preview;