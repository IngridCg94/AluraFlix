import React, { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/imagenes/Logo.5e7b3578.png"; // Ajusta la ruta según dónde esté la imagen

function Header({ onHome, onNewVideo, onSearchChange }) {
  const [isSearchVisible, setIsSearchVisible] = useState(false); // Estado para mostrar/ocultar el input
  return (
    <header className="header">
      <img src={logo} alt="Aluraflix" className="logo" />
      <nav className="nav">
        {/* Botón para abrir el campo de búsqueda */}
        <button
          onClick={() => setIsSearchVisible(!isSearchVisible)}
          className="search-btn"
        >
          🔍
        </button>
        {/* Input para escribir el término de búsqueda */}
        {isSearchVisible && (
          <input
            type="text"
            placeholder="Buscar..."
            onChange={onSearchChange}
            className="search-input"
          />
        )}
        <button onClick={onHome} className="nav-link new-video-btn">Home</button>
        <button onClick={onNewVideo} className="nav-link new-video-btn">Nuevo Video</button>
      </nav>
    </header>
  );
}

export default Header;
