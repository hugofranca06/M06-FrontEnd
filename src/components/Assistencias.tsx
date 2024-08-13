// src/components/Assistencias.tsx

import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import LogoComponent from "./LogoComponent";

const Assistencias: React.FC = () => {
  const { assistencias } = useContext(AppContext);

  return (
    <div className="container">
      <LogoComponent />
      <h2>Assistências</h2>
      <div className="card-t">
      <div className="card-container-assistencia">
        {assistencias.map((assistencia) => (
          <div key={assistencia.id} className="card">
            <p className="card-title">{assistencia.nome}</p>
            <p className="card-text">Início: {assistencia.inicioExpediente}</p>
            <p className="card-text">Fim: {assistencia.fimExpediente}</p>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default Assistencias;