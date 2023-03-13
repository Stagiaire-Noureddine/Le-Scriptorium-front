import { createContext, useState, useEffect } from "react";

export const GlobalContext = createContext({
  // Classes
  classes: [],
  setClasses: () => {},
  classId: null,
  setClassId: () => {},
  classBonus: { PV: 0 },
  setClassBonus: () => {},
  selectedClass: null,
  setSelectedClass: () => {},
  classesStats: [],
  setClassStats: () => {},
  // Races
  raceBonus: { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 },
  setRaceBonus: () => {},
  selectedRace: null,
  setSelectedRace: () => {},
  selectedRaceAbility: null,
  setSelectedRaceAbility: () => {},
  // Stats (generator)
  diceRolls: [],
  setDiceRolls: () => {},
  // Stats
  primaryStats: { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 },
  setPrimaryStats: () => {},
  secondaryStats: { PV: 0, INIT: 0, AC: 0, DIST: 0, CAC: 0, MAG: 0 },
  setSecondaryStats: () => {},
  statModifiers: { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 },
  setStatModifiers: () => {},
  stats: [],
  setStats: () => {},
  finalPrimaryStats: { FOR: 0, DEX: 0, CON: 0, INT: 0, SAG: 0, CHA: 0 },
  // Ways
});

const GlobalProvider = (props) => {
  const [diceRolls, setDiceRolls] = useState(Array(6).fill(0));

  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedRaceAbility, setSelectedRaceAbility] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(0);
  const [classId, setClassId] = useState(null);
  const [classesStats, setClassStats] = useState([]);

  const [stats, setStats] = useState(Array(6).fill(""));
  const [primaryStats, setPrimaryStats] = useState({
    FOR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  });
  const [secondaryStats, setSecondaryStats] = useState({
    PV: 0,
    INIT: 0,
    AC: 0,
    DIST: 0,
    CAC: 0,
    MAG: 0,
  });
  const [statModifiers, setStatModifiers] = useState({
    FOR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  });
  const [raceBonus, setRaceBonus] = useState({
    FOR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    SAG: 0,
    CHA: 0,
  });
  console.log(raceBonus);
  const [classBonus, setClassBonus] = useState({
    PV: 0,
  });

  const handleSelectClass = (index) => {
    setSelectedClass(index);
    const selectedClassId = classes[index].id;
    setClassId(selectedClassId);
  };

  const handleClassBonus = () => {
    if (classBonus[selectedClass]) {
      return classBonus[selectedClass].PV;
    }
  };

  const finalPrimaryStats = {
    FOR: primaryStats.FOR + raceBonus.FOR,
    DEX: primaryStats.DEX + raceBonus.DEX,
    CON: primaryStats.CON + raceBonus.CON,
    INT: primaryStats.INT + raceBonus.INT,
    SAG: primaryStats.SAG + raceBonus.SAG,
    CHA: primaryStats.CHA + raceBonus.CHA,
  };

  useEffect(() => {
    const { FOR, DEX, CON, INT, SAG, CHA } = finalPrimaryStats;
    const newStatModifiers = {
      FOR: FOR <= 0 ? 0 : Math.floor((FOR - 10) / 2),
      DEX: DEX <= 0 ? 0 : Math.floor((DEX - 10) / 2),
      CON: CON <= 0 ? 0 : Math.floor((CON - 10) / 2),
      INT: INT <= 0 ? 0 : Math.floor((INT - 10) / 2),
      SAG: SAG <= 0 ? 0 : Math.floor((SAG - 10) / 2),
      CHA: CHA <= 0 ? 0 : Math.floor((CHA - 10) / 2),
    };
    setStatModifiers(newStatModifiers);
  }, [primaryStats, raceBonus, classBonus]);

  useEffect(() => {
    const newSecondaryStats = {
      PV: handleClassBonus() + statModifiers.CON,
      INIT: finalPrimaryStats.DEX,
      AC: 10 + statModifiers.DEX ,
      DIST: statModifiers.DEX,
      CAC: statModifiers.FOR,
      MAG: statModifiers.INT,
    };
    setSecondaryStats(newSecondaryStats);
  }, [
    primaryStats,
    raceBonus,
    classBonus,
    statModifiers,
    secondaryStats.AC,
    selectedClass,
  ]);

  return (
    <GlobalContext.Provider
      value={{
        // Classes
        classes,
        setClasses,
        classId,
        classBonus,
        setClassBonus,
        selectedClass,
        setSelectedClass,
        classesStats,
        setClassStats,
        handleSelectClass,
        handleClassBonus,
        // Races
        raceBonus,
        setRaceBonus,
        selectedRace,
        setSelectedRace,
        selectedRaceAbility,
        setSelectedRaceAbility,
        // Stats (generator)
        diceRolls,
        setDiceRolls,
        // Stats
        primaryStats,
        setPrimaryStats,
        secondaryStats,
        setSecondaryStats,
        statModifiers,
        setStatModifiers,
        stats,
        setStats,
        finalPrimaryStats,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
