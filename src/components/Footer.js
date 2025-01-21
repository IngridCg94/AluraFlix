import React from "react";
import "../styles/Footer.css";
import logo from "../assets/imagenes/Logo.5e7b3578.png"; // Ajusta la ruta según dónde esté la imagen

function Footer() {
  return (
    <footer className="footer">
      <img src={logo} alt="Aluraflix" className="logo" />
      <p>&copy; 2025 Aluraflix. Todos los derechos reservados.</p>
    </footer>
  );
}

export default Footer;