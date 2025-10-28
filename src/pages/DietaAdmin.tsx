import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Diet {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
}

const DietaAdmin = () => {
  const { toast } = useToast();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDiet, setCurrentDiet] = useState<Partial<Diet> | null>(null);

  const fetchDiets = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('dietas')
      .select('id, titulo, descricao, data_inicio, data_fim')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setDiets(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiets();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDiet?.titulo || !currentDiet?.data_inicio || !currentDiet?.data_fim) {
      toast({ title: "Atenção", description: "Título e datas são obrigatórios.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      titulo: currentDiet.titulo,
      descricao: currentDiet.descricao || '',
      data_inicio: currentDiet.data_inicio,
      data_fim: currentDiet.data_fim,
    };

    let error = null;

    if (currentDiet.id) {
      // Update
      const { error: updateError } = await supabase
        .from('dietas')
        .update(payload)
        .eq('id', currentDiet.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('dietas')
        .insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Dieta salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentDiet(null);
      fetchDiets();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta dieta?")) return;

    const { error } = await supabase
      .from('dietas')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Dieta deletada.", });
      fetchDiets();
    }
  };

  const openEditDialog = (diet: Diet) => {
    setCurrentDiet(diet);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentDiet({ titulo: '', descricao: '', data_inicio: '', data_fim: '' });
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
              Admin Dietas
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
        ) : diets.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Utensils className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma dieta cadastrada.</p>
          </div>
        ) : (
          diets.map((diet) => (
            <Card key={diet.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white truncate">{diet.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {new Date(diet.data_inicio).toLocaleDateString('pt-BR')} - {new Date(diet.data_fim).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(diet)}
                    className="text-[#3A00FF] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(diet.id)}
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
              {currentDiet?.id ? 'Editar Dieta' : 'Nova Dieta'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <CustomInput
                id="titulo"
                value={currentDiet?.titulo || ''}
                onChange={(e) => setCurrentDiet({ ...currentDiet, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <CustomTextarea
                id="descricao"
                value={currentDiet?.descricao || ''}
                onChange={(e) => setCurrentDiet({ ...currentDiet, descricao: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data_inicio">Data Início</Label>
                <CustomInput
                  id="data_inicio"
                  type="date"
                  value={currentDiet?.data_inicio ? currentDiet.data_inicio.split('T')[0] : ''}
                  onChange={(e) => setCurrentDiet({ ...currentDiet, data_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_fim">Data Fim</Label>
                <CustomInput
                  id="data_fim"
                  type="date"
                  value={currentDiet?.data_fim ? currentDiet.data_fim.split('T')[0] : ''}
                  onChange={(e) => setCurrentDiet({ ...currentDiet, data_fim: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700">
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DietaAdmin;