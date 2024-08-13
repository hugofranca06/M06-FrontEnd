import { useContext, useState } from "react"
import { AppContext } from "../context/AppContext"
import { PostCliente } from "../shared/interfaces";
import axios from "axios";


    const Clientes: React.FC = () => {
    const { clientes, refreshData} = useContext(AppContext);
    const [activeSubTab, setActiveSubTab] = useState('listar');
    const [postCliente, setPostClientes] = useState<PostCliente>({
      cpf: '',
      nome: '',
    });

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleClienteChange = (e:any) => {
      const {name, value} = e.target
     setPostClientes(
        (prevState) => ({
          ...prevState, 
          [name] : value, 
        })
      )
    }

    const handleClienteSubmit = async (e:React.FormEvent) => {
      e.preventDefault()

      try {
        await axios.post<PostCliente>('http://localhost:8080/clientes', postCliente)
        setMessage({ type: 'success', text: 'Assistência criada com sucesso' });
        refreshData();
      } catch (error) {
        setMessage({ type: 'error', text: 'Erro ao criar cliente' });
      }
    };

    return(
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
    );

}

export default Clientes;