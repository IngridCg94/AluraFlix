import React, { useEffect, useState } from "react";
import "../styles/Banner.css";

function Banner({ videos }) {
  const [latestVideo, setLatestVideo] = useState(null);

  useEffect(() => {
    if (videos && videos.length > 0) {
      const sortedVideos = [...videos].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp) // Ordenar por timestamp
      );
      setLatestVideo(sortedVideos[0]); // Seleccionar el más reciente
    }
  }, [videos]);

  return (
    <div className="banner">
      {latestVideo ? (
        <div className="banner-content-wrapper">
          <div className="banner-text">
            <h1>Video Destacado</h1>
            <h2>{latestVideo.title}</h2>
            <p>{latestVideo.description}</p>
          </div>
          <a
            href={latestVideo.videoUrl} // Enlace al video
            target="_blank"
            rel="noopener noreferrer"
            className="banner-thumbnail-link"
          >
            <img
              src={latestVideo.image} // Miniatura del video
              alt={latestVideo.title}
              className="banner-thumbnail"
            />
          </a>
        </div>
      ) : (
        <div className="banner-placeholder">
          <h1>Video Destacado</h1>
          <p>Explora este increíble video y aprende algo nuevo hoy.</p>
        </div>
      )}
    </div>
  );
}

export default Banner;