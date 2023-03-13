import { useState, useEffect, useContext } from "react";

import SwiperCore, { Navigation, Keyboard, Mousewheel } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ImageListItemBar } from '@mui/material';

import { GlobalContext } from "../GlobalContext";
import { SheetContext } from "../SheetContext";

import {motion} from "framer-motion";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/keyboard";
import "swiper/css/mousewheel";

import "./../reset.css";
import "./Class.scss";

import next from "./../assets/images/next.png";
import equipmentIcon from "./../assets/images/equipment.png";
import arquebusier from "./../assets/images/classes-images/arquebusier.png";
import barbare from "./../assets/images/classes-images/barbare.png";
import barde from "./../assets/images/classes-images/barde.png";
import guerrier from "./../assets/images/classes-images/guerrier.png";
import moine from "./../assets/images/classes-images/moine.png";


SwiperCore.use([ Navigation, Keyboard, Mousewheel ]);

const Class = () => {
    const {
        classes,
        setClasses,
        selectedClass,
        classesStats,
        setClassStats,
        setClassBonus,
        handleSelectClass,
    } = useContext(GlobalContext);
    const {
        equipment,
        setEquipment,
    } = useContext(SheetContext);
    const [equipmentModal, setEquipmentModal] = useState(false);

    const equipmentElement = equipment[selectedClass] && (
        <div className="equipment-container">
        {equipment[selectedClass].map((equipment, index) => (
            <div className="equipment-item" key={index}>
                <div className="equipment-item-title" key={index}>
                    <img className="equipment-item-title-img" src="https://fakeimg.pl/30x30/000/" alt="Classe" />
                    <p className="equipment-item-title-name">{equipment.name} x{equipment.number}</p>
                </div>
                <p className="equipment-item-description">{equipment.description}</p>
            </div>
        ))}
        </div>
    );

    const chosenPicture = classes[selectedClass] && (classes[selectedClass].name.toLowerCase());

    const handleToggleEquipment = () => {
        setEquipmentModal(!equipmentModal);
    };

    useEffect(() => {
        axios.get("https://jdr-api.com/api/classes")
        .then((response) => {
            const classData = response.data.classes;
            console.log(classData);
            setClasses(classData);
            const statsData = classData.map((classObject) => ({
                class: classObject.name,
                stat: Object.entries(classObject.stats).map((stat) => ({
                    name: stat[0],
                    isRecommended: stat[1]
                })),
            }));
            setClassStats(statsData);
            const equipmentData  = classData.map((classObject) => (
                classObject.equipments
            ));
            setEquipment(equipmentData);
            const classBonusData = classData.map((classObject) => ({
                PV: classObject.hit_die
            }));
            console.log(classBonusData);
            setClassBonus(classBonusData);
        })
        .catch((error) => {
            alert("Erreur API : Les données des classes n'ont pas pu être récupérées.");
            console.error(error);
        })
    }, []);

    // console.log(chosenPicture);

    return (
        <motion.div 
        className="class-container"
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-100vh" }}
        transition={{ duration: 0.2 }}
        layout="constrained"
        >
            <h1 className="class-title">
                Choisissez votre classe
            </h1>
            <div className="class-img-description-equipment">
                <div className="class-img-container">
                    <button className="equipment-button" onClick={handleToggleEquipment}>
                        <img className="equipment-button-img" src={equipmentIcon} alt="Classe" />
                    </button>
                    {equipmentModal && (
                        <div className="equipment-modal">
                            {equipmentElement}
                        </div>
                    )}
                    <img className="class-img" src={barde} alt={classes[selectedClass] && (classes[selectedClass].name)} /> {/* src={chosenPicture} || {classes[selectedClass] && (classes[selectedClass].picture)} */}
                        <ImageListItemBar
                        sx={{
                            background: "linear-gradient(90deg, rgba(255,255,255,0) 15%, rgba(0,0,0,1) 50%, rgba(255,255,255,0) 85%)"
                        }}
                        title=
                            <div className="class-stat">
                                {classesStats[selectedClass] && (classesStats[selectedClass].stat.map((statObj, index) => (
                                    <span className={statObj.isRecommended ? "class-stat-name recommended" : "class-stat-name"}
                                        key={index}>
                                            {statObj.name.substr(0, 3)}
                                    </span>  
                                )))}
                            </div> />
                    
                </div>

                <div className="class-description">
                {classes[selectedClass] && (
                    <p className="class-description-text">
                        {classes[selectedClass].description}
                    </p>
                )}
                    <div className="class-description-equipment">
                        {equipmentElement}
                    </div>
                    <div className="class-choice">
                        <Link to="/races">
                            <button className="class-choice-button">
                                Choisir la classe {classes[selectedClass] && classes[selectedClass].name}
                            </button>
                        </Link>
                    </div> 
                </div>
            </div>
            <Swiper
                className="class-carrousel"
                loop={true}
                keyboard={true}
                mousewheel={true}
                centeredSlides={true}
                slidesPerView={3}
                spaceBetween={3}
                slideToClickedSlide={true}
                onRealIndexChange={(swiper) => {handleSelectClass(swiper.realIndex)}}
                onSlideChange={(swiper) => {handleSelectClass(swiper.realIndex)}}
                breakpoints={{
                    550: {
                        slidesPerView: 5,
                    },
                    900: {
                        slidesPerView: 7
                    }
                }}>
                {classes.map((classObj) => (
                    <SwiperSlide key={classObj.id}>
                        <div className="class-carrousel-item">
                            <img className="class-carrousel-img" src={barde} alt={classObj.name} /> {/* src={classObj.picture} */}
                            {/* <div className="class-carrousel-img" style={{background:`url(${barde}) 0`}}></div> */}
                            <p className="class-carrousel-title">{classObj.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <Link to="/races">
                <img
                className="next-page next-page-classes"
                src={next}
                alt="Chevron pointing down for the next page"
                />
            </Link>
        </motion.div>
    );
};

export default Class;