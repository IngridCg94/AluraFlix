import React, { useState, useEffect } from "react";
import "../styles/AddModal.css";

function AddModal({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    videoUrl: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cargar categorías desde el servidor
    fetch("http://localhost:3001/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error al cargar las categorías:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const extractYouTubeThumbnail = (url) => {
    try {
      const videoId = new URL(url).searchParams.get("v");
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (error) {
      console.error("Invalid YouTube URL", error);
      return ""; // Retorna una miniatura por defecto si la URL no es válida
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extraer la miniatura del video
    const thumbnail = extractYouTubeThumbnail(formData.videoUrl);

    // Pasar los datos al método onAdd con la miniatura incluida
    onAdd({ ...formData, image: thumbnail });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Nuevo Video</h2>
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="videoUrl">Enlace del Video (YouTube)</label>
            <input
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=example"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-buttons">
            <button type="submit" className="submit-btn">
              Agregar Video
            </button>
            <button type="button" className="clear-btn" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;