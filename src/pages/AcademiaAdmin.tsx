import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Workout {
  id: string;
  titulo: string;
  descricao: string;
  foco: string;
  duracao_dias: number;
}

const AcademiaAdmin = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Partial<Workout> | null>(null);

  // Efeito para verificar o estado de navegação e abrir o modal
  useEffect(() => {
    if (location.state && (location.state as { openNew?: boolean }).openNew) {
      openNewDialog();
      // Limpa o estado para que o modal não abra novamente ao recarregar a página
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchWorkouts = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('series_exercicios')
      .select('id, titulo, descricao, foco, duracao_dias')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setWorkouts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWorkout?.titulo || !currentWorkout?.foco || currentWorkout?.duracao_dias === undefined) {
      toast({ title: "Atenção", description: "Título, Foco e Duração são obrigatórios.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      titulo: currentWorkout.titulo,
      descricao: currentWorkout.descricao || '',
      foco: currentWorkout.foco,
      duracao_dias: currentWorkout.duracao_dias,
    };

    let error = null;

    if (currentWorkout.id) {
      // Update
      const { error: updateError } = await supabase
        .from('series_exercicios')
        .update(payload)
        .eq('id', currentWorkout.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('series_exercicios')
        .insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Série salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentWorkout(null);
      fetchWorkouts();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta série?")) return;

    const { error } = await supabase
      .from('series_exercicios')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Série deletada.", });
      fetchWorkouts();
    }
  };

  const openEditDialog = (workout: Workout) => {
    setCurrentWorkout(workout);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentWorkout({ titulo: '', descricao: '', foco: '', duracao_dias: 7 });
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
              Admin Academia
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
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Dumbbell className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma série cadastrada.</p>
          </div>
        ) : (
          workouts.map((workout) => (
            <Card key={workout.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white truncate">{workout.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Foco: {workout.foco} | Duração: {workout.duracao_dias} dias
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(workout)}
                    className="text-[#3A00FF] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(workout.id)}
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
              {currentWorkout?.id ? 'Editar Série' : 'Nova Série'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <CustomInput
                id="titulo"
                value={currentWorkout?.titulo || ''}
                onChange={(e) => setCurrentWorkout({ ...currentWorkout, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foco">Foco (Ex: Pernas, Braços)</Label>
              <CustomInput
                id="foco"
                value={currentWorkout?.foco || ''}
                onChange={(e) => setCurrentWorkout({ ...currentWorkout, foco: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duracao_dias">Duração (dias)</Label>
              <CustomInput
                id="duracao_dias"
                type="number"
                value={currentWorkout?.duracao_dias || 7}
                onChange={(e) => setCurrentWorkout({ ...currentWorkout, duracao_dias: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição/Detalhes</Label>
              <CustomTextarea
                id="descricao"
                value={currentWorkout?.descricao || ''}
                onChange={(e) => setCurrentWorkout({ ...currentWorkout, descricao: e.target.value })}
              />
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

export default AcademiaAdmin;