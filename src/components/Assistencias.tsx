// src/components/Assistencias.tsx

import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Assistencias: React.FC = () => {
  const { assistencias } = useContext(AppContext);

  return (
    <div>
      <h2>Assistências</h2>
      <div className="card-container">
        {assistencias.map((assistencia) => (
          <div key={assistencia.id} className="card">
            <h3>{assistencia.nome}</h3>
            <p>Início: {assistencia.inicioExpediente}</p>
            <p>Fim: {assistencia.fimExpediente}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assistencias;