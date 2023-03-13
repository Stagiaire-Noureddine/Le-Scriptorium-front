import { createContext, useState, useCallback } from "react";

import maleOrc from "./assets/images/male-orc.jpg";

export const SheetContext = createContext({
    // Races
    raceName: "",
    setRaceName: () => { },
    selectedRaceAbilityId: null,
    setSelectedRaceAbilityId: () => { },
    // Classes
    equipment: [],
    setEquipment: () => { },
    // General
    currentImage: "",
    setCurrentImage: () => { },
    formValues: {
        firstName: "",
        lastName: "",
        eyeColor: "",
        age: "",
        height: "",
        weight: "",
        hairColor: "",
        backstory: ""
    },
    setFormValues: () => { },
    selectedReligion: null,
    setSelectedReligion: () => { },
    // Ways
    selectedWayAbilityId: null,
    setSelectedWayAbilityId: () => { },
    // Preview
    pdfUrl: null,
    setPdfUrl: () => { },
    selectedSheetId: null,
    setSelectedSheetId: () => { },
});

const SheetProvider = (props) => {
    // Races
    const [raceName, setRaceName] = useState("");
    const [selectedRaceAbilityId, setSelectedRaceAbilityId] = useState(null);
    // Classes
    const [equipment, setEquipment] = useState([]);
    // General
    const [currentImage, setCurrentImage] = useState(maleOrc); // Image par défaut à dynamiser
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        eyeColor: "",
        age: null,
        height: null,
        weight: null,
        hairColor: "",
        backstory: ""
    });
    const [selectedReligion, setSelectedReligion] = useState(null);
    // Ways
    const [selectedWayAbilityId, setSelectedWayAbilityId] = useState([]);
    // Preview
    const [pdfUrl, setPdfUrl] = useState(null);
    const [selectedSheetId, setSelectedSheetId] = useState(null);

    return (
        <SheetContext.Provider value={{
            // Race
            raceName,
            setRaceName,
            selectedRaceAbilityId,
            setSelectedRaceAbilityId,
            // Classes
            equipment,
            setEquipment,
            // General
            currentImage,
            setCurrentImage,
            formValues,
            setFormValues,
            selectedReligion,
            setSelectedReligion,
            // Ways
            selectedWayAbilityId,
            setSelectedWayAbilityId,
            // Preview
            pdfUrl,
            setPdfUrl,
            selectedSheetId,
            setSelectedSheetId,
        }}>
            {props.children}
        </SheetContext.Provider>
    );
};

export default SheetProvider;