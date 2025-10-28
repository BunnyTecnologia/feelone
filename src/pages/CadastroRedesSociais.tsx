import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SocialInputBlock from '@/components/SocialInputBlock';

const CadastroRedesSociais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados para os valores dos inputs
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [site, setSite] = useState('');
  const [pix, setPix] = useState('');

  // Estados para os checkboxes "Não desejo colocar"
  const [skipFacebook, setSkipFacebook] = useState(false);
  const [skipInstagram, setSkipInstagram] = useState(false);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [skipSite, setSkipSite] = useState(false);
  const [skipPix, setSkipPix] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário não logado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    // Prepara os dados para upsert
    const profileData = {
      id: user.id,
      link_facebook: skipFacebook ? null : facebook,
      link_instagram: skipInstagram ? null : instagram,
      celular_whatsapp: skipWhatsapp ? null : whatsapp,
      link_site: skipSite ? null : site,
      chave_pix: skipPix ? null : pix,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar Redes Sociais",
        description: `Falha ao salvar dados: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Redes sociais salvas. Redirecionando para o Endereço.",
    });

    // Redirecionar para a próxima etapa do cadastro
    navigate('/cadastro/endereco');
  };

  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/cadastro/dados-pessoais">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Redes Sociais
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          <SocialInputBlock 
            placeholder="Link Facebook" 
            id="facebook" 
            value={facebook}
            onValueChange={setFacebook}
            isSkipped={skipFacebook}
            onSkipChange={setSkipFacebook}
          />
          <SocialInputBlock 
            placeholder="Link Instagram" 
            id="instagram" 
            value={instagram}
            onValueChange={setInstagram}
            isSkipped={skipInstagram}
            onSkipChange={setSkipInstagram}
          />
          <SocialInputBlock 
            placeholder="Celular Whatsapp" 
            id="whatsapp" 
            value={whatsapp}
            onValueChange={setWhatsapp}
            isSkipped={skipWhatsapp}
            onSkipChange={setSkipWhatsapp}
          />
          <SocialInputBlock 
            placeholder="Site" 
            id="site" 
            value={site}
            onValueChange={setSite}
            isSkipped={skipSite}
            onSkipChange={setSkipSite}
          />
          <SocialInputBlock 
            placeholder="Chave Pix" 
            id="pix" 
            value={pix}
            onValueChange={setPix}
            isSkipped={skipPix}
            onSkipChange={setSkipPix}
          />

          {/* Botão Salvar */}
          <div className="pt-6 pb-8">
            <Button type="submit" className={`w-full ${saveButtonStyle}`}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroRedesSociais;