import React, { useState, useEffect } from 'react';
import './Projects.scss';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  
  // Estados dos Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortOrder, setSortOrder] = useState('recentes');

  const API_BASE_URL = 'https://portfolioback-end-9qjt.onrender.com';
  const API_URL = `${API_BASE_URL}/projetos`;

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) throw new Error('Falha ao buscar os projetos');
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erro na API:', err);
        setError('Não foi possível carregar os projetos no momento.');
        setLoading(false);
      });
  }, [API_URL]);

  const handleImageError = (projectId) => {
    setImageErrors((prev) => ({ ...prev, [projectId]: true }));
  };

  // Extrai as categorias únicas do banco de dados
  const categorias = ['Todos', ...new Set(projects.map((p) => p.categoria || 'Geral'))];

  // Lógica de Filtro e Ordenação
  const projetosProcessados = projects
    .filter((project) => {
      const matchesCategory = selectedCategory === 'Todos' || (project.categoria || 'Geral') === selectedCategory;
      const termo = searchTerm.toLowerCase();
      const matchesSearch = 
        project.nome.toLowerCase().includes(termo) || 
        (project.descricao && project.descricao.toLowerCase().includes(termo));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'recentes') return b.id - a.id;
      if (sortOrder === 'antigos') return a.id - b.id;
      if (sortOrder === 'az') return a.nome.localeCompare(b.nome);
      return 0;
    });

  if (loading) {
    return (
      <section id="projetos" className="projects section-transition">
        <div className="container">
          <h2 className="section-title">Projetos</h2>
          <div className="loading-projects">
            <div className="spinner"></div>
            <p>Carregando projetos incríveis...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projetos" className="projects section-transition">
        <div className="container">
          <h2 className="section-title">Projetos</h2>
          <div className="error-message">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projetos" className="projects section-transition">
      <div className="container">
        <h2 className="section-title">Projetos</h2>

        {/* ÁREA DE BUSCA E FILTROS (NOVO LAYOUT) */}
        <div className="search-filter-container">
          <div className="filter-row">
            
            {/* Input de Busca */}
            <input
              type="text"
              className="search-input"
              placeholder="🔍 Buscar por nome ou palavra-chave..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Select de Categoria */}
            <select 
              className="filter-select" 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categorias.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Select de Ordenação */}
            <select 
              className="filter-select" 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="recentes">Mais Recentes</option>
              <option value="antigos">Mais Antigos</option>
              <option value="az">Nome (A - Z)</option>
            </select>

          </div>
        </div>

        <div className="projects-grid">
          {projetosProcessados.length > 0 ? (
            projetosProcessados.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-image">
                  {!imageErrors[project.id] && project.imagem ? (
                    <img 
                      src={`${API_BASE_URL}${project.imagem}`} 
                      alt={project.nome}
                      className="project-img"
                      onError={() => handleImageError(project.id)}
                    />
                  ) : (
                    <span className="project-emoji">💻</span>
                  )}
                </div>
                <div className="project-info">
                  {project.categoria && (
                    <span className="project-category">{project.categoria}</span>
                  )}
                  
                  <h3 className="project-name">{project.nome}</h3>
                  <p className="project-description">{project.descricao}</p>
                  
                  <div className="project-buttons">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-button github-btn">
                      📦 GitHub
                    </a>
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-button live-btn">
                      🌐 Ver Site
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>Nenhum projeto encontrado para essa busca. 😕</p>
              <button onClick={() => { setSearchTerm(''); setSelectedCategory('Todos'); }}>
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Projects;