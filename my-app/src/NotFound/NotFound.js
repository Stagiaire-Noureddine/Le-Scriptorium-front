import notFound from '../assets/images/notFound.png';
import './NotFound.scss';

import {motion} from "framer-motion";

function NotFound() {
  return (
    <div className="not-found">
      <img src={notFound} alt="Page not found" />
      <h1 className="error-code">404</h1>
      <p>"Bienvenue dans la forêt du Scriptorium, aventuriers. Mais je crains que vous vous soyez égarés. Le roi de la forêt m'a chargé de vous demander de partir immédiatement. Cette clairière est sacrée pour lui et il ne permettra pas que des étrangers la profanent. Partez maintenant et peut-être qu'il vous montrera une meilleure voie..."</p>
    </div>
  );
}

export default NotFound;
