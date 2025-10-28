import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import CadastroDadosPessoais from "./pages/CadastroDadosPessoais";
import CadastroRedesSociais from "./pages/CadastroRedesSociais";
import CadastroEndereco from "./pages/CadastroEndereco";
import ContatoDeEmergencia from "./pages/ContatoDeEmergencia";
import Configuracoes from "./pages/Configuracoes";
import MinhasInformacoes from "./pages/MinhasInformacoes";
import Perfil from "./pages/Perfil";
import LandingPageHome from "./pages/LandingPageHome";
import Dashboard from "./pages/Dashboard";
import CarteirinhaDeEmergencia from "./pages/CarteirinhaDeEmergencia";
import DadosSaude from "./pages/DadosSaude";
import Dieta from "./pages/Dieta";
import DietaAdmin from "./pages/DietaAdmin";
import Academia from "./pages/Academia";
import AcademiaAdmin from "./pages/AcademiaAdmin";
import Viagens from "./pages/Viagens";
import ViagensAdmin from "./pages/ViagensAdmin";
import Agenda from "./pages/Agenda";
import AgendaAdmin from "./pages/AgendaAdmin";
import Enquetes from "./pages/Enquetes"; // Nova página de visualização
import EnqueteAdmin from "./pages/EnqueteAdmin"; // Nova página de administração
import Chat from "./pages/Chat"; // Nova página de Chat
import HomeRedirect from "./pages/HomeRedirect"; // Novo componente de redirecionamento

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} /> {/* Rota raiz agora usa o redirecionador */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/dados-pessoais" element={<CadastroDadosPessoais />} />
          <Route path="/cadastro/redes-sociais" element={<CadastroRedesSociais />} />
          <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
          <Route path="/dados-saude" element={<DadosSaude />} />
          <Route path="/contato-emergencia" element={<ContatoDeEmergencia />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/landing-page" element={<LandingPageHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carteirinha-emergencia" element={<CarteirinhaDeEmergencia />} />
          
          {/* Rotas de Funcionalidades */}
          <Route path="/dieta" element={<Dieta />} />
          <Route path="/admin/dieta" element={<DietaAdmin />} />
          <Route path="/academia" element={<Academia />} />
          <Route path="/admin/academia" element={<AcademiaAdmin />} />
          <Route path="/viagens" element={<Viagens />} />
          <Route path="/admin/viagens" element={<ViagensAdmin />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/admin/agenda" element={<AgendaAdmin />} />
          <Route path="/enquetes" element={<Enquetes />} />
          <Route path="/admin/enquetes" element={<EnqueteAdmin />} />
          
          {/* Rotas de Chat */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:groupId" element={<Chat />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;