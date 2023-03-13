import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../GlobalContext";
import { SheetContext } from "../SheetContext";
import { useSwipeable } from "react-swipeable";
import { Link } from "react-router-dom";
import raceImages from './raceImages.js';
import mobileRaceImages from './mobileRaceImages.js';
import "./Frame.scss";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Frame = ({ name, description, picture, racialAbilities, raceIndex, handleRaceClick, expanded, setExpanded, isLast }) => {
  const {
    selectedRace,
    setSelectedRace,
    selectedRaceAbility,
    setSelectedRaceAbility,
  } = useContext(GlobalContext);

  const {
    selectedRaceAbilityId,
    setSelectedRaceAbilityId
  } = useContext(SheetContext);

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      setSelectedRace(selectedRace === name ? null : name);
    },
    delta: 200,
  });

  const handleClick = () => {
    handleRaceClick(raceIndex);
    setExpanded((prevExpanded) => {
      // collapse the card if it's already expanded
      if (prevExpanded === raceIndex) {
        return null;
      }
      return raceIndex;
    });
  };

  const handleRaceAbilityClick = (raceAbility) => {
    console.log(raceAbility);
    setSelectedRaceAbility((prevSelectedRaceAbility) => {
      if (prevSelectedRaceAbility === raceAbility.name) {
        return "";
      } else {
        return raceAbility.name;
      }
    });
    setSelectedRaceAbilityId(raceAbility.id);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  }));  

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isMobile = screenWidth < 600;


  return (
    <div>
      <Card
       className="race-header"
      sx={{ maxWidth: 1, width: expanded ? 1 : 3/5 , transition: 'width 0.35s'}}>
      <Box 
        className="race-box"
        expand={expanded}
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <CardMedia
          component="img"
          height="60"
          image={isMobile ? mobileRaceImages[name] : raceImages[name]}
          alt={name}
          className="race-picture"
        />
        <Box
        className="race-title"
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "6px",
            height: "4vh",
            width: "40vw",
            color: "white",
            fontSize: "1.5rem",
          }}
        >
          <p>{name}</p>
        </Box>
      </Box>
        <Collapse
        className="race-collapse"
        in={expanded}
        sx={{ maxHeight: 420, backgroundColor: "rgba(0, 0, 0)"}}
        timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph className="race-content">{description}</Typography>
              <CardContent>
              {racialAbilities?.[0]?.name && (
              <Link to="/general">
              <button
                className={`race-bonus ${
                  selectedRaceAbility === racialAbilities[0].name
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  handleRaceAbilityClick(racialAbilities[0]);
                }}
              >
                {racialAbilities[0].description}
              </button>
              </Link>
            )}
            {racialAbilities?.[1]?.name && (
              <Link to="/general">
                <button
                  className={`race-bonus ${
                    selectedRaceAbility === racialAbilities[1].name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    handleRaceAbilityClick(racialAbilities[1]);
                  }}
                >
                  {racialAbilities[1].description}
                </button>
              </Link>
            )}
              </CardContent>
            </CardContent>
        </Collapse>
      </Card>


      {/* <div className="race-header" onClick={handleClick} {...handlers}>
      <img className="race-picture" src={raceImages[name]} alt={name} />
        <h3 className="race-title">{name}</h3>
      </div>

      {selectedRace === raceIndex && (
        <div className="race-content">
          <p>{description}</p>
          <div className="race-bonuses">
            {racialAbilities?.[0]?.name && (
              <Link to="/general">
              <button
                className={`race-bonus ${
                  selectedRaceAbility === racialAbilities[0].name
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  handleRaceAbilityClick(racialAbilities[0]);
                }}
              >
                {racialAbilities[0].description}
              </button>
              </Link>
            )}
            {racialAbilities?.[1]?.name && (
              <Link to="/general">
                <button
                  className={`race-bonus ${
                    selectedRaceAbility === racialAbilities[1].name
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    handleRaceAbilityClick(racialAbilities[1]);
                  }}
                >
                  {racialAbilities[1].description}
                </button>
              </Link>
            )}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Frame;
