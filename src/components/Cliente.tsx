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
const [showConfirmation, setShowConfirmation] = useState<{ show: boolean, idAgendamento: number | null }>({ show: false, idAgendamento: null });


const handleSubTabChange = (tab: string) => {
    setMessage(null);
    setAgendamentosPorCpf([]);

    setActiveSubTab(tab);
  }


const handleBuscarAgendamento = async () => {
	try {
		const response = await axios.get(`http://localhost:8080/agendamentos/clientes/${cpf}`);
		if(response.data.length === 0) {
			setAgendamentosPorCpf([])
			setMessage({ type: 'error', text: 'CPF não encontrado' });
		} else {
			setAgendamentosPorCpf(response.data);
			setMessage(null);
		}
	} catch (error) {
		setAgendamentosPorCpf([])
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
	} finally {
		setShowConfirmation({ show: false, idAgendamento: null})
	}
};

const confirmCancelamento = (idAgendamento: number) => {
	setShowConfirmation({ show: true, idAgendamento });
};

const cancelConfirmation = () => {
	setShowConfirmation({ show: false, idAgendamento: null });
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
			<button onClick={() => handleSubTabChange('novoAgendamento')} className='sub-menu'>Novo Agendamento</button>
			<button onClick={() => handleSubTabChange('cancelarAgendamento')} className='sub-menu'>Meus Agendamentos</button>       
		</nav>

		{activeSubTab == 'novoAgendamento' &&  <Agendar exibirLogo={false}/>}

		{activeSubTab === 'cancelarAgendamento' && (
			<div className='card-t'>
			<h3>Buscar Agendamento</h3>
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
			{agendamentosPorCpf.map(agendamento => (
				<div key={agendamento.idAgendamento} className='card'>
					<div className='botao-cancelar'>
					<button onClick={() => confirmCancelamento(agendamento.idAgendamento)}>
						<i className='fas fa-ban'></i>
					</button>
					</div>
					<p className='card-title'>ID: {agendamento.idAgendamento}</p>
					<p className='card-text'>Cliente: {agendamento.cliente.nome}</p>
					<p className='card-text'>Data: {formatDate(agendamento.horario)}</p>
					<p className='card-text'>Assistência: {agendamento.assistencia.nome}</p>
					<p className='card-text'>Equipamento: {agendamento.equipamento}</p>
				</div>
			))}
			</div>
			{message && <div className={`message ${message.type}`}>{message.text}</div>}
		</div>
		)}
		
			{showConfirmation.show && (
			<div className="confirmation-popup">
				<p>Tem certeza que deseja cancelar este agendamento?</p>
				<button onClick={() => handleCancelarAgendamento(showConfirmation.idAgendamento!)}>Sim</button>
				<button onClick={cancelConfirmation}>Não</button>
			</div>

		)}      
	</div>
);
};

export default Cliente;