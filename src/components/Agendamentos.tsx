import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { Agendamento, GetAssistenciaByIdAndData, PostAgendamento } from "../shared/interfaces";
import axios from "axios";


const Agendamentos: React.FC = () => {
  const { agendamentos, refreshData } = useContext(AppContext);
  const [activeSubTab, setActiveSubTab] = useState('listar');
  const [postAgendamento, setPostAgendamento] = useState<PostAgendamento>({
    cliente: { cpf: '' },
    assistencia: { id: 0 },
    horario: '',
    equipamento: '',
  });
  const [assistenciaIdAndData, setAssistenciaIdAndData] = useState<GetAssistenciaByIdAndData>({
    id: 0,
    data: '',
  });
  const [horariosLivres, setHorariosLivres] = useState<string[]>([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);
  
  const [findAgendamento, setFindAgendamentos] = useState<Agendamento>({} as Agendamento)
  const [findAgendamentoData, setFindAgendamentoData] = useState<Agendamento>({} as Agendamento);
  const [deleteAgendamento, setDeleteAgendamentos] = useState<Agendamento>({} as Agendamento);

  // Funções de manipulação e submissão podem ser adicionadas aqui, similares às que você já tem no App.tsx

  const handleAgendamentoChange = (e:any) => {
    const {name, value} = e.target
    setPostAgendamento(
      (prevState) => {
        if (name === 'cpf') {
          return {
            ...prevState, 
            cliente: {
              ...prevState.cliente,
              cpf: value
            }
          };
        } else if (name === 'id') {
          return {
            ...prevState,
            assistencia: {
              ...prevState.assistencia,
              id: Number(value)
            }
          };
        } else {
          return {
            ...prevState,
            [name] : value
          };
        }      
      });    
  };
  const handleDeleteAgendamentoId = (e:any) => {
    const {name, value} = e.target
    setDeleteAgendamentos(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  };

  const handleSetAgendamentoId = (e:any) => {
    const {name, value} = e.target
    setFindAgendamentos(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }

  const handleGetAssistenciaIdAndData = (e:any) => {
    const {name, value} = e.target
    setAssistenciaIdAndData(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }

  // Exemplo de função para criar um novo agendamento
  const handleAgendamentoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post<PostAgendamento>('http://localhost:8080/agendamentos', postAgendamento);
      setMessage({ type:'success', text: 'Agendamento criado com sucesso' });
      refreshData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao criar agendamento' })
    }
  };

  const handleAgendamentoIdSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      if(findAgendamento.idAgendamento) {      
      const response = await axios.get<Agendamento>(`http://localhost:8080/agendamentos/${findAgendamento.idAgendamento}`)
      setFindAgendamentoData(response.data);
    }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao procurar agendamento' })
      setFindAgendamentoData({} as Agendamento);
    }
  };

  const handleGetAgendamentoByIdAndDataSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    try {            
     const response = await axios.get<String[]>(`http://localhost:8080/agendamentos/listarhorarios/${assistenciaIdAndData.id}?d=${assistenciaIdAndData.data}`)      
    //setHorariosLivres(response.data as String[])
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao procurar agendamento' })
      setHorariosLivres([])
    }
  };

  const handleDeleteAgendamentoIdSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    try {
      if(deleteAgendamento.idAgendamento) {      
        await axios.delete<Agendamento>(`http://localhost:8080/agendamentos/${deleteAgendamento.idAgendamento}`)
      
    }
    setMessage({ type:'success', text: 'Agendamento criado com sucesso' });
    setMessage({ type: 'error', text: 'Erro ao procurar agendamento' })
    } catch (error) {
      setMessage({ type:'success', text: 'Agendamento criado com sucesso' });
      refreshData();
    }
  }





  // Outras funções similares podem ser implementadas aqui

  // Renderização condicional baseada na sub-aba ativa
  return (
    <div className="tab-content">
      <h2>Agendamentos</h2>

      <nav className="sub-nav">
        <button onClick={() => setActiveSubTab('listar')} className={activeSubTab === 'listar' ? 'active' : ''}>Lista de Agendamentos</button>
        <button onClick={() => setActiveSubTab('novo')} className={activeSubTab === 'novo' ? 'active' : ''}>Novo Agendamento</button>
        <button onClick={() => setActiveSubTab('excluir')} className={activeSubTab === 'excluir' ? 'active' : ''}>Cancelar Agendamento</button>
        <button onClick={() => setActiveSubTab('horarios')} className={activeSubTab === 'horarios' ? 'active' : ''}>Horários Livres</button>
        <button onClick={() => setActiveSubTab('buscar')} className={activeSubTab === 'buscar' ? 'active' : ''}>Buscar Agendamento</button>
        <button onClick={() => setActiveSubTab('datas')} className={activeSubTab === 'datas' ? 'active' : ''}>Buscar por Data</button>
      </nav>

      {activeSubTab === 'listar' && (
        <div className="card-container">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.idAgendamento} className="card">
              <h3>Agendamento #{agendamento.idAgendamento}</h3>
              <p>Cliente: {agendamento.cliente.nome}</p>
              <p>Assistência: {agendamento.assistencia.nome}</p>
              <p>Data: {new Date(agendamento.horario).toLocaleString('pt-BR')}</p>
              <p>Equipamento: {agendamento.equipamento}</p>
            </div>
          ))}
        </div>
      )}

      {activeSubTab === 'novo' && (
        <div>
          <h3>Novo Agendamento</h3>
          <form onSubmit={handleAgendamentoSubmit} className="form">
          <div>
                <label>
                      CPF: 
                      <input type="text" name='cpf' value={postAgendamento.cliente.cpf} required onChange={handleAgendamentoChange}/>
                    </label>
                  </div>
                <div>
                 <label>
                   Id da Assistência: 
                   <input type="text" name='id' value={postAgendamento.assistencia.id} required onChange={handleAgendamentoChange}/>
                 </label>
               </div>
               <div>
                 <label>
                   Data e horário: 
                   <input type="datetime-local" name='horario' value={postAgendamento.horario} required onChange={handleAgendamentoChange}/>
                 </label>
               </div>
               <div>
                 <label>
                   Equipamento: 
                   <input type="text" name='equipamento' value={postAgendamento.equipamento} required onChange={handleAgendamentoChange}/>
               </label>
              </div>
               <button type='submit'>Cadastrar Agendamento</button>
             </form>
            </div>
          )}

{activeSubTab === 'buscar' && (
            <div>
              <h3>Procurar Agendamento</h3>
            <form onSubmit={handleAgendamentoIdSubmit} className="form">
               <div>
                 <label>
                   Id do Agendamento: 
                   <input type="text" name='idAgendamento' value={findAgendamento.idAgendamento} required onChange={handleSetAgendamentoId}/>
                 </label>
               </div>              
               <button type='submit'>Procurar Agendamento</button>
             </form>
             <div className='agendamento-buscado' style={{display: findAgendamentoData.idAgendamento ? 'block' : 'none'}}>
              <div className="agendamento-item">
                <span className="label">Id do Agendamento:</span>
                <span className="value">{findAgendamentoData.idAgendamento}</span>
              </div>
              <div className="agendamento-item">
                <span className="label">Nome do cliente:</span>
                <span className="value">{findAgendamentoData.cliente?.nome}</span>
              </div>
              <div className="agendamento-item">
                <span className="label">Nome da Assistência:</span>
                <span className="value">{findAgendamentoData.assistencia?.nome}</span>
              </div>
              <div className="agendamento-item">
                <span className="label">Equipamento:</span>
                <span className="value">{findAgendamentoData.equipamento}</span>
              </div>
              <div className="agendamento-item">
                <span className="label">Data e Horário:</span>
                <span className="value">{findAgendamentoData.horario}</span>
              </div>
            </div>

            </div>
          )};

          {activeSubTab === 'excluir' && (
            <div>
              <h3>Cancelar Agendamento</h3>
             <form onSubmit={handleDeleteAgendamentoIdSubmit} className="form">
               <div>
                 <label>
                   Id do Agendamento: 
                   <input type="text" name='idAgendamento' value={deleteAgendamento.idAgendamento} required onChange={handleDeleteAgendamentoId}/>
                 </label>
               </div>              
               <button type='submit'>Cancelar Agendamento</button>
             </form>
            </div>
          )};

            {activeSubTab === 'horarios' && (
            <div>
              <h3>Buscar horários por assistência e data</h3>
            <form onSubmit={handleGetAgendamentoByIdAndDataSubmit} className="form">
               <div>
                 <label>
                   Id da Assitência: 
                   <input type="text" name='id' value={assistenciaIdAndData.id} required onChange={handleGetAssistenciaIdAndData}/>
                 </label>
               </div>   
               <div>
                 <label>
                   Data: 
                   <input type="date" name='data' value={assistenciaIdAndData.data} required onChange={handleGetAssistenciaIdAndData}/>
                 </label>
               </div>            
               <button type='submit'>Buscar</button>
             </form>  

             {horariosLivres.length > 0 && (
              <div className='horarios-livres'>
                <h4>Horários Livres: </h4>
                <select
                value={selectedHorario}
                onChange={(e) => setSelectedHorario(e.target.value)}
                className='horarios-select'
                >
                  <option value="">Selecione um horário</option>
                  {horariosLivres.map((horario, index) => (
                    <option key={index} value={horario.toString()}>
                      {horario}
                    </option>
                  ))}
                </select>
                {selectedHorario && (
                  <p>Horário Selecionado: {selectedHorario}</p>
                )}
              </div>
             )}      
            
            </div>
          )};

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>

  );

};

export default Agendamentos;
