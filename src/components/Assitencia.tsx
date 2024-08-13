import React, { useContext, useState } from "react";
import { PostAssistencia } from "../shared/interfaces";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Assistencias: React.FC = () => {
  const { assistencias, refreshData } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('listar');
  const [postAssistencia, setPostAssistencias] = useState<PostAssistencia>({
    nome: '',
    inicioExpediente: '',
    fimExpediente: '',
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAssistenciaChange = (e:any) => {
    const {name, value} = e.target
    setPostAssistencias(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }

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
    <div className="tab-content">
      <h2>Assistências</h2>

      <nav className="sub-nav">
        <button onClick={() => setActiveSubTab('listar')} className={activeSubTab === 'listar' ? 'active' : ''}>
          Lista de Assistências
        </button>
        <button onClick={() => setActiveSubTab('cadastrar')} className={activeSubTab === 'cadastrar' ? 'active' : ''}>
          Cadastrar Assistência
        </button>
      </nav>

      {activeSubTab === 'listar' && (
        <div className="card-container">
          {assistencias.map((assistencia) => (
            <div key={assistencia.id} className="card">
              <h3>{assistencia.nome}</h3>
              <p>Início: {assistencia.inicioExpediente}</p>
              <p>Fim: {assistencia.fimExpediente}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'cadastrar' && (
        <div>
          <h3>Nova Assistência</h3>
          <form onSubmit={handleAssistenciaSubmit} className="form">
          <div>
             <label>
               Nome: 
               <input type="text" name='nome' value={(postAssistencia.nome)} required onChange={handleAssistenciaChange}/>
             </label>
           </div>
           <div>
             <label>
               Início de expediente: 
               <input type="time" name='inicioExpediente' value={(postAssistencia.inicioExpediente)} required onChange={handleAssistenciaChange}/>
             </label>
           </div>
           <div>
             <label>
               Fim de expediente: 
               <input type="time" name='fimExpediente' value={(postAssistencia.fimExpediente)} required onChange={handleAssistenciaChange}/>
             </label>
           </div>
            <button type="submit">Cadastrar Assistência</button>
          </form>
        </div>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default Assistencias;