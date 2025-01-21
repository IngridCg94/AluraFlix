import React from "react";
import "../styles/VideoList.css"; // Asegúrate de tener estilos si los necesitas.

function VideoList({ videos }) {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div className="video-card" key={video.id}>
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
            <img src={video.image} alt={video.title} className="video-thumbnail" />
          </a>
          <h3>{video.title}</h3>
          <p>{video.description}</p>
          <span className="video-category">{video.category}</span>
        </div>
      ))}
    </div>
  );
}

export default VideoList;