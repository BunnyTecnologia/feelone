import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import NewGroupDialog from '@/components/NewGroupDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

interface Group {
  id: string;
  nome: string;
}

const Chat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();
  const isMobile = useIsMobile();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [isNewGroupDialogOpen, setIsNewGroupDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. Fetch User ID
  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      } else {
        // Redirecionar se não estiver logado
        navigate('/login');
      }
    };
    getUserId();
  }, [navigate]);

  // 2. Fetch Groups
  const fetchGroups = useCallback(async (userId: string) => {
    setLoadingGroups(true);
    
    // Busca grupos onde o usuário é criador OU membro
    const { data, error } = await supabase
      .from('membros_grupo')
      .select('grupo_id, grupos_chat(id, nome)')
      .eq('user_id', userId);

    if (error) {
      toast({ title: "Erro", description: `Falha ao carregar grupos: ${error.message}`, variant: "destructive" });
    } else {
      // Mapeia para a estrutura Group[]
      const fetchedGroups: Group[] = (data || [])
        .map(item => item.grupos_chat)
        .filter((g): g is Group => g !== null);
      
      setGroups(fetchedGroups);

      // Se estiver no desktop e não houver grupo selecionado, selecione o primeiro
      if (!isMobile && !groupId && fetchedGroups.length > 0) {
        navigate(`/chat/${fetchedGroups[0].id}`, { replace: true });
      }
    }
    setLoadingGroups(false);
  }, [groupId, isMobile, navigate, toast]);

  useEffect(() => {
    if (currentUserId) {
      fetchGroups(currentUserId);
    }
  }, [currentUserId, fetchGroups]);

  const handleGroupCreated = (newGroupId: string) => {
    // Recarrega a lista de grupos e navega para o novo grupo
    if (currentUserId) {
      fetchGroups(currentUserId);
      navigate(`/chat/${newGroupId}`);
    }
  };

  const activeGroup = groups.find(g => g.id === groupId);

  if (!currentUserId) {
    return null; // Esperando redirecionamento
  }

  // Renderização para Mobile: Se um groupId estiver selecionado, mostra apenas a janela de chat
  if (isMobile && groupId && activeGroup) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 h-full">
          <ChatWindow 
            groupId={groupId} 
            groupName={activeGroup.nome} 
            currentUserId={currentUserId} 
          />
        </div>
        <MobileNavbar />
      </div>
    );
  }

  // Renderização para Desktop ou Mobile (lista de grupos)
  return (
    <div className={cn(
      "min-h-screen flex flex-col bg-white dark:bg-gray-900",
      !isMobile && "flex-row" // Desktop layout
    )}>
      
      {/* Header (Apenas para Mobile sem grupo selecionado) */}
      {isMobile && !groupId && (
        <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
          <div className="flex items-center space-x-4">
            <Link to="/perfil">
              <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-[#3A00FF]">
              Chat
            </h1>
          </div>
        </header>
      )}

      {/* Sidebar (Lista de Grupos) */}
      <div className={cn(
        "w-full",
        !isMobile ? "h-screen" : (groupId ? "hidden" : "flex-1 max-w-sm md:max-w-md mx-auto")
      )}>
        <ChatSidebar 
          groups={groups} 
          onNewGroup={() => setIsNewGroupDialogOpen(true)} 
          activeGroupId={groupId || null}
        />
      </div>

      {/* Janela de Chat (Apenas Desktop ou Mobile com grupo selecionado) */}
      {(!isMobile || groupId) && (
        <div className={cn(
          "flex-1",
          isMobile ? "fixed inset-0 z-50 bg-white dark:bg-gray-900" : "h-screen"
        )}>
          {activeGroup && currentUserId ? (
            <ChatWindow 
              groupId={activeGroup.id} 
              groupName={activeGroup.nome} 
              currentUserId={currentUserId} 
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              {loadingGroups ? 'Carregando grupos...' : 'Selecione um grupo para começar a conversar.'}
            </div>
          )}
        </div>
      )}

      {/* Navbar Móvel (Apenas Mobile) */}
      {isMobile && <MobileNavbar />}

      {/* Modal de Criação de Grupo */}
      <NewGroupDialog 
        isOpen={isNewGroupDialogOpen}
        onClose={() => setIsNewGroupDialogOpen(false)}
        onGroupCreated={handleGroupCreated}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default Chat;