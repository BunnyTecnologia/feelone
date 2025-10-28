import React from 'react';
import { ArrowLeft, Settings, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import HealthDataItem from '@/components/HealthDataItem';
import { useProfileData } from '@/hooks/useProfileData';
import { Skeleton } from '@/components/ui/skeleton';

const CarteirinhaDeEmergencia = () => {
  const { profile, loading } = useProfileData();

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Usuário'
    : 'Usuário';

  const subText = profile?.biografia || 'Sub-Sede não informada';

  const tipoSanguineo = profile?.tipo_sanguineo || 'Não informado';
  const alergias = profile?.alergias_medicamentos || 'Não informado';

  const doencasList: string[] = [];
  if (profile?.tem_problema_cardiaco) doencasList.push('Problema cardíaco');
  if (profile?.tem_diabetes) doencasList.push('Diabetes');
  if (profile?.tem_pressao_alta) doencasList.push('Pressão alta');
  const doencasCronicas = doencasList.length ? doencasList.join(', ') : 'Não informado';

  const medicamentosUso = profile?.medicamentos_uso || 'Não informado';

  const emergenciaNome = profile?.emergencia_nome || 'Não informado';
  const emergenciaTelefone = profile?.emergencia_telefone || 'Não informado';

  const avatarUrl = profile?.avatar_url || null;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      
      {/* Header com setas e engrenagem, mantendo acento roxo */}
      <header className="w-full max-w-sm md:max-w-md mx-auto pt-4 pb-6 px-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <ArrowLeft className="h-6 w-6 text-[#3A00FF]" />
          </Link>
          <h1 className="text-xl font-bold text-[#3A00FF]">
            Carteirinha de Emergência
          </h1>
          <Link to="/admin/menu">
            <Settings className="h-6 w-6 text-[#3A00FF]" />
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28 text-center">
        
        {/* Avatar e Nome */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full mx-auto mb-3 overflow-hidden shadow-xl border-4 border-white">
            {loading ? (
              <Skeleton className="w-32 h-32 rounded-full" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <User className="h-16 w-16 text-[#3A00FF]" />
              </div>
            )}
          </div>

          {loading ? (
            <>
              <Skeleton className="h-6 w-40 mx-auto mb-2" />
              <Skeleton className="h-4 w-56 mx-auto" />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-1 text-[#3A00FF]">
                {displayName}
              </h2>
              <p className="text-sm text-[#3A00FF] font-medium">
                {subText}
              </p>
            </>
          )}
        </div>

        {/* Card branco com borda roxa, cantos arredondados e sombra leve */}
        <div className="p-6 rounded-2xl text-left shadow-lg border-2 border-[#3A00FF] bg-white">
          
          {/* Dados de Saúde */}
          <h3 className="text-lg font-bold mb-4 text-[#3A00FF]">
            Dados de Saúde
          </h3>

          {loading ? (
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-36 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-5 w-56" />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <HealthDataItem title="Tipo Sanguíneo" value={tipoSanguineo} isBoldValue />
              <HealthDataItem title="Alergias" value={alergias} isBoldValue />
              <HealthDataItem title="Doenças Crônicas" value={doencasCronicas} isBoldValue />
              <HealthDataItem title="Medicamentos em Uso" value={medicamentosUso} isBoldValue />
            </div>
          )}

          {/* Separador visual */}
          <div className="h-px bg-gray-200 my-6"></div>

          {/* Contato de Emergência */}
          <h3 className="text-lg font-bold mb-4 text-[#3A00FF]">
            Contato de Emergência
          </h3>

          {loading ? (
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-5 w-48" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-5 w-40" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#3A00FF] mb-1">Nome</p>
                <p className="text-[#3A00FF] font-bold text-lg">{emergenciaNome}</p>
              </div>
              <div>
                <p className="text-sm text-[#3A00FF] mb-1">Telefone</p>
                <div className="flex items-center space-x-2 text-[#3A00FF] font-bold text-lg">
                  <Phone className="h-5 w-5" />
                  <span>{emergenciaTelefone}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo do Patrocinador (opcional, mantendo conceito da home) */}
        <div className="w-full flex justify-center mt-10">
          <img
            src="/esportes-da-sorte-seeklogo.png"
            alt="Logo Esportes da Sorte"
            className="h-20 md:h-24 object-contain mx-auto"
          />
        </div>
      </main>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default CarteirinhaDeEmergencia;