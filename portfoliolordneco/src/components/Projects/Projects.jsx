// src/components/Projects/Projects.jsx
import React, { useState, useEffect } from 'react';
import './Projects.scss';

// URL base do backend (onde ficam as imagens)
const API_URL = 'https://portfolioback-end-9qjt.onrender.com';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  // Busca os projetos da API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/projetos`);
        
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar projetos:', err);
        setError('Não foi possível carregar os projetos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleImageError = (projectId) => {
    setImageErrors(prev => ({ ...prev, [projectId]: true }));
  };

  // Monta a URL completa da imagem
  const getImageUrl = (imagem) => {
    if (!imagem) return null;
    // Se já for URL completa (http), usa direto (caso do Cloudinary no futuro)
    if (imagem.startsWith('http')) return imagem;
    // Senão, concatena com a URL do backend
    return `${API_URL}${imagem}`;
  };

  // Estado de loading
  if (loading) {
    return (
      <section id="projetos" className="projects section-transition">
        <div className="container">
          <h2 className="section-title">Projetos</h2>
          <div className="loading-projects">
            <div className="spinner"></div>
            <p>Carregando projetos...</p>
          </div>
        </div>
      </section>
    );
  }

  // Estado de erro
  if (error) {
    return (
      <section id="projetos" className="projects section-transition">
        <div className="container">
          <h2 className="section-title">Projetos</h2>
          <div className="error-message">
            <p>⚠️ {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projetos" className="projects section-transition">
      <div className="container">
        <h2 className="section-title">Projetos</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                {!imageErrors[project.id] ? (
                  <img 
                    src={getImageUrl(project.imagem)} 
                    alt={project.nome}
                    className="project-img"
                    onError={() => handleImageError(project.id)}
                  />
                ) : (
                  <span className="project-emoji">🚀</span>
                )}
              </div>
              <div className="project-info">
                <h3 className="project-name">{project.nome}</h3>
                <p className="project-description">{project.descricao}</p>
                <div className="project-buttons">
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-button github-btn"
                  >
                    📦 GitHub
                  </a>
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-button live-btn"
                  >
                    🌐 Ver Site
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;