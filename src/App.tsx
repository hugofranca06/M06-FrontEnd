import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Agendamentos from './components/Agendamentos';
import Assitencias from './components/Assitencias';
import Clientes from './components/Clientes';
import { Assistencia, Cliente, Agendamento, PostCliente, PostAssistencia, PostAgendamento, GetAssistenciaByIdAndData } from './shared/interfaces';

function App() {
  

  
  const [assistencias, setAssistencias] = useState<Array<Assistencia>>([]);
  const [clientes, setClientes] = useState<Array<Cliente>>([]);
  const [agendamentos, setAgendamentos] = useState<Array<Agendamento>>([]);
  const [postCliente, setPostClientes] = useState<PostCliente>({
    cpf: '',
    nome: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [postAssistencia, setPostAssistencias] = useState<PostAssistencia>({
    nome: '',
    inicioExpediente: '',
    fimExpediente: ''
  });
  const [postAgendamento, setPostAgendamentos] = useState<PostAgendamento>({
    cliente: {
      cpf:''
    },
    assistencia: {
      id: 0
    },
    horario: '',
    equipamento: ''
  })
  const [findAgendamento, setFindAgendamentos] = useState<Agendamento>({} as Agendamento)
  const [findAgendamentoData, setFindAgendamentoData] = useState<Agendamento>({} as Agendamento)
  const [deleteAgendamento, setDeleteAgendamentos] = useState<Agendamento>({} as Agendamento)
  const [buscarAgendamentoData, setBuscarAgendamentoData] = useState<Agendamento>({} as Agendamento)
  const [horariosLivres, setHorariosLivres] = useState<String[]>([])
  const [assistenciaIdAndData, setAssistenciaIdAndData] = useState<GetAssistenciaByIdAndData>({} as GetAssistenciaByIdAndData)
  const [selectedHorario, setSelectedHorario] = useState('');
  const [activeTab, setActiveTab] = useState('agendamentos');
  const [activeSubTab, setActiveSubTab] = useState('listar');  


  useEffect(() => { 
    axios.get('http://localhost:8080/assistencias/listar').then(res => {
      setAssistencias(res.data)
    })
    axios.get('http://localhost:8080/clientes/listar').then(res => {
      setClientes(res.data)
    })
    axios.get('http://localhost:8080/agendamentos/listar').then(res => {
      setAgendamentos(res.data)
    })
  }, [])



  const formatDate = (isoString:string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  };

  const handleClienteChange = (e:any) => {
    const {name, value} = e.target
   setPostClientes(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }



  const handleAssistenciaChange = (e:any) => {
    const {name, value} = e.target
    setPostAssistencias(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }

  const handleAgendamentoChange = (e:any) => {
    const {name, value} = e.target
    setPostAgendamentos(
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

  const handleDeleteAgendamentoId = (e:any) => {
    const {name, value} = e.target
    setDeleteAgendamentos(
      (prevState) => ({
        ...prevState, 
        [name] : value, 
      })
    )
  }

  const handleGetAgendamentoByIdAndDataSubmit = async (e:any) => {
    e.preventDefault()
    try {            
     const response = await axios.get<String[]>(`http://localhost:8080/agendamentos/listarhorarios/${assistenciaIdAndData.id}?d=${assistenciaIdAndData.data}`)      
    setHorariosLivres(response.data as String[])
    setError('')
    } catch (error) {
      setError("Agendamento não encontrado para essa data ou assistência")
      setHorariosLivres([])
    }
  }

  const handleAgendamentoIdSubmit = async (e:any) => {
    e.preventDefault()
    try {
      if(findAgendamento.idAgendamento) {      
      const response = await axios.get<Agendamento>(`http://localhost:8080/agendamentos/${findAgendamento.idAgendamento}`)
      setFindAgendamentoData(response.data)
    }
    } catch (error) {
      setError("Agendamento não encontrado")
      setFindAgendamentoData({} as Agendamento)
    }
  }

  const handleDeleteAgendamentoIdSubmit = async (e:any) => {
    e.preventDefault()
    try {
      if(deleteAgendamento.idAgendamento) {      
        await axios.delete<Agendamento>(`http://localhost:8080/agendamentos/${deleteAgendamento.idAgendamento}`)
      
    }
    setSuccess("Agendamento cancelado")
    setError('')
    } catch (error) {
      setSuccess("Agendamento cancelado")
      setError('')
    }
  }

  const handleClienteSubmit = async (e:any) => {
    e.preventDefault()

    try {
      await axios.post<PostCliente>('http://localhost:8080/clientes', postCliente)
      setSuccess("Cliente criado com sucesso")
      setError('')
    } catch (error) {
      setSuccess('')
      setError("Erro")
    }
  }

  const handleAssistenciaSubmit = async (e:any) => {
    e.preventDefault()

    try {
      await axios.post<PostAssistencia>('http://localhost:8080/assistencias', postAssistencia)
      setSuccess("Assistencia criada com sucesso")
      setError('')
    } catch (error) {
      setSuccess('')
      setError("Erro")
    }
  }

  const handleAgendamentoSubmit = async (e:any) => {
    e.preventDefault()
    try {
      await axios.post<PostAgendamento>('http://localhost:8080/agendamentos', postAgendamento)
      setSuccess("Agendamento criado com sucesso")
      setError('')
    } catch (error) {
      setSuccess('')
      setError("Erro")
    }
  }

  useEffect(() => {
    // Resetar mensagens de sucesso e erro quando mudar de aba ou subaba
    setSuccess('');
    setError('');
  }, [activeTab, activeSubTab]);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Assistech</h1>
      </header>

    <nav className='app-nave'>
      <button onClick={() => { setActiveTab('agendamentos'); setActiveSubTab('listar'); }} className={activeTab === 'agendamentos' ? 'active' : ''}>Agendamentos</button>
      <button onClick={() => { setActiveTab('assistencias'); setActiveSubTab('listar'); }} className={activeTab === 'assistencias' ? 'active' : ''}>Assistências</button>
      <button onClick={() => { setActiveTab('clientes'); setActiveSubTab('listar'); }} className={activeTab === 'clientes' ? 'active' : ''}>Clientes</button>
    </nav>

    <main className='app-main'>
      {activeTab === 'agendamentos' && (
        <div className="tab-content">
          <h2>Agendamentos</h2>

          <nav className='sub-nav'>
            <button onClick={() => setActiveSubTab('listar')} className={activeSubTab === 'listar' ? 'active' : ''}>Lista de Agendamentos</button>
            <button onClick={() => setActiveSubTab('novo')} className={activeSubTab === 'novo' ? 'active' : ''}>Novo Agendamento</button>
            <button onClick={() => setActiveSubTab('excluir')} className={activeSubTab === 'excluir' ? 'active' : ''}>Cancelar Agendamento</button>
            <button onClick={() => setActiveSubTab('buscar')} className={activeSubTab === 'buscar' ? 'active' : ''}>Buscar Agendamento</button>
            <button onClick={() => setActiveSubTab('horarios')} className={activeSubTab === 'horarios' ? 'active' : ''}>Horários Livres</button>
            <button onClick={() => setActiveSubTab('datas')} className={activeSubTab === 'datas' ? 'active' : ''}>Buscar por Data</button>
          </nav>

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
          )}

          {activeSubTab === 'listar' && (
            <div className="card-container">
            { agendamentos.map(agendamento => (
              <div key={agendamento.idAgendamento} className='card'>
                <h3>Agendamento #{agendamento.idAgendamento}</h3>
                <p>Cliente: {agendamento.cliente.nome}</p>
                <p>Assistência: {agendamento.assistencia.nome}</p>
                <p>Data: {formatDate(agendamento.horario)}</p>
                <p>Equipamento: {agendamento.equipamento}</p>
              </div>
            ))}
          </div>
          )}
          {activeSubTab === 'novo' && (
            <div>
              <h3>Novo Agendamento</h3>
                <form onSubmit={handleAgendamentoSubmit} className='form'>
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
          )}

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
          )}   
        </div>
      )}

      {activeTab === 'assistencias' && (
        <div className='tab-content'>
          <h2>Assistências</h2>

          <nav className='sub-nav'>
            <button onClick={() => setActiveSubTab('listar')} className={activeSubTab === 'listar' ? 'active' : ''}>Lista de Assistências</button>
            <button onClick={() => setActiveSubTab('cadastrar')} className={activeSubTab === 'cadastrar' ? 'active' : ''}>Cadastrar Assistência</button>
          </nav>

          {activeSubTab === 'listar' && (
            <div className='card-container'>
            {assistencias.map(assistencia => (
              <div key={assistencia.id} className='card'>
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
          <form onSubmit={handleAssistenciaSubmit} className='form'>
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
           <button type='submit'>Cadastrar assistência</button>
         </form>

            </div>
          )}         
          
        </div>
      )}

      {activeTab === 'clientes' && (
        <div className='tab-content'>
          <h2>Clientes</h2>

          <nav className='sub-nav'>
          <button onClick={() => setActiveSubTab('listar')} className={activeSubTab === 'listar' ? 'active' : ''}>Lista de Clientes</button>
            <button onClick={() => setActiveSubTab('cadastrar')} className={activeSubTab === 'cadastrar' ? 'active' : ''}>Cadastrar Cliente</button>
          </nav>

          {activeSubTab === 'listar' && (
            <div className='card-container'>
              {clientes.map(cliente => (
                <div key={cliente.cpf} className='card'>
                  <h3>{cliente.nome}</h3>
                  <p>CPF: {cliente.cpf}</p>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === 'cadastrar' && (
            <div>
              <h3>Cadastrar Cliente</h3>
              <form onSubmit={handleClienteSubmit} className='form'>
               <div>
                 <label>
                   Nome: 
                   <input type="text" name='nome' value={postCliente.nome} required onChange={handleClienteChange}/>
                 </label>
               </div>
               <div>
                 <label>
                   CPF: 
                   <input type="text" name='cpf' value={postCliente.cpf} required onChange={handleClienteChange}/>
                 </label>
               </div>
               <button type='submit'>Cadastrar</button>
             </form>


            </div>
          )}      

         
        </div>
      )}
     
    </main>
    {(success || error) && (
      <div className={`message ${success ? 'success' : 'error'}`}>
        {success || error}
      </div>
    )}

    </div>

  );


  // return (
  //   <div>
  //     <div style={{ padding: '8px' }}>
  //       <div> 
  //         <Assitencias />
  //         <div style={{display: 'flex', gap:'16px'}}>
  //         {assistencias?.map(assistencia => (
  //           <div key={assistencia.id} style={{display: 'flex', padding:'16px', flexDirection: 'column', border: '1px solid black'}}>
  //             <p>{assistencia.nome}</p>
  //             <p>{assistencia.inicioExpediente}</p>
  //             <p>{assistencia.fimExpediente}</p>              
  //           </div>            
  //         ))}
  //         </div>
  //       </div>
  //     </div>

  //     <div style={{ padding: '8px' }}>
  //       <div> 
  //         <Clientes />
  //         <div style={{display: 'flex', gap:'16px'}}>
  //         {clientes?.map(cliente => (
  //           <div key={cliente.cpf} style={{display: 'flex', padding:'16px', flexDirection: 'column', border: '1px solid black'}}>
  //             <p>{cliente.nome}</p>        
  //           </div>            
  //         ))}
  //         </div>
  //       </div>
  //     </div>

  //     <div style={{ padding: '8px' }}>
  //       <div> 
  //         <Agendamentos />
  //         <div style={{display: 'flex', gap:'16px'}}>
  //         {agendamentos?.map(agendamento => (
  //           <div key={agendamento.idAgendamento} style={{display: 'flex', padding:'8px', flexDirection: 'column', border: '1px solid black'}}>
  //             <span>Id: {agendamento.idAgendamento}</span> 
  //             <span>Nome do cliente: {agendamento.cliente.nome}</span> 
  //             <span>Nome da assistência: {agendamento.assistencia.nome}</span> 
  //             <p>{formatDate(agendamento.horario)}</p> 
  //             <p>{agendamento.equipamento}</p>        
  //           </div>            
  //         ))}
  //         </div>
  //       </div>
  //     </div>
      
  //     <div style={{ padding: '8px'}}>
  //           <form onSubmit={handleClienteSubmit}>
  //             <div>
  //               <label>
  //                 Nome: 
  //                 <input type="text" name='nome' value={postCliente.nome} required onChange={handleClienteChange}/>
  //               </label>
  //             </div>
  //             <div>
  //               <label>
  //                 CPF: 
  //                 <input type="text" name='cpf' value={postCliente.cpf} required onChange={handleClienteChange}/>
  //               </label>
  //             </div>
  //             <button type='submit'>Cadastrar</button>
  //           </form>
  //     </div>

  //     <div style={{ padding: '8px'}}>
  //       <form onSubmit={handleAssistenciaSubmit}>
  //         <div>
  //           <label>
  //             Nome: 
  //             <input type="text" name='nome' value={(postAssistencia.nome)} required onChange={handleAssistenciaChange}/>
  //           </label>
  //         </div>
  //         <div>
  //           <label>
  //             Início de expediente: 
  //             <input type="time" name='inicioExpediente' value={(postAssistencia.inicioExpediente)} required onChange={handleAssistenciaChange}/>
  //           </label>
  //         </div>
  //         <div>
  //           <label>
  //             Fim de expediente: 
  //             <input type="time" name='fimExpediente' value={(postAssistencia.fimExpediente)} required onChange={handleAssistenciaChange}/>
  //           </label>
  //         </div>
  //         <button type='submit'>Cadastrar assistência</button>
  //       </form>
  //     </div>
  //     <div style={{ padding: '8px'}}>
  //           <form onSubmit={handleAgendamentoSubmit}>
  //             <div>
  //               <label>
  //                 CPF: 
  //                 <input type="text" name='cpf' value={postAgendamento.cliente.cpf} required onChange={handleAgendamentoChange}/>
  //               </label>
  //             </div>
  //             <div>
  //               <label>
  //                 Id da Assistência: 
  //                 <input type="text" name='id' value={postAgendamento.assistencia.id} required onChange={handleAgendamentoChange}/>
  //               </label>
  //             </div>
  //             <div>
  //               <label>
  //                 Data e horário: 
  //                 <input type="datetime-local" name='horario' value={postAgendamento.horario} required onChange={handleAgendamentoChange}/>
  //               </label>
  //             </div>
  //             <div>
  //               <label>
  //                 Equipamento: 
  //                 <input type="text" name='equipamento' value={postAgendamento.equipamento} required onChange={handleAgendamentoChange}/>
  //               </label>
  //             </div>
  //             <button type='submit'>Cadastrar Agendamento</button>
  //           </form>
            
  //     </div>
  //     <div style={{ padding: '8px'}}>
  //           <form onSubmit={handleAgendamentoIdSubmit}>
  //             <div>
  //               <label>
  //                 Id do Agendamento: 
  //                 <input type="text" name='idAgendamento' value={findAgendamento.idAgendamento} required onChange={handleSetAgendamentoId}/>
  //               </label>
  //             </div>              
  //             <button type='submit'>Procurar Agendamento</button>
  //           </form>
  //           <p>Id do Agendamento: {findAgendamentoData?.idAgendamento}</p>
  //           <p>Nome do cliente: {findAgendamentoData?.cliente?.nome}</p>
  //           <p>Nome da Assistência: {findAgendamentoData?.assistencia?.nome}</p>
  //           <p>Equipamento: {findAgendamentoData?.equipamento}</p>
  //           <p>Data e Horário: {findAgendamentoData?.horario}</p>
  //     </div>
  //     <div style={{ padding: '8px'}}>
  //           <form onSubmit={handleAgendamentoIdSubmit}>
  //             <div>
  //               <label>
  //                 Id do Agendamento: 
  //                 <input type="text" name='idAgendamento' value={findAgendamento.idAgendamento} required onChange={handleSetAgendamentoId}/>
  //               </label>
  //             </div>              
  //             <button type='submit'>Procurar Agendamento</button>
  //           </form>
  //     </div>
  //     <div style={{ padding: '8px'}}>
  //           <form onSubmit={handleDeleteAgendamentoIdSubmit}>
  //             <div>
  //               <label>
  //                 Id do Agendamento: 
  //                 <input type="text" name='idAgendamento' value={findAgendamento.idAgendamento} required onChange={handleDeleteAgendamentoId}/>
  //               </label>
  //             </div>              
  //             <button type='submit'>Cancelar Agendamento</button>
  //           </form>
  //           {success && <p>{success}</p>}
  //           {error && <p>{error}</p>}
  //     </div>
  //   </div>
  // )
}


export default App
