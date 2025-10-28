import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  conteudo: string;
  user_id: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
}

interface ChatWindowProps {
  groupId: string;
  groupName: string;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ groupId, groupName, currentUserId }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('mensagens')
        .select('id, conteudo, user_id, created_at, profiles(first_name, last_name, avatar_url)')
        .eq('grupo_id', groupId)
        .order('created_at', { ascending: true });

      if (error) {
        toast({ title: "Erro", description: `Falha ao carregar mensagens: ${error.message}`, variant: "destructive" });
      } else {
        setMessages(data as Message[] || []);
      }
      setLoading(false);
      scrollToBottom();
    };

    fetchMessages();
  }, [groupId, toast]);

  // 2. Setup Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`chat_group_${groupId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `grupo_id=eq.${groupId}` },
        (payload) => {
          // Fetch the full message data including profile information
          const fetchNewMessage = async () => {
            const newMsgId = (payload.new as Message).id;
            const { data, error } = await supabase
              .from('mensagens')
              .select('id, conteudo, user_id, created_at, profiles(first_name, last_name, avatar_url)')
              .eq('id', newMsgId)
              .single();

            if (error) {
              console.error("Error fetching new message details:", error);
              return;
            }
            
            setMessages(prev => [...prev, data as Message]);
            scrollToBottom();
          };
          fetchNewMessage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  // 3. Scroll to bottom on message update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const content = newMessage.trim();
    setNewMessage('');

    const { error } = await supabase
      .from('mensagens')
      .insert({
        grupo_id: groupId,
        user_id: currentUserId,
        conteudo: content,
      });

    if (error) {
      toast({ title: "Erro ao enviar", description: error.message, variant: "destructive" });
      setNewMessage(content); // Restore message if failed
    }
  };

  const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
    const isCurrentUser = message.user_id === currentUserId;
    const senderName = message.profiles ? `${message.profiles.first_name} ${message.profiles.last_name}` : 'Usuário Desconhecido';
    const time = format(new Date(message.created_at), 'HH:mm');

    return (
      <div className={cn("flex mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
        <div className={cn(
          "max-w-[80%] p-3 rounded-xl shadow-md",
          isCurrentUser 
            ? "bg-[#3A00FF] text-white rounded-br-none" 
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none"
        )}>
          {!isCurrentUser && (
            <p className="text-xs font-bold mb-1" style={{ color: '#3A00FF' }}>
              {senderName}
            </p>
          )}
          <p className="text-sm">{message.conteudo}</p>
          <span className={cn("block mt-1 text-right text-xs", isCurrentUser ? "text-white/70" : "text-gray-500 dark:text-gray-400")}>
            {time}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do Chat */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{groupName}</h3>
        <User className="h-6 w-6 text-[#3A00FF]" />
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-gray-900">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 pt-10">
            <p>Comece a conversa!</p>
          </div>
        ) : (
          messages.map(msg => <MessageBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex space-x-3">
          <CustomInput
            placeholder="Digite sua mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 h-12"
            disabled={loading}
          />
          <Button 
            type="submit" 
            className="bg-[#3A00FF] hover:bg-indigo-700 h-12 w-12 p-0"
            disabled={loading || newMessage.trim() === ''}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;