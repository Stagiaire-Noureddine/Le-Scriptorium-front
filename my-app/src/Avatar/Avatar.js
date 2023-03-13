import { useContext } from "react";
import { SheetContext } from "../SheetContext";
import { useLocation } from "react-router-dom";
import raceImages from '../Race/raceImages.js';
import "./Avatar.scss";


const Avatar = () => {

    const {
        raceName,
    } = useContext(SheetContext);

    let location = useLocation();

    const shouldShowAvatar = [
        "/general",
        "/generation-des-stats",
        "/stats",
        "/voies",
    ].includes(location.pathname);

    
    console.log()
 
    return (    
        <div>
            {shouldShowAvatar && (
                <div className="avatar">
                    <img className="avatar-image" src={raceImages[raceName]} alt={raceName} />
                </div>
            )}
        </div>
    );
}

export default Avatar;