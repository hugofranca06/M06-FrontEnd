// src/components/Agendar.tsx

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { PostAgendamento , HorarioOption, Assistencia } from "../shared/interfaces";
import axios from "axios";
import LogoComponent from "./LogoComponent";

// Defina as opções de equipamentos como uma constante
const EQUIPAMENTOS = [
  { value: '', label: 'Selecione um equipamento' },
  { value: 'TV', label: 'TV' },
  { value: 'SMARTPHONE', label: 'SMARTPHONE' },
  { value: 'MICROONDAS', label: 'MICROONDAS' },
  { value: 'SMARTWATCH', label: 'SMARTWATCH' },
];



const Agendar: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const [postAgendamento, setPostAgendamento] = useState<PostAgendamento>({
    cliente: { cpf: '' },
    assistencia: { id: 0 },
    horario: '',
    equipamento: '',
  });
  const [dataSelecionada, setDataSelecionada] = useState<string>('');
  const [horaSelecionada, setHoraSelecionada] = useState<string>('');
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioOption[]>([]);
  const [assistencias, setAssistencias] = useState<Assistencia[]>([]);
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

   // Função para buscar as assistências
   const fetchAssistencias = async () => {
    try {
      const response = await axios.get<Assistencia[]>('http://localhost:8080/assistencias/listar')
      setAssistencias(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'sem assistencias' });
    }
   };

   // Função  para buscar horários disponíveis
   const fetchHorariosDisponiveis = async (idAssistencia: number, data: string) => {
    try {
      const response = await axios.get<string[]>(`http://localhost:8080/agendamentos/listarhorarios/${idAssistencia}?d=${data}`)
      const horarios = response.data.map(horario => ({ value: horario, label: horario }));
      setHorariosDisponiveis(horarios)
    } catch (error) {
      setMessage({ type: 'error', text: 'Horários não encontrados' });
    }
   }

   useEffect(() => {
    fetchAssistencias();
  }, []);

  // Atualiza os horários disponíveis quando a data for selecionada
  useEffect(() => {
    if(dataSelecionada && postAgendamento.assistencia.id) {
      fetchHorariosDisponiveis(postAgendamento.assistencia.id, dataSelecionada);
    }     
  }, [dataSelecionada, postAgendamento.assistencia.id])

  // Atualiza o campo `horario` quando a hora é selecionada
  useEffect(() => {
    if(dataSelecionada && horaSelecionada) {
      setPostAgendamento(prevState => ({
        ...prevState,
        horario: `${dataSelecionada}T${horaSelecionada}`
      }));
    }
  }, [dataSelecionada, horaSelecionada])


  const handleAgendamentoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'data') {
      setDataSelecionada(value);
    } else if (name === 'hora') {
      setHoraSelecionada(value);
    } else if (name === 'assistencia') {
      const selectedAssistencia = assistencias.find(a => a.id === Number(value));
      if (selectedAssistencia) {
        setPostAgendamento(prevState => ({
          ...prevState,
          assistencia: { id: selectedAssistencia.id }
        }));
      }
    } else if (name === 'equipamento') {
      setPostAgendamento(prevState => ({
        ...prevState,
        equipamento: value
      }));
    } else if (name === 'cpf') {
      setPostAgendamento(prevState => ({
        ...prevState,
        cliente: { ...prevState.cliente, cpf: value }
      }));
    }
  };


  const handleAgendamentoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post<PostAgendamento>('http://localhost:8080/agendamentos', postAgendamento);
      setMessage({ type:'success', text: 'Agendamento criado com sucesso' });
      refreshData();
    } catch (error) {      
      setMessage({ type: 'error', text: 'Erro ao criar agendamento' });    
    }
  };

  return (
    <div className="container">
      <LogoComponent />
      <h2>Agendar</h2>
      <div className="form-container-agendar">
      <form onSubmit={handleAgendamentoSubmit}>
        <div>
          <label>
            CPF: 
            <input placeholder="CPF" type="text" name='cpf' value={postAgendamento.cliente.cpf} required onChange={handleAgendamentoChange}/>
          </label>
        </div>
        <div>
          <label>
            Equipamento: 
            <select name='equipamento' value={postAgendamento.equipamento} required onChange={handleAgendamentoChange}>
              {EQUIPAMENTOS.map(equipamento => (
                <option key={equipamento.value} value={equipamento.value}>
                  {equipamento.label}
                </option>
              ))}
              </select>
          </label>
        </div>
        <div>
          <label>
            Assistência:
            <select name='assistencia' onChange={handleAgendamentoChange} required>
              <option value="">Selecione uma assistência</option>
              {assistencias.map(assistencia => (
                <option key={assistencia.id} value={assistencia.id}>
                  {assistencia.nome}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Data: 
            <input type="date" name='data' value={dataSelecionada} required onChange={handleAgendamentoChange}/>
          </label>
        </div>
        {dataSelecionada && (
          <div>
            <label>
              Hora:
              <select name="hora" value={horaSelecionada} onChange={handleAgendamentoChange} required>
                <option value="">Selecione uma hora</option>
                {horariosDisponiveis.map(horario => (
                  <option key={horario.value} value={horario.value}>
                    {horario.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <button type='submit'>Cadastrar Agendamento</button>
      </form>
              </div>
              <div className="espaco-final">

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
              </div>
    </div>
  );
};

export default Agendar;