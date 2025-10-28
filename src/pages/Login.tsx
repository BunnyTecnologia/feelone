import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '@/components/CustomInput';
import CustomPasswordInput from '@/components/CustomPasswordInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Estilo customizado para o botão principal
  const buttonStyle = "bg-blue-900 hover:bg-blue-800 text-white h-14 text-lg font-semibold rounded-xl";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Erro de Login",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      });
      // Redireciona para a página de perfil após o login
      navigate('/perfil');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header/Back Button */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <Link to="/">
          <ArrowLeft className="text-blue-900 dark:text-blue-400 h-6 w-6" />
        </Link>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Logo FeelOne */}
        <div className="mb-10 flex flex-col items-center">
          <img
            src="/logo-feel-one.png"
            alt="Logo FeelOne"
            className="h-16 md:h-20 object-contain mx-auto"
          />
        </div>

        {/* Login Title */}
        <h1 className="text-3xl font-bold mb-6 w-full text-left text-blue-900 dark:text-blue-400">
          Login
        </h1>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          <CustomInput 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <CustomPasswordInput 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Links de Lembrete/Esqueci */}
          <div className="flex justify-between text-sm pt-1 pb-4">
            <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Lembrar senha
            </Link>
            <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Esqueceu sua senha
            </Link>
          </div>

          <Button type="submit" className={`w-full ${buttonStyle}`} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        {/* Cadastro Link */}
        <div className="flex justify-center space-x-1 mt-6 w-full text-base">
          <span className="text-gray-700 dark:text-gray-300">Não tem uma conta?</span>
          <Link to="/cadastro/dados-pessoais" className="text-blue-900 dark:text-blue-400 font-bold hover:underline">
            Cadastrar
          </Link>
        </div>

        {/* Patrocinador Logo */}
        <div className="mt-12 w-full flex justify-center">
          <div className="text-center">
            <img
              src="/esportes-da-sorte-seeklogo.png"
              alt="Logo Esportes da Sorte"
              className="h-12 md:h-16 object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;