// src/components/CadastrarAssistencia.tsx

import React, { useState, useContext } from "react";
import { PostAssistencia } from "../shared/interfaces";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import LogoComponent from "./LogoComponent";

const generateTimeOptions = () => {
  const options = [];

  for (let hours = 0; hours < 24; hours++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      options.push(`${formattedHours}:${formattedMinutes}`);
    }
  }

  return options;
};

const opcoesHora = generateTimeOptions();


const CadastrarAssistencia: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const [postAssistencia, setPostAssistencias] = useState<PostAssistencia>({
    nome: '',
    inicioExpediente: '',
    fimExpediente: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAssistenciaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setPostAssistencias(prevState => ({
      ...prevState, 
      [name]: value, 
    }));
  };

  const handleAssistenciaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post<PostAssistencia>('http://localhost:8080/assistencias', postAssistencia);
      setMessage({ type: 'success', text: 'Assistência criada com sucesso' });
      refreshData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar assistência' });
    }
  };

  return (
    <div className="container">
      <LogoComponent />
      <h2>Cadastrar Assistência</h2>
      <div className="form-container-agendar">

      <form onSubmit={handleAssistenciaSubmit}>
        <div>
          <label>
            Nome: 
            <input type="text" name='nome' value={postAssistencia.nome} required onChange={handleAssistenciaChange}/>
          </label>
        </div>
        <div>
            <label>
              Início de expediente: 
              <select name='inicioExpediente' value={postAssistencia.inicioExpediente} required onChange={handleAssistenciaChange}>
                <option value="">Selecione</option>
                {opcoesHora.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label>
              Fim de expediente: 
              <select name='fimExpediente' value={postAssistencia.fimExpediente} required onChange={handleAssistenciaChange}>
                <option value="">Selecione</option>
                {opcoesHora.map((time, index) => (
                  <option key={index} value={time}>{time}</option>
                ))}
              </select>
            </label>
          </div>
        <button type="submit">Cadastrar Assistência</button>
      </form>
      </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default CadastrarAssistencia;