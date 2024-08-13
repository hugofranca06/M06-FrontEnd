import { Agendamento } from '../shared/interfaces';

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Agendar from './Agendar';
import { AppContext } from '../context/AppContext';

const Cliente: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('');
  const [cpf, setCpf] = useState('');
  const [agendamento, setAgendamento] = useState<Agendamento | null>(null);  
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  const [agendamentosPorCpf, setAgendamentosPorCpf] = useState<Agendamento[]>([]);
  
  



  const handleBuscarAgendamento = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/agendamentos/clientes/${cpf}`);
      setAgendamentosPorCpf(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao buscar agendamento' });
    }
  };

  const handleCancelarAgendamento = async (idAgendamento: number) => {
    try {
      await axios.delete(`http://localhost:8080/agendamentos/${idAgendamento}`);
      setMessage({ type: 'success', text: 'Agendamento cancelado com sucesso' });
      setAgendamento(null);
      refreshData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao cancelar agendamento' });
    }
  };



  return (
    <div>
      <h2>Painel do Cliente</h2>
      <nav>
        <button onClick={() => setActiveSubTab('novoAgendamento')}>Novo Agendamento</button>
        <button onClick={() => setActiveSubTab('cancelarAgendamento')}>Cancelar Agendamento</button>
        <button onClick={() => setActiveSubTab('buscarAgendamento')}>Buscar Agendamento por CPF</button>
      </nav>

      {activeSubTab === 'novoAgendamento' && <Agendar />}

      {activeSubTab === 'cancelarAgendamento' && (
        <div>
        <h3>Cancelar Agendamento por CPF</h3>
        <input 
          type="text" 
          placeholder="Digite o CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <button onClick={handleBuscarAgendamento}>Buscar</button>
        {agendamentosPorCpf.map(agendamento => (
          <div key={agendamento.idAgendamento}>
            <p>Agendamento encontrado:</p>
            <p>ID: {agendamento.idAgendamento}</p>
            <p>Data: {agendamento.horario}</p>
            <p>Assistência: {agendamento.assistencia.nome}</p>
            <p>Equipamento: {agendamento.equipamento}</p>
            <button onClick={() => handleCancelarAgendamento(agendamento.idAgendamento)}>Cancelar</button>
          </div>
        ))}
      </div>
      )}

      {activeSubTab === 'buscarAgendamento' && (
        <div>
          <h3>Buscar Agendamento por CPF</h3>
          <input 
            type="text" 
            placeholder="Digite o CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
          <button onClick={handleBuscarAgendamento}>Buscar</button>
          {agendamentosPorCpf.map(agendamento => (
            <div key={agendamento.idAgendamento}>
              <p>ID: {agendamento.idAgendamento}</p>
              <p>Data: {agendamento.horario}</p>
              <p>Assistência: {agendamento.assistencia.nome}</p>
              <p>Equipamento: {agendamento.equipamento}</p>
            </div>
          ))}
        </div>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default Cliente;