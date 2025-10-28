import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Group {
  id: string;
  nome: string;
}

interface ChatSidebarProps {
  groups: Group[];
  onNewGroup: () => void;
  activeGroupId: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ groups, onNewGroup, activeGroupId }) => {
  return (
    <div className="w-full md:w-72 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col h-full">
      <div className="p-4 flex justify-between items-center border-b dark:border-gray-700">
        <h2 className="text-xl font-bold text-[#3A00FF] flex items-center space-x-2">
          <MessageSquare className="h-6 w-6" />
          <span>Chats</span>
        </h2>
        <Button 
          onClick={onNewGroup}
          className="bg-[#3A00FF] hover:bg-indigo-700 text-white rounded-full p-2 h-8 w-8"
          aria-label="Criar novo grupo"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {groups.length === 0 ? (
          <p className="text-center text-sm text-gray-500 mt-4">Nenhum grupo encontrado.</p>
        ) : (
          groups.map((group) => (
            <Link 
              key={group.id} 
              to={`/chat/${group.id}`}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors space-x-3",
                activeGroupId === group.id 
                  ? "bg-[#D9D0FF] text-[#3A00FF] font-semibold" 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
              )}
            >
              <Users className="h-5 w-5" />
              <span className="truncate">{group.nome}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;