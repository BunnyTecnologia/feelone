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
import Viagens from "./pages/Viagens"; // Nova página de visualização
import ViagensAdmin from "./pages/ViagensAdmin"; // Nova página de administração

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Rota raiz agora aponta para Login */}
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

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;