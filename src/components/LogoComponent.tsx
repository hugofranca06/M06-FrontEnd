import logo from '/src/components/img/logo4.png';
import React from 'react';

const LogoComponent: React.FC = () => {
    return (
      <div className="logo-container">
        <img src={logo} alt="Assistech Logo" className="logo" />
      </div>
    );
  };
  
  export default LogoComponent;