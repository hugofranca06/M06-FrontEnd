import React from 'react';

import { Link } from 'react-router-dom';



const Navigation: React.FC = () => {
  return (
    <nav>
      <ul>
        
        <li><Link to="/admin" className='admin-link'>Admin</Link></li>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/agendar">Agendar</Link></li>
        <li><Link to="/assistencias">Assistências</Link></li>
        <li><Link to="/cadastrar-assistencia">Cadastrar Assistência</Link></li>
        <li><Link to="/cliente">Cliente</Link></li>
        <li><Link to="/registrar">Registrar</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;