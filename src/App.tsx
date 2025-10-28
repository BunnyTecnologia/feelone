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
import Enquetes from "./pages/Enquetes";
import EnqueteAdmin from "./pages/EnqueteAdmin";
import Chat from "./pages/Chat";
import HomeRedirect from "./pages/HomeRedirect";
import Noticias from "./pages/Noticias";
import NoticiasAdmin from "./pages/NoticiasAdmin";
import DetalheNoticia from "./pages/DetalheNoticia";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import AdminMobileMenu from "./pages/AdminMobileMenu"; // Importando o novo componente

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro/dados-pessoais" element={<CadastroDadosPessoais />} />
          <Route path="/cadastro/redes-sociais" element={<CadastroRedesSociais />} />
          <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
          <Route path="/dados-saude" element={<DadosSaude />} />
          <Route path="/contato-emergencia" element={<ContatoDeEmergencia />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/minhas-informacoes" element={<MinhasInformacoes />} />
          <Route path="/perfil" element={<Perfil />} />
          
          {/* Rotas de Desktop Restritas */}
          <Route path="/landing-page" element={<LandingPageHome />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Rotas de Funcionalidades */}
          <Route path="/carteirinha-emergencia" element={<CarteirinhaDeEmergencia />} />
          <Route path="/politica-privacidade" element={<PoliticaDePrivacidade />} />
          
          {/* Rotas de Visualização (Mobile/Desktop) */}
          <Route path="/dieta" element={<Dieta />} />
          <Route path="/academia" element={<Academia />} />
          <Route path="/viagens" element={<Viagens />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/enquetes" element={<Enquetes />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/noticias/:newsId" element={<DetalheNoticia />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:groupId" element={<Chat />} />

          {/* Rotas de Administração (CRUDs) */}
          <Route path="/admin/menu" element={<AdminMobileMenu />} /> {/* Novo Menu Admin Mobile */}
          <Route path="/admin/dieta" element={<DietaAdmin />} />
          <Route path="/admin/academia" element={<AcademiaAdmin />} />
          <Route path="/admin/viagens" element={<ViagensAdmin />} />
          <Route path="/admin/agenda" element={<AgendaAdmin />} />
          <Route path="/admin/enquetes" element={<EnqueteAdmin />} />
          <Route path="/admin/noticias" element={<NoticiasAdmin />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;