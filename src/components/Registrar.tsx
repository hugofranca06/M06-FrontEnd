import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { PostCliente } from '../shared/interfaces';
import LogoComponent from './LogoComponent';

const Registrar: React.FC = () => {
  const { refreshData } = useContext(AppContext);
  const [cliente, setCliente] = useState<PostCliente>({
    nome: '',
    cpf: '',
  });
  const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCliente(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post<PostCliente>('http://localhost:8080/clientes', cliente);
      setMessage({ type: 'success', text: 'Cliente registrado com sucesso' });
      refreshData();
      setCliente({ nome: '', cpf: '' }); // Reset form
    } catch (error) {       
      setMessage({ type: 'error', text: "Erro ao registrar cliente"});      
    }
  };

  return (
    <div className='container'>
      <LogoComponent />
      <h2>Registrar Cliente</h2>
      <div className='form-container'>

      <form onSubmit={handleSubmit}>
        <div >
            <input 
              type="text" 
              name="nome" 
              value={cliente.nome} 
              onChange={handleChange} 
              required 
              placeholder='Nome'
              />
        </div>
        <div>
            <input 
              type="text" 
              name="cpf" 
              value={cliente.cpf} 
              onChange={handleChange} 
              required 
              placeholder='CPF'
              />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
              </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default Registrar;