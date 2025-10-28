import React from 'react';
import { ArrowLeft, ShoppingCart, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import HealthDataItem from '@/components/HealthDataItem';
import { useProfileData } from '@/hooks/useProfileData';
import { Skeleton } from '@/components/ui/skeleton';

const CarteirinhaDeEmergencia = () => {
  // Cores e estilos baseados na imagem
  const primaryColor = "#3A00FF";
  const secondaryColor = "#D9D0FF"; // Lilás claro para o fundo do card
  const titleColor = "#D93A3A"; // Vermelho para os títulos das seções

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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md mx-auto pt-4 pb-8 px-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <ArrowLeft className="text-primaryColor h-6 w-6" style={{ color: primaryColor }} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
            Carteirinha de Emergência
          </h1>
          <ShoppingCart className="text-primaryColor h-6 w-6" style={{ color: primaryColor }} />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28 text-center">
        
        {/* Avatar e Nome */}
        <div className="mb-8">
          <div 
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-3 overflow-hidden"
            style={{ backgroundColor: secondaryColor, border: `2px solid ${primaryColor}` }}
          >
            {loading ? (
              <Skeleton className="w-24 h-24 rounded-full" />
            ) : avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="h-16 w-16" style={{ color: primaryColor }} />
            )}
          </div>

          {loading ? (
            <>
              <Skeleton className="h-6 w-40 mx-auto mb-2" />
              <Skeleton className="h-4 w-56 mx-auto" />
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>
                {displayName}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subText}
              </p>
            </>
          )}
        </div>

        {/* Card de Dados de Saúde e Contato */}
        <div 
          className="p-6 rounded-3xl text-left shadow-lg"
          style={{ backgroundColor: secondaryColor }}
        >
          
          {/* Dados de Saúde */}
          <h3 className="text-xl font-bold mb-4" style={{ color: titleColor }}>
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
            <>
              <HealthDataItem title="Tipo Sanguíneo" value={tipoSanguineo} isBoldValue />
              <HealthDataItem title="Alergias" value={alergias} isBoldValue />
              <HealthDataItem title="Doenças Crônicas" value={doencasCronicas} isBoldValue />
              <HealthDataItem title="Medicamentos em Uso" value={medicamentosUso} isBoldValue />
            </>
          )}

          {/* Separador visual */}
          <div className="h-px bg-gray-300 my-6"></div>

          {/* Contato de Emergência */}
          <h3 className="text-xl font-bold mb-4" style={{ color: titleColor }}>
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
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome</p>
                <p className="text-[#3A00FF] font-bold text-lg">{emergenciaNome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefone</p>
                <div className="flex items-center space-x-2 text-[#3A00FF] font-bold text-lg">
                  <Phone className="h-5 w-5" />
                  <span>{emergenciaTelefone}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default CarteirinhaDeEmergencia;