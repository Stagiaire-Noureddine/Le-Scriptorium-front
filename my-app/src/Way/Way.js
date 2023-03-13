import { useState, useEffect, useContext } from "react";

import SwiperCore, { Navigation, Keyboard, Mousewheel } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Link } from "react-router-dom";
import axios from "axios";

import { GlobalContext } from "./../GlobalContext";
import { SheetContext } from "./../SheetContext";

import {motion} from "framer-motion";

import next from "../assets/images/next.png";
import pv from "../assets/images/health.png";
import init from "../assets/images/initiative.png";
import ac from "../assets/images/defense.png";
import dist from "../assets/images/ranged.png";
import cac from "../assets/images/melee.png";
import mag from "../assets/images/magic.png";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";

import "./../reset.css";
import "./Way.scss";

SwiperCore.use([Navigation, Keyboard, Mousewheel]);

const Way = () => {

    const {
        classId,
        statModifiers,
        finalPrimaryStats,
        secondaryStats,
    } = useContext(GlobalContext);

    const {
        selectedWayAbilityId,
        setSelectedWayAbilityId,
    } = useContext(SheetContext);

    const [descriptionOpen, setDescriptionOpen] = useState(false);
    const [ways, setWays] = useState([]);
    const [selectedWayId, setSelectedWayId] = useState(null);
    const [selectedWayAbility, setSelectedWayAbility] = useState({
        name: "",
        description: "",
        bonus: null,
        cost: null,
        level: 1,
        limited: false,
        traits: [],
        id: null,
    });
    const [wayBonus, setWayBonus] = useState({
        FOR: 0,
        DEX: 0,
        CON: 0,
        INT: 0,
        SAG: 0,
        CHA: 0,
        INIT: 0,
        DEF: 0,
        PV: 0
    });
    const [selectedAbilityNames, setSelectedAbilityNames] = useState([]);
    const [selectedAbilityTraits, setSelectedAbilityTraits] = useState([]);
    const [remainingPoints, setRemainingPoints] = useState(2);
    const [waysNumber, setWaysNumber] = useState(0);

    // To get and use the viewport size
    const [windowSize, setWindowSize] = useState([
        window.innerWidth,
        window.innerHeight
    ]);
    
    
    useEffect(() => {
        const handleWindowResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener('resize', handleWindowResize);

        if (windowSize[0] >= 900) {
            setDescriptionOpen(true);
        }

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, [windowSize]);

    const wayNameClassnames = windowSize[0] >= 900 ? "way-name wide" : "way-name";

    const waySummary = (
        <div className="way-summary">
            <h3 className="changes-summary">
                Résumé des changements liés aux traits :
            </h3>
            <div className="way-changes">
                {/* <img src="#" alt="Logo décoratif des changements"/> */}
                <p className="feature-changing">
                    {selectedAbilityTraits.map((trait, index) => (
                        <span key={index}>
                            &bull; {trait}
                            {index !== selectedAbilityTraits.length - 1 && <br />}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );

    // Buttons previous and next that will be used in the Swiper for laptop
    const SwiperButtonNext = () => {
        const swiper = useSwiper();
        return (
            <button className={`${windowSize[0] >= 900 && windowSize[0] < 1440 ? "way-button-slider button-next" : "way-button-slider hidden"}`} onClick={() => swiper.slideNext()}>
                <img src={next} alt="Changer de slide" />
            </button>
        );
    };

    const SwiperButtonPrev = () => {
        const swiper = useSwiper();
        return (
            <button className={`${windowSize[0] >= 900 && windowSize[0] < 1440 ? "way-button-slider button-prev" : "way-button-slider hidden"}`} onClick={() => swiper.slidePrev()}>
                <img src={next} alt="Changer de slide" />
            </button>
        );
    };


    const handleToggleDescription = () => {
        if (windowSize[0] >= 900) {
            return;
        }
        setDescriptionOpen(!descriptionOpen);
    }

    const handleSelectWay = (swiperId) => {
        setSelectedWayId(swiperId);
    }

    const handleSelectAbility = (wayAbility) => {
        const { level } = wayAbility;

        // Check if the level of the ability matches the number of abilities already selected in the way
        const selectedWayAbilities = selectedWayAbilityId.filter( (id) => id !== wayAbility.id );

        // Get the selected way for the current ability
        const selectedWay = ways.find((way) => way.wayAbilities.includes(wayAbility));

        // Check if the selected ability is the first level in the way
        if (level === 1 && selectedWayAbilities.some((id) => selectedWay.wayAbilities.find((ability) => ability.id === id)?.level === 1)) {
            return;
        }

        // Check if the level of the ability matches the number of abilities already selected in the way
        if (level !== selectedWayAbilities.filter((id) => selectedWay.wayAbilities.find((ability) => ability.id === id)?.level < level).length + 1) {
            return;
        }

        // Check if the user has already selected a higher level ability in the same way
        if (selectedWayAbilities.some((id) => selectedWay.wayAbilities.find((ability) => ability.id === id)?.level > level)) {
            return;
        }

        setSelectedWayAbility(wayAbility);

        setSelectedAbilityNames((prevSelectedAbilityNames) => {
            if (prevSelectedAbilityNames.includes(wayAbility.name)) {
                // Ability is already selected, remove it and subtract its bonus from wayBonus
                setWayBonus((prevWayBonus) => ({
                    FOR: prevWayBonus.FOR - (wayAbility.bonus?.FOR || 0),
                    DEX: prevWayBonus.DEX - (wayAbility.bonus?.DEX || 0),
                    CON: prevWayBonus.CON - (wayAbility.bonus?.CON || 0),
                    INT: prevWayBonus.INT - (wayAbility.bonus?.INT || 0),
                    SAG: prevWayBonus.SAG - (wayAbility.bonus?.SAG || 0),
                    CHA: prevWayBonus.CHA - (wayAbility.bonus?.CHA || 0),
                    INIT: prevWayBonus.INIT - (wayAbility.bonus?.INIT || 0),
                    DEF: prevWayBonus.DEF - (wayAbility.bonus?.DEF || 0),
                    PV: prevWayBonus.PV - (wayAbility.bonus?.PV || 0),
                }));

                // Add the cost back to remaining points
                setRemainingPoints((prevPoints) => prevPoints + wayAbility.cost);

                // Remove the ability id from the array
                setSelectedWayAbilityId((prevSelectedWayAbilityId) =>
                    prevSelectedWayAbilityId.filter((id) => id !== wayAbility.id)
                );

                return prevSelectedAbilityNames.filter((name) => name !== wayAbility.name);
            } else {
                // Ability is not selected, check if there are enough points before adding it
                if (remainingPoints >= wayAbility.cost) {
                    // Deduct the cost from remaining points
                    setRemainingPoints((prevPoints) => prevPoints - wayAbility.cost);

                    // Add the ability and its bonus to selected abilities and wayBonus
                    setWayBonus((prevWayBonus) => ({
                        FOR: prevWayBonus.FOR + (wayAbility.bonus?.FOR || 0),
                        DEX: prevWayBonus.DEX + (wayAbility.bonus?.DEX || 0),
                        CON: prevWayBonus.CON + (wayAbility.bonus?.CON || 0),
                        INT: prevWayBonus.INT + (wayAbility.bonus?.INT || 0),
                        SAG: prevWayBonus.SAG + (wayAbility.bonus?.SAG || 0),
                        CHA: prevWayBonus.CHA + (wayAbility.bonus?.CHA || 0),
                        INIT: prevWayBonus.INIT + (wayAbility.bonus?.INIT || 0),
                        DEF: prevWayBonus.DEF + (wayAbility.bonus?.DEF || 0),
                        PV: prevWayBonus.PV + (wayAbility.bonus?.PV || 0),
                    }));

                    // Add the ability id to the array
                    setSelectedWayAbilityId((prevSelectedWayAbilityId) => [...prevSelectedWayAbilityId, wayAbility.id,]);

                    return [...prevSelectedAbilityNames, wayAbility.name];
                } else {
                    // There are not enough points, do nothing
                    return prevSelectedAbilityNames;
                }
            }
        });

        setSelectedAbilityTraits((prevSelectedAbilityTraits) => {
            const trait = wayAbility.traits;

            // Check if the trait is already selected
            const isSelected = prevSelectedAbilityTraits.includes(trait);

            if (isSelected) {
                // Trait is already selected, remove it
                return prevSelectedAbilityTraits.filter((t) => t !== trait);
            } else {
                // Trait is not selected, add it
                return [...prevSelectedAbilityTraits, trait];
            }
        });
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/api/ways/${classId}`)
            .then((response) => {
                setWays(response.data.ways);
                setWaysNumber(response.data.ways.length);
            })
            .catch((error) => {
                alert("Erreur API : Les données des voies n'ont pas pu être récupérées.");
                console.error(error);
            })
    }, []);


    return (
        <motion.div className="main way-main"
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100vh" }}
        transition={{ duration: 0.2 }}
        >
            <div className="stats-header">
                <div className="stats-header-mod">
                    {Object.entries(finalPrimaryStats).map((stat) => (
                        <div className="stat-info" key={stat}>
                            {stat[0]}
                            <div className="stat-mod">
                                {statModifiers[stat[0]] >= 0 ? "+" : ""}{statModifiers[stat[0]]}
                            </div>
                        </div>
                    ))}

                </div>
                <div className="stats-header-other">
                    {Object.entries(secondaryStats).map((stat) => (
                        
                        <div className={stat[0] === "DIST" || stat[0] === "CAC" || stat[0] === "MAG" ? "stat-type atk" : "stat-type def"} key={stat}>
                            <img className="stats-ways-icons" src={stat[0] === "PV" ? pv : stat[0] === "INIT" ? init : stat[0] === "AC" ? ac : stat[0] === "DIST" ? dist : stat[0] === "CAC" ? cac : mag} alt={stat[0]} />
                            <div className="stat-type-value">{stat[1]}</div>
                        </div>
                    ))}
                </div>
                <div className="way-points">
                    <button className="remaining-points">{remainingPoints}</button>
                    <div className="remaining-points-text">{remainingPoints > 1 ? "points disponibles" : "point disponible"}</div>
                </div>
            </div>
            {(windowSize[0] >= 900) && (
                <div className="way-changes-container-desktop">
                    {waySummary}
                </div>
            )}
            {waysNumber && (<Swiper
                loop={true}
                navigation={false}
                keyboard={true}
                mousewheel={false}
                breakpoints={{
                    0: {
                        slidesPerView: 1
                    },
                    1024: {
                        slidesPerView: 2
                    },
                    1440: {
                        slidesPerView: waysNumber
                    }}}
                onSlideChangeTransitionEnd={(swiper) => { handleSelectWay(swiper.realIndex) }}>
                {ways.map((way) => (
                    <SwiperSlide key={way.id}>
                        <div className="way-container">
                            <div className={wayNameClassnames} onClick={handleToggleDescription}>
                                <SwiperButtonPrev />
                                {way.name}
                                <button className={`${windowSize[0] >= 900 ? "way-button-wide" : descriptionOpen ? "way-button open" : "way-button"}`}
                                    onClick={handleToggleDescription}>
                                    &#9207;
                                </button>
                                <SwiperButtonNext />
                            </div>

                            {descriptionOpen && (
                                way.wayAbilities.map((wayAbility, index) => (
                                    <div className={`way-ability-container ${selectedAbilityNames.includes(wayAbility.name) ? 'selected' : ''}`} key={index} onClick={() => { handleSelectAbility(wayAbility) }}>
                                        <div className="way-ability">
                                            <div className="way-ability-name">
                                                {wayAbility.name}
                                                {wayAbility.limited && <>&nbsp;&#x24c1;</>}
                                                <div className="way-ability-level">
                                                    Level {wayAbility.level}
                                                </div>
                                            </div>
                                            <div className="way-ability-description">
                                                {wayAbility.description}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>)}

            {(!descriptionOpen) && (
                <div className="way-changes-container">
                    {waySummary}
                </div>
            )}

            <Link to="/apercu">
                <img
                    className="next-page next-page-ways"
                    src={next}
                    alt="Chevron pointing down for the next page"
                />
            </Link>
        </motion.div>


    );
};

export default Way;