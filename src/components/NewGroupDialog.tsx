import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface NewGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (groupId: string) => void;
  currentUserId: string;
}

const NewGroupDialog: React.FC<NewGroupDialogProps> = ({ isOpen, onClose, onGroupCreated, currentUserId }) => {
  const { toast } = useToast();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setGroupName('');
    }
  }, [isOpen]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim().length < 3) {
      toast({ title: "Atenção", description: "O nome do grupo deve ter pelo menos 3 caracteres.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // 1. Criar o grupo
    const { data: groupData, error: groupError } = await supabase
      .from('grupos_chat')
      .insert({ nome: groupName.trim(), criador_id: currentUserId })
      .select('id')
      .single();

    if (groupError || !groupData) {
      setLoading(false);
      toast({ title: "Erro", description: `Falha ao criar grupo: ${groupError?.message || 'Erro desconhecido'}`, variant: "destructive" });
      return;
    }

    const newGroupId = groupData.id;

    // 2. Adicionar o criador como membro
    const { error: memberError } = await supabase
      .from('membros_grupo')
      .insert({ grupo_id: newGroupId, user_id: currentUserId });

    setLoading(false);

    if (memberError) {
      toast({ title: "Erro", description: `Falha ao adicionar criador ao grupo: ${memberError.message}`, variant: "destructive" });
      // Nota: Em um cenário real, você também deletaria o grupo criado se a adição do membro falhar.
      return;
    }

    toast({ title: "Sucesso!", description: `Grupo "${groupName}" criado com sucesso.`, });
    onGroupCreated(newGroupId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
            Criar Novo Grupo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateGroup} className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Nome do Grupo</Label>
            <CustomInput
              id="groupName"
              placeholder="Ex: Time de Planejamento"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={loading}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : 'Criar Grupo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewGroupDialog;