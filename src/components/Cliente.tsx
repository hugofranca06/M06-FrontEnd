import { Agendamento } from '../shared/interfaces';

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Agendar from './Agendar';
import { AppContext } from '../context/AppContext';
import LogoComponent from './LogoComponent';

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
      setAgendamentosPorCpf(prevAgendamentos =>
        prevAgendamentos.filter(agendamento => agendamento.idAgendamento !== idAgendamento)
        );
        setAgendamento(null);
      refreshData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Agendamento não encontrado' });
    }
  };

  const formatDate = (isoString:string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };


  return (
    <div className='container'>
      <LogoComponent />
      <h2>Painel do Cliente</h2>
      
      <nav className='sub-aba'>
        <button onClick={() => setActiveSubTab('novoAgendamento')} className='sub-menu'>Novo Agendamento</button>
        <button onClick={() => setActiveSubTab('cancelarAgendamento')} className='sub-menu'>Cancelar Agendamento</button>
        <button onClick={() => setActiveSubTab('buscarAgendamento')} className='sub-menu'>Meus Agendamentos</button>
      </nav>

      {activeSubTab === 'novoAgendamento' && <Agendar />}

      {activeSubTab === 'cancelarAgendamento' && (
        <div className='card-t'>
        <h3>Cancelar Agendamento por CPF</h3>
        <div className='form-container'>

        <input 
          type="text" 
          placeholder="Digite o CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          />
        <button onClick={handleBuscarAgendamento}>Buscar</button>
          </div>
        <div className='card-container'>
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
        {agendamentosPorCpf.map(agendamento => (
          <div key={agendamento.idAgendamento} className='card'>
            <div className='botao-cancelar'>
            <button onClick={() => handleCancelarAgendamento(agendamento.idAgendamento)}>
              <i className='fas fa-ban'></i>
            </button>
            </div>
            <p className='card-title'>ID: {agendamento.idAgendamento}</p>
            <p className='card-text'>Data: {formatDate(agendamento.horario)}</p>
            <p className='card-text'>Assistência: {agendamento.assistencia.nome}</p>
            <p className='card-text'>Equipamento: {agendamento.equipamento}</p>
          </div>
        ))}
        </div>
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
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>
        
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default Cliente;