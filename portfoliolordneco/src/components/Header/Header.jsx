import React, { useState, useEffect, useRef } from 'react';
import './Header.scss';

function Header({ darkMode, toggleDarkMode }) {
  const [activeSection, setActiveSection] = useState('inicio');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // Estados para o Portal Secreto
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimer = useRef(null);
  const progressInterval = useRef(null);
  const adminUrl = 'https://portfolioback-end-9qjt.onrender.com/login';

  useEffect(() => {
    audioRef.current = new Audio('/musicas/Breath of Fire IV - A Warring God.mp3');
    audioRef.current.loop = true;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.log('Erro:', error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'sobre', 'projetos'];
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==========================================
  // LÓGICA DO PORTAL SECRETO (Hold 2 segundos)
  // ==========================================
  const startHold = (e) => {
    // Previne comportamentos estranhos no touch
    if (e.cancelable) e.preventDefault();
    
    setHoldProgress(0);
    
    // Animação da barrinha de progresso
    progressInterval.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2; // Aumenta 2% a cada 50ms (total 2 segundos)
      });
    }, 50);

    // Timer para abrir a janela
    holdTimer.current = setTimeout(() => {
      clearInterval(progressInterval.current);
      setHoldProgress(0);
      
      // Efeito visual de "acesso liberado"
      document.body.style.transition = 'filter 0.3s';
      document.body.style.filter = 'invert(1) hue-rotate(90deg)';
      
      setTimeout(() => {
        document.body.style.filter = 'none';
        window.open(adminUrl, '_blank');
      }, 300);
      
    }, 2000); 
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (progressInterval.current) clearInterval(progressInterval.current);
    setHoldProgress(0);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <span 
            className="logo-text gradient-title"
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            title="Segure para acessar o portal..."
          >
            Portfólio Lord Neco
            {/* Barrinha de progresso que aparece ao segurar */}
            <span 
              className="secret-progress-bar" 
              style={{ width: `${holdProgress}%`, opacity: holdProgress > 0 ? 1 : 0 }}
            ></span>
          </span>
        </div>
        
        <nav className="nav">
          <button className={`nav-link ${activeSection === 'inicio' ? 'active' : ''}`} onClick={() => scrollToSection('inicio')}>Inicio</button>
          <button className={`nav-link ${activeSection === 'sobre' ? 'active' : ''}`} onClick={() => scrollToSection('sobre')}>Sobre</button>
          <button className={`nav-link ${activeSection === 'projetos' ? 'active' : ''}`} onClick={() => scrollToSection('projetos')}>Projetos</button>
        </nav>
        
        <div className="header-controls">
          <button className="music-player" onClick={toggleMusic}>
            {isPlaying ? '🎵' : '🎧'}
            <span className="music-text">{isPlaying ? 'Tocando' : 'Tocar Música'}</span>
          </button>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;