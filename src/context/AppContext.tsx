import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Assistencia, Clientes, Agendamento } from '../shared/interfaces';

interface AppContextProps {
  assistencias: Assistencia[];
  clientes: Clientes[];
  agendamentos: Agendamento[];
  refreshData: () => void;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assistencias, setAssistencias] = useState<Assistencia[]>([]);
  const [clientes, setClientes] = useState<Clientes[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  const fetchData = async () => {
    try {
      const [assistenciasRes, clientesRes, agendamentosRes] = await Promise.all([
        axios.get('http://localhost:8080/assistencias/listar'),
        axios.get('http://localhost:8080/clientes/listar'),
        axios.get('http://localhost:8080/agendamentos/listar'),
      ]);

      setAssistencias(assistenciasRes.data);
      setClientes(clientesRes.data);
      setAgendamentos(agendamentosRes.data);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  return (
    <AppContext.Provider value={{ assistencias, clientes, agendamentos, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};