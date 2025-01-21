import React, { useState, useEffect } from "react";
import Header from "./components/Header.js";
import Banner from "./components/Banner.js";
import Footer from "./components/Footer.js";
import AddModal from "./components/AddModal.js";
import EditModal from "./components/EditModal.js"; // Importar el modal de edición
import "./App.css";
import "./styles/VideoList.css"; // Estilos para las cards

function App() {
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Estado para el modal de edición
  const [editVideo, setEditVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  useEffect(() => {
    // Cargar categorías y videos desde el backend
    const fetchCategoriesAndVideos = async () => {
      try {
        const [categoriesRes, videosRes] = await Promise.all([
          fetch("http://localhost:3001/categories"),
          fetch("http://localhost:3001/videos"),
        ]);

        if (!categoriesRes.ok || !videosRes.ok) {
          throw new Error("Error al cargar categorías o videos");
        }

        const categoriesData = await categoriesRes.json();
        const videosData = await videosRes.json();

        // Vincular videos a sus categorías
        const categoriesWithVideos = categoriesData.map((category) => {
          const categoryVideos = videosData.filter(
            (video) => video.category === category.name
          );
          return { ...category, videos: categoryVideos };
        });

        setCategories(categoriesWithVideos);
      } catch (error) {
        console.error("Error al cargar las categorías y videos:", error);
      }
    };

    fetchCategoriesAndVideos();
  }, []);

  // Obtener todos los videos combinados
  const allVideos = categories.flatMap((category) => category.videos || []);

  // Manejar el término de búsqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // Filtrar las categorías según el término de búsqueda
  const filteredCategories = categories.map((category) => ({
    ...category,
    videos: category.videos.filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm) ||
        category.name.toLowerCase().includes(searchTerm)
    ),
  }));

  // Verificar si hay resultados
  const hasResults = filteredCategories.some((category) => category.videos.length > 0);

  const handleAddVideo = (newVideo) => {
    const videoWithTimestamp = { ...newVideo, timestamp: new Date().toISOString() }; // Agregar timestamp
    const url = videoWithTimestamp.id
      ? `http://localhost:3001/videos/${videoWithTimestamp.id}`
      : "http://localhost:3001/videos";

    const method = videoWithTimestamp.id ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(videoWithTimestamp),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al guardar el video");
        }
        return response.json();
      })
      .then((data) => {
        setCategories((prevCategories) => {
          const updatedCategories = prevCategories.map((category) => {
            if (category.name === data.category) {
              const updatedVideos = videoWithTimestamp.id
                ? category.videos.map((video) =>
                    video.id === videoWithTimestamp.id ? data : video
                  )
                : [...(category.videos || []), data];

              return { ...category, videos: updatedVideos };
            }

            if (
              videoWithTimestamp.id &&
              category.videos?.some((video) => video.id === videoWithTimestamp.id)
            ) {
              return {
                ...category,
                videos: category.videos.filter(
                  (video) => video.id !== videoWithTimestamp.id
                ),
              };
            }

            return category;
          });

          if (!videoWithTimestamp.id) {
            const existingCategory = updatedCategories.find(
              (cat) => cat.name === data.category
            );
            if (!existingCategory) {
              updatedCategories.push({
                id: data.categoryId || new Date().getTime(),
                name: data.category,
                videos: [data],
              });
            }
          }

          return updatedCategories;
        });

        setEditVideo(null);
      })
      .catch((error) => {
        console.error("Error al guardar el video:", error);
      });
  };

  const handleDeleteVideo = (videoId, categoryName) => {
    fetch(`http://localhost:3001/videos/${videoId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al borrar el video");
        }

        // Actualizar las categorías después de borrar
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.name === categoryName
              ? {
                  ...category,
                  videos: category.videos.filter((video) => video.id !== videoId),
                }
              : category
          )
        );

        console.log("Video borrado con éxito:", videoId);
      })
      .catch((error) => {
        console.error("Error al borrar el video:", error);
      });
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (video) => {
    setEditVideo(video);
    setIsEditModalOpen(true); // Abrir el modal de edición
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditVideo(null);
    setIsEditModalOpen(false); // Cerrar el modal de edición
  };

  return (
    <div className="App">
      <Header
        onNewVideo={() => setIsAddModalOpen(true)}
        onSearchChange={handleSearch} // Conectar la búsqueda
      />
      <Banner videos={allVideos} /> {/* Pasar todos los videos al Banner */}

      <div className="categories">
        {hasResults ? (
          filteredCategories.map((category) =>
            category.videos.length > 0 ? (
              <div key={category.id} className="category">
                <h2>{category.name}</h2>
                <div className="videos">
                  {category.videos.map((video) => (
                    <div key={video.id} className="video-card">
                      <a
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-link"
                      >
                        <img
                          src={video.image}
                          alt={video.title}
                          className="video-thumbnail"
                        />
                        <div className="video-info">
                          <h3>{video.title}</h3>
                          <p>{video.description}</p>
                        </div>
                      </a>
                      <div className="video-actions">
                        <button
                          onClick={() => handleOpenEditModal(video)} // Abrir el modal de edición
                          className="edit-btn"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video.id, category.name)}
                          className="delete-btn"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null
          )
        ) : (
          <p className="no-results">No hay resultados de búsqueda.</p>
        )}
      </div>

      <Footer />

      {/* Modal para añadir un nuevo video */}
      {isAddModalOpen && (
        <AddModal
          onAdd={handleAddVideo}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Modal para editar un video */}
      {isEditModalOpen && (
        <EditModal
          videoData={editVideo}
          onSave={handleAddVideo}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}

export default App;