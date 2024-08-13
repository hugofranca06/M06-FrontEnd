import React from 'react';

import { Link } from 'react-router-dom';



const Navigation: React.FC = () => {
  return (
    <nav>
      <ul  className='nav-list'>
        
        <li><Link to="/admin" className='nav-item active'>Admin</Link></li>
        <div className='nav-list-right'>
        <li><Link to="/" className='nav-item'>Home</Link></li>
        <li><Link to="/agendar" className='nav-item'>Agendar</Link></li>
        <li><Link to="/assistencias" className='nav-item'>Assistências</Link></li>
        <li><Link to="/cadastrar-assistencia" className='nav-item'>Cadastrar Assistência</Link></li>
        <li><Link to="/cliente" className='nav-item'>Cliente</Link></li>
        <li><Link to="/registrar" className='nav-item active'>Registrar</Link></li>
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;