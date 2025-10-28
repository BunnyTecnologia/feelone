import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import CadastroDadosPessoais from './pages/CadastroDadosPessoais';
import CadastroRedesSociais from './pages/CadastroRedesSociais';
import CadastroEndereco from './pages/CadastroEndereco';
import DadosSaude from './pages/DadosSaude';
import ContatoDeEmergencia from './pages/ContatoDeEmergencia'; // Importação corrigida
import Configuracoes from './pages/Configuracoes';
import MinhasInformacoes from './pages/MinhasInformacoes';
import Perfil from './pages/Perfil';
import Chat from './pages/Chat';
import PainelAdministrativo from './pages/PainelAdministrativo';
import { SessionContextProvider } from './integrations/supabase/session-context';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import MobileNavbar from './components/MobileNavbar';

function App() {
  return (
    <SessionContextProvider>
      <Router>
        <div className="pb-16 md:pb-0"> {/* Adiciona padding para a navbar móvel */}
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            
            {/* Rotas Protegidas */}
            <Route element={<ProtectedRoute />}>
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
              <Route path="/painel-administrativo" element={<PainelAdministrativo />} /> {/* Nova Rota */}

              {/* Rotas de Cadastro/Edição */}
              <Route path="/cadastro/dados-pessoais" element={<CadastroDadosPessoais />} />
              <Route path="/cadastro/redes-sociais" element={<CadastroRedesSociais />} />
              <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
              <Route path="/dados-saude" element={<DadosSaude />} />
              <Route path="/contato-emergencia" element={<ContatoDeEmergencia />} /> {/* Rota corrigida */}
              
              {/* Rotas de Gerenciamento (A serem criadas) */}
              <Route path="/gerenciar/dieta" element={<div>Gerenciar Dieta (TODO)</div>} />
              <Route path="/gerenciar/series" element={<div>Gerenciar Séries (TODO)</div>} />
              <Route path="/gerenciar/enquetes" element={<div>Gerenciar Enquetes (TODO)</div>} />
              <Route path="/gerenciar/viagens" element={<div>Gerenciar Viagens (TODO)</div>} />
              <Route path="/gerenciar/grupos-chat" element={<div>Gerenciar Grupos de Chat (TODO)</div>} />
              <Route path="/gerenciar/agenda" element={<div>Gerenciar Agenda (TODO)</div>} />
            </Route>
          </Routes>
          <MobileNavbar />
          <Toaster />
        </div>
      </Router>
    </SessionContextProvider>
  );
}

export default App;