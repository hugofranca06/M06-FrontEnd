
import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState } from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Admin from './components/Admin';
import Agendar from './components/Agendar';
import Assistencias from './components/Assistencias';
import CadastrarAssistencia from './components/CadastrarAssistencia';
import Cliente from './components/Cliente';
import Registrar from './components/Registrar';


const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/agendar" element={<Agendar />} />
            <Route path="/assistencias" element={<Assistencias />} />
            <Route path="/cadastrar-assistencia" element={<CadastrarAssistencia />} />
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/registrar" element={<Registrar />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;



// const App: React.FC = () => {
//   const [activeTab, setActiveTab] = useState('admin');

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'home':
//         return <Home />;
//       case 'admin':
//         return <Admin />;
//       case 'agendar':
//         return <Agendar />;
//       case 'assistencias':
//         return <Assistencias />;
//       case 'cadastrarAssistencia':
//         return <CadastrarAssistencia />;
//       case 'cliente':
//         return <Cliente />;
//       case 'registrar':
//         return <Registrar />;
//       default:
//         return <Admin />;
//     }
//   };

//   return (
//     <AppProvider>
//       <div className="app">
//         <nav>
//           <button onClick={() => setActiveTab('home')}>HOME</button>
//           <button onClick={() => setActiveTab('admin')}>Admin</button>
//           <button onClick={() => setActiveTab('agendar')}>Agendar</button>
//           <button onClick={() => setActiveTab('assistencias')}>Assistências</button>
//           <button onClick={() => setActiveTab('cadastrarAssistencia')}>Cadastrar Assistência</button>
//           <button onClick={() => setActiveTab('cliente')}>Cliente</button>
//           <button onClick={() => setActiveTab('registrar')}>Registrar</button>
//         </nav>
//         <main>
//           {renderContent()}
//         </main>
//       </div>
//     </AppProvider>
//   );
// };

// export default App;