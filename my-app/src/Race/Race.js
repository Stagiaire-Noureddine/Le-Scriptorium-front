import { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../GlobalContext";
import { SheetContext } from "../SheetContext";
import axios from "axios";
import "./Race.scss";
import Frame from "./Frame";
import { motion } from "framer-motion";

const Race = () => {
  const [races, setRaces] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const {
    selectedRace,
    setSelectedRace,
    setSelectedRaceAbility,
    setRaceBonus,
  } = useContext(GlobalContext);
  const {
    setRaceName
  } = useContext(SheetContext);

  useEffect(() => {
    axios.get("https://jdr-api.com/api/races").then((response) => {
      setRaces(response.data.races);
      console.log(response.data.races);

    });
  }, []);

  const handleRaceClick = (raceIndex) => {
    if (selectedRace === raceIndex) {
      setSelectedRace(null);
      setSelectedRaceAbility("");
      setRaceBonus({});
      setRaceName("Fiche Test");
    } else {
      setSelectedRace(raceIndex);
      const raceStats = races[raceIndex]?.stats || {};
      const newRaceBonus = {
        FOR: raceStats.FOR || 0,
        DEX: raceStats.DEX || 0,
        CON: raceStats.CON || 0,
        INT: raceStats.INT || 0,
        SAG: raceStats.SAG || 0,
        CHA: raceStats.CHA || 0,
      };
      setRaceBonus((prevRaceBonus) => ({
        ...Object.fromEntries(
          Object.keys(prevRaceBonus).map((key) => [key, 0])
        ),
        ...newRaceBonus,
      }));
      const raceName = races[raceIndex]?.name || "";
      setRaceName(raceName);
    }
    setSelectedRaceAbility("");
  };

  return (
    <motion.div className="races-container"

      initial={{ opacity: 0, y: "100vh" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "-100vh" }}
      transition={{ duration: 0.3 }}

    >
      <h1 className="races-title">R A C E S</h1>
      <div className="races-frames">
        {races.map((race, index) => (
          <Frame
            key={index}
            raceIndex={index}
            name={race.name}
            description={race.description}
            picture={race.picture}
            racialAbilities={race.racialAbilities}
            selectedRace={selectedRace}
            handleRaceClick={handleRaceClick}
            expanded={expanded === index}
            setExpanded={setExpanded}
            isLast={index === 7}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Race;
