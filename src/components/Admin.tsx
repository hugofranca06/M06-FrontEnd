import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Agendamento } from '../shared/interfaces';
import LogoComponent from './LogoComponent';

const Admin: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const { agendamentos, clientes } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('listaAgendamentos');
  const [dataFiltro, setDataFiltro] = useState('');
  const [idAgendamento, setIdAgendamento] = useState('');
  const [agendamentoFiltrado, setAgendamentoFiltrado] = useState<Agendamento | null>(null);
  const [agendamentosPorData, setAgendamentosPorData] = useState<Agendamento[]>([]);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleBuscarPorData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/agendamentos/listarDatas?data=${dataFiltro}`);
      setAgendamentosPorData(response.data);    
    } catch (error) {
      setMessage({type: 'error', text: 'Não encontrada agendamentos nessa data'})
    }
  };

  const handleBuscarPorId = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/agendamentos/${idAgendamento}`);
      setAgendamentoFiltrado(response.data);
      setMessage({type: 'success' , text: ''});
      refreshData();
    } catch (error) {      
      setMessage({type: 'error' , text: 'Agendamento não encontrado'});
      
    }
  };

  const formatDate = (isoString:string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

  return (
    <div  className='container'>
      <LogoComponent />
      <nav className='sub-aba'>
        <button onClick={() => setActiveSubTab('listaAgendamentos')} className='sub-menu'>Lista de Agendamentos</button>
        <button onClick={() => setActiveSubTab('listaClientes')} className='sub-menu'>Lista de Clientes</button>
        <button onClick={() => setActiveSubTab('buscarPorData')} className='sub-menu'>Buscar por Data</button>
        <button onClick={() => setActiveSubTab('buscarPorId')} className='sub-menu'>Buscar por ID</button>
      </nav>

      {activeSubTab === 'listaAgendamentos' && (
        <div className='card-t'>
          <h3>Agendamentos</h3>
          <div className='card-container'>
          {agendamentos.map(agendamento => (
            <div key={agendamento.idAgendamento} className='card'>
              <p className='card-title'>ID: {agendamento.idAgendamento}</p>
              <p className='card-text'>Cliente: {agendamento.cliente.nome}</p>
              <p className='card-text'>Data: {formatDate(agendamento.horario)}</p>
              <p className='card-text'>Equipamento: {agendamento.equipamento}</p>
            </div>
          ))}
          </div>
        </div>
      )}

      {activeSubTab === 'listaClientes' && (
        <div className='card-t'>
          <h3>Clientes</h3>
          <div className='card-container-cliente'>
          {clientes.map(cliente => (
            <div key={cliente.cpf} className='card'>
              <p className='card-title'>{cliente.nome}</p>
              <p className='card-text'>CPF: {cliente.cpf}</p>
            </div>
          ))}
          </div>
        </div>
      )}

      {activeSubTab === 'buscarPorData' && (
        <div className='card-t'>
          <h3>Buscar Agendamentos por Data</h3>   
          <div className='form-container'>
          <input
            type="date" 
            value={dataFiltro} 
            onChange={(e) => setDataFiltro(e.target.value)}
            />            
          <button onClick={handleBuscarPorData}>Buscar</button>        
            </div>       
            <div className='card-t'>
              <h3>Agendamentos Encontrados</h3>           
              <div className='card-container'>
          {agendamentosPorData.map(agendamento => (
            <div key={agendamento.idAgendamento} className='card'>
              <p className='card-title'>ID: {agendamento.idAgendamento}</p>
              <p className='card-text'>Cliente: {agendamento.cliente.nome}</p>
              <p className='card-text'>Data: {formatDate(agendamento.horario)}</p>
            </div>
            ))}
            </div>
            </div>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>
      )}

      {activeSubTab === 'buscarPorId' && (
        <div className='card-t'>
          <h3>Buscar Agendamento por ID</h3>
          <div className='form-container'>
          <input 
            type="text" 
            value={idAgendamento} 
            onChange={(e) => setIdAgendamento(e.target.value)}
            placeholder='ID'
            />
          <button onClick={handleBuscarPorId}>Buscar</button>
            </div>
            <div className='card-t'>
              <h3>Agendamento Encontrado</h3>
              <div className='card-container'>
          {agendamentoFiltrado && (
            <div className='card'>
              <p className='card-title'>ID: {agendamentoFiltrado.idAgendamento}</p>
              <p className='card-text'>Cliente: {agendamentoFiltrado.cliente.nome}</p>
              <p className='card-text'>Data: {formatDate(agendamentoFiltrado.horario)}</p>
              <p className='card-text'>Equipamento: {agendamentoFiltrado.equipamento}</p>
            </div>
          )}
          </div>
          </div>
          {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </div>
      )}
    </div>
  );
};

export default Admin;