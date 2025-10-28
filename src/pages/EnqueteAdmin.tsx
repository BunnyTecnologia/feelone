import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, HelpCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Option {
  id: string;
  texto_opcao: string;
}

interface Poll {
  id: string;
  pergunta: string;
  ativa: boolean;
  options: Option[];
}

const EnqueteAdmin = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<Partial<Poll> | null>(null);
  const [newOptionText, setNewOptionText] = useState('');

  // Efeito para verificar o estado de navegação e abrir o modal
  useEffect(() => {
    if (location.state && (location.state as { openNew?: boolean }).openNew) {
      openNewDialog();
      // Limpa o estado para que o modal não abra novamente ao recarregar a página
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchPolls = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Busca enquetes e opções relacionadas
    const { data, error } = await supabase
      .from('enquetes')
      .select('id, pergunta, ativa, opcoes_enquete(id, texto_opcao)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setPolls(data as Poll[] || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleSavePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPoll?.pergunta) {
      toast({ title: "Atenção", description: "A pergunta é obrigatória.", variant: "destructive" });
      return;
    }
    if (!currentPoll.id && (currentPoll.options?.length || 0) < 2) {
        toast({ title: "Atenção", description: "Uma nova enquete precisa de pelo menos duas opções.", variant: "destructive" });
        return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let pollId = currentPoll.id;
    let error = null;

    if (pollId) {
      // Update Poll
      const { error: updateError } = await supabase
        .from('enquetes')
        .update({ pergunta: currentPoll.pergunta, ativa: currentPoll.ativa })
        .eq('id', pollId);
      error = updateError;
    } else {
      // Insert Poll
      const { data: insertData, error: insertError } = await supabase
        .from('enquetes')
        .insert({ user_id: user.id, pergunta: currentPoll.pergunta, ativa: true })
        .select('id')
        .single();
      
      error = insertError;
      if (insertData) {
        pollId = insertData.id;
      }
    }

    if (error) {
      toast({ title: "Erro ao salvar enquete", description: error.message, variant: "destructive" });
      return;
    }

    // Se for uma nova enquete, insere as opções temporárias
    if (pollId && !currentPoll.id && currentPoll.options) {
        const optionsPayload = currentPoll.options.map(opt => ({
            enquete_id: pollId,
            texto_opcao: opt.texto_opcao
        }));
        const { error: optionsError } = await supabase
            .from('opcoes_enquete')
            .insert(optionsPayload);
        
        if (optionsError) {
            toast({ title: "Erro ao salvar opções", description: optionsError.message, variant: "destructive" });
            return;
        }
    }

    toast({ title: "Sucesso", description: "Enquete salva com sucesso.", });
    setIsDialogOpen(false);
    setCurrentPoll(null);
    fetchPolls();
  };

  const handleDeletePoll = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta enquete e todos os seus votos?")) return;

    const { error } = await supabase
      .from('enquetes')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Enquete deletada.", });
      fetchPolls();
    }
  };

  const handleAddOption = () => {
    if (newOptionText.trim() === '') return;
    
    const newOption: Option = { id: `temp-${Date.now()}`, texto_opcao: newOptionText };
    
    setCurrentPoll(prev => ({
        ...prev,
        options: [...(prev?.options || []), newOption]
    }));
    setNewOptionText('');
  };

  const handleRemoveOption = (optionId: string) => {
    setCurrentPoll(prev => ({
        ...prev,
        options: prev?.options?.filter(opt => opt.id !== optionId)
    }));
  };

  const openEditDialog = (poll: Poll) => {
    setCurrentPoll(poll);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentPoll({ pergunta: '', ativa: true, options: [] });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/perfil">
              <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-[#3A00FF]">
              Admin Enquetes
            </h1>
          </div>
          <Button 
            onClick={openNewDialog}
            className="bg-[#3A00FF] hover:bg-indigo-700 text-white rounded-full p-2 h-10 w-10"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="w-full max-w-sm md:max-w-md flex flex-col items-center space-y-4 pb-8">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : polls.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma enquete cadastrada.</p>
          </div>
        ) : (
          polls.map((poll) => (
            <Card key={poll.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white truncate">{poll.pergunta}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex justify-between items-center">
                <p className={`text-sm font-semibold ${poll.ativa ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {poll.ativa ? 'Ativa' : 'Inativa'}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(poll)}
                    className="text-[#3A00FF] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDeletePoll(poll.id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>

      {/* Dialog de CRUD */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
              {currentPoll?.id ? 'Editar Enquete' : 'Nova Enquete'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSavePoll} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pergunta">Pergunta da Enquete</Label>
              <CustomInput
                id="pergunta"
                value={currentPoll?.pergunta || ''}
                onChange={(e) => setCurrentPoll({ ...currentPoll, pergunta: e.target.value })}
                required
              />
            </div>
            
            {/* Gerenciamento de Opções (Apenas para novas enquetes ou se for complexo gerenciar edições de opções existentes) */}
            {!currentPoll?.id && (
                <div className="space-y-4 border p-3 rounded-lg">
                    <Label className="text-lg font-bold">Opções de Resposta</Label>
                    
                    {currentPoll?.options?.map((option) => (
                        <div key={option.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            <span className="text-sm">{option.texto_opcao}</span>
                            <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleRemoveOption(option.id)}
                                className="text-red-500 h-6 w-6"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <div className="flex space-x-2">
                        <CustomInput
                            placeholder="Nova Opção"
                            value={newOptionText}
                            onChange={(e) => setNewOptionText(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddOption} className="bg-green-600 hover:bg-green-700">
                            Adicionar
                        </Button>
                    </div>
                </div>
            )}

            {/* Status (Apenas para enquetes existentes) */}
            {currentPoll?.id && (
                <div className="space-y-2">
                    <Label htmlFor="ativa">Status</Label>
                    <select
                        id="ativa"
                        value={currentPoll.ativa ? 'true' : 'false'}
                        onChange={(e) => setCurrentPoll({ ...currentPoll, ativa: e.target.value === 'true' })}
                        className="w-full border-2 border-[#3A00FF] h-14 text-base placeholder:text-gray-500 rounded-xl p-3 bg-white dark:bg-gray-900"
                    >
                        <option value="true">Ativa</option>
                        <option value="false">Inativa</option>
                    </select>
                </div>
            )}

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700">
                Salvar Enquete
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnqueteAdmin;