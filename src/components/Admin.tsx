import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { Agendamento } from '../shared/interfaces';

const Admin: React.FC = () => {
  const { agendamentos, clientes } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('listaAgendamentos');
  const [dataFiltro, setDataFiltro] = useState('');
  const [idAgendamento, setIdAgendamento] = useState('');
  const [agendamentoFiltrado, setAgendamentoFiltrado] = useState<Agendamento | null>(null);
  const [agendamentosPorData, setAgendamentosPorData] = useState<Agendamento[]>([]);

  const handleBuscarPorData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/agendamentos/listarDatas?data=${dataFiltro}`);
      setAgendamentosPorData(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
    }
  };

  const handleBuscarPorId = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/agendamentos/${idAgendamento}`);
      setAgendamentoFiltrado(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamento por ID:', error);
    }
  };

  return (
    <div>
      <h2>Admin</h2>
      <nav>
        <button onClick={() => setActiveSubTab('listaAgendamentos')}>Lista de Agendamentos</button>
        <button onClick={() => setActiveSubTab('listaClientes')}>Lista de Clientes</button>
        <button onClick={() => setActiveSubTab('buscarPorData')}>Buscar por Data</button>
        <button onClick={() => setActiveSubTab('buscarPorId')}>Buscar por ID</button>
      </nav>

      {activeSubTab === 'listaAgendamentos' && (
        <div>
          <h3>Lista de Agendamentos</h3>
          {agendamentos.map(agendamento => (
            <div key={agendamento.idAgendamento}>
              <p>ID: {agendamento.idAgendamento}</p>
              <p>Cliente: {agendamento.cliente.nome}</p>
              <p>Data: {agendamento.horario}</p>
              <p>Equipamento: {agendamento.equipamento}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'listaClientes' && (
        <div className='card-container'>
          <h3>Lista de Clientes</h3>
          {clientes.map(cliente => (
            <div key={cliente.cpf} className='card'>
              <p>Nome: {cliente.nome}</p>
              <p>CPF: {cliente.cpf}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'buscarPorData' && (
        <div>
          <h3>Buscar Agendamentos por Data</h3>
          <input 
            type="date" 
            value={dataFiltro} 
            onChange={(e) => setDataFiltro(e.target.value)}
          />
          <button onClick={handleBuscarPorData}>Buscar</button>
          {agendamentosPorData.map(agendamento => (
            <div key={agendamento.idAgendamento}>
              <p>ID: {agendamento.idAgendamento}</p>
              <p>Cliente: {agendamento.cliente.nome}</p>
              <p>Data: {agendamento.horario}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'buscarPorId' && (
        <div>
          <h3>Buscar Agendamento por ID</h3>
          <input 
            type="text" 
            value={idAgendamento} 
            onChange={(e) => setIdAgendamento(e.target.value)}
          />
          <button onClick={handleBuscarPorId}>Buscar</button>
          {agendamentoFiltrado && (
            <div>
              <p>ID: {agendamentoFiltrado.idAgendamento}</p>
              <p>Cliente: {agendamentoFiltrado.cliente.nome}</p>
              <p>Data: {agendamentoFiltrado.horario}</p>
              <p>Equipamento: {agendamentoFiltrado.equipamento}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;