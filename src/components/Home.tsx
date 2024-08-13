import React from 'react';
import { Link } from 'react-router-dom';
import LogoComponent from './LogoComponent';

const Home: React.FC = () => {
  return (
    <div className="container">
      <LogoComponent />
      <div className='container-section'>

      <div className='section'>
        <img src='/src/components/img/img.png' alt="" className='section-image'/>
        <div className='content'>
          <h2>Marque seu agendamento</h2>
          <p>Marque seu agendamento</p>
          <div className='button-container'>

        <Link to="/agendar" className="section-button">
          Agendar
        </Link>
          </div>
        </div> 
      </div>

      <div className='section'>
        <div className='content'>
          <h2>Cadastre sua Assistência</h2>
          <p>Cadastre sua assistência</p>
          <div className='button-container'>
          <Link to="/cadastrar-assistencia" className="section-button">
          Cadastrar Assistência
        </Link>
          </div>
        </div> 
        <img src='/src/components/img/img.png' alt="" className='section-image'/>
      </div>
      </div>
    </div>
  );
};

export default Home;