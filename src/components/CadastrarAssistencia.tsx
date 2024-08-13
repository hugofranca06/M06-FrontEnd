// src/components/CadastrarAssistencia.tsx

import React, { useState, useContext } from "react";
import { PostAssistencia } from "../shared/interfaces";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const CadastrarAssistencia: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const [postAssistencia, setPostAssistencias] = useState<PostAssistencia>({
    nome: '',
    inicioExpediente: '',
    fimExpediente: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAssistenciaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div>
      <h2>Cadastrar Assistência</h2>
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
            <input type="time" name='inicioExpediente' value={postAssistencia.inicioExpediente} required onChange={handleAssistenciaChange}/>
          </label>
        </div>
        <div>
          <label>
            Fim de expediente: 
            <input type="time" name='fimExpediente' value={postAssistencia.fimExpediente} required onChange={handleAssistenciaChange}/>
          </label>
        </div>
        <button type="submit">Cadastrar Assistência</button>
      </form>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default CadastrarAssistencia;