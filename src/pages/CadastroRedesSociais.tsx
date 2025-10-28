import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SocialInputBlock from '@/components/SocialInputBlock';
import { useProfileData } from '@/hooks/useProfileData';

const CadastroRedesSociais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading, userId } = useProfileData();

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

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setFacebook(profile.link_facebook || '');
      setInstagram(profile.link_instagram || '');
      setWhatsapp(profile.celular_whatsapp || '');
      setSite(profile.link_site || '');
      setPix(profile.chave_pix || '');

      setSkipFacebook(!profile.link_facebook);
      setSkipInstagram(!profile.link_instagram);
      setSkipWhatsapp(!profile.celular_whatsapp);
      setSkipSite(!profile.link_site);
      setSkipPix(!profile.chave_pix);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário não logado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    // Prepara os dados para upsert
    const profileData = {
      id: userId,
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
      description: "Redes sociais salvas.",
    });

    // Redirecionar para a próxima etapa do cadastro ou para Minhas Informações
    navigate('/minhas-informacoes');
  };

  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/minhas-informacoes">
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
            label="Link Facebook" 
            id="facebook" 
            value={facebook}
            onValueChange={setFacebook}
            isSkipped={skipFacebook}
            onSkipChange={setSkipFacebook}
          />
          <SocialInputBlock 
            label="Link Instagram" 
            id="instagram" 
            value={instagram}
            onValueChange={setInstagram}
            isSkipped={skipInstagram}
            onSkipChange={setSkipInstagram}
          />
          <SocialInputBlock 
            label="Celular Whatsapp" 
            id="whatsapp" 
            value={whatsapp}
            onValueChange={setWhatsapp}
            isSkipped={skipWhatsapp}
            onSkipChange={setSkipWhatsapp}
          />
          <SocialInputBlock 
            label="Site" 
            id="site" 
            value={site}
            onValueChange={setSite}
            isSkipped={skipSite}
            onSkipChange={setSkipSite}
          />
          <SocialInputBlock 
            label="Chave Pix" 
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