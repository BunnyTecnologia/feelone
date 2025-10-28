import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import CadastroDadosPessoais from './pages/CadastroDadosPessoais'; // Importação adicionada
import CadastroRedesSociais from './pages/CadastroRedesSociais';
import CadastroEndereco from './pages/CadastroEndereco';
import DadosSaude from './pages/DadosSaude';
import ContatoDeEmergencia from './pages/ContatoDeEmergencia';
import Configuracoes from './pages/Configuracoes';
import MinhasInformacoes from './pages/MinhasInformacoes';
import Chat from './pages/Chat';
import Notificacoes from './pages/Notificacoes';
import Enquetes from './pages/Enquetes';
import Noticias from './pages/Noticias';
import Dieta from './pages/Dieta';
import Treino from './pages/Treino';
import Viagens from './pages/Viagens';
import Agendamentos from './pages/Agendamentos';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro/dados-pessoais" element={<CadastroDadosPessoais />} /> {/* Nova Rota */}
        <Route path="/cadastro/redes-sociais" element={<CadastroRedesSociais />} />
        <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
        <Route path="/dados-saude" element={<DadosSaude />} />
        <Route path="/contato-emergencia" element={<ContatoDeEmergencia />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/notificacoes" element={<Notificacoes />} />
        <Route path="/enquetes" element={<Enquetes />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/dieta" element={<Dieta />} />
        <Route path="/treino" element={<Treino />} />
        <Route path="/viagens" element={<Viagens />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
      </Routes>
    </Router>
  );
}

export default App;