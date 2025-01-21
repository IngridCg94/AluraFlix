import React, { useState } from "react";
import "../styles/EditModal.css";

function EditModal({ videoData, onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: videoData?.title || "",
    category: videoData?.category || "",
    description: videoData?.description || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClear = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...videoData, // Mantener campos inalterables como image y videoUrl
      title: formData.title,
      category: formData.category,
      description: formData.description,
    });
    onClose(); // Cierra el modal después de guardar
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Video</h2>
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
              <option value="">Seleccionar</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Innovación">Innovación</option>
              <option value="Gestión">Gestión</option>
            </select>
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
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Guardar
            </button>
            <button
              type="button"
              className="clear-btn"
              onClick={handleClear}
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
