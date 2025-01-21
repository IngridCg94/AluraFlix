import React, { useEffect, useState } from 'react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const API_BASE_URL = "https://courageous-panoramic-challenge.glitch.me";

  useEffect(() => {
    // Cargar categorías
    fetch(`${API_BASE_URL}/categories`)
      .then((response) => response.json())
      .then((data) => setCategories(data));

    // Cargar videos
    fetch(`${API_BASE_URL}/videos`)
      .then((response) => response.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div>
      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <div className="video-grid">
            {videos
              .filter((video) => video.category === category.name)
              .map((video) => (
                <div key={video.id} className="video-card">
                  <img src={video.image} alt={video.title} />
                  <h3>{video.title}</h3>
                  <p>{video.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;