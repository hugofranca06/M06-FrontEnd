
import '@fortawesome/fontawesome-free/css/all.min.css';
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