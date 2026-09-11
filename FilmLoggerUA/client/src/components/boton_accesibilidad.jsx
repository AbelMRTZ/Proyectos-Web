import { useNavigate } from "react-router-dom";
import accessIcon from "../img/accesibilidad.png"; // tu imagen

import "../css/boton_accesibilidad.css";

const AccessibilityButton = () => {
  const navigate = useNavigate();

  return (
    <button
      className="accessibility-fab"
      onClick={() => navigate("/accesibilidad")}
      aria-label="Accesibilidad"
    >
      <img src={accessIcon} alt="Accesibilidad" />
    </button>
  );
};

export default AccessibilityButton;