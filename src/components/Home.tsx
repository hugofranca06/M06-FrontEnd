import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home">
      <h1>ASSISTECH</h1>
      <div className="home-links">
        <Link to="/agendar" className="home-button">
          Agendar
        </Link>
        <Link to="/cadastrar-assistencia" className="home-button">
          Cadastrar Assistência
        </Link>
      </div>
    </div>
  );
};

export default Home;