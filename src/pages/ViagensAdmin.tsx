import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Plane } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Trip {
  id: string;
  titulo: string;
  localizacao: string;
  descricao: string;
  data_viagem: string;
}

const ViagensAdmin = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Partial<Trip> | null>(null);

  // Efeito para verificar o estado de navegação e abrir o modal
  useEffect(() => {
    if (location.state && (location.state as { openNew?: boolean }).openNew) {
      openNewDialog();
      // Limpa o estado para que o modal não abra novamente ao recarregar a página
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchTrips = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('viagens')
      .select('id, titulo, localizacao, descricao, data_viagem')
      .eq('user_id', user.id)
      .order('data_viagem', { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTrip?.titulo || !currentTrip?.localizacao || !currentTrip?.data_viagem) {
      toast({ title: "Atenção", description: "Título, Localização e Data são obrigatórios.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      titulo: currentTrip.titulo,
      localizacao: currentTrip.localizacao,
      descricao: currentTrip.descricao || '',
      data_viagem: currentTrip.data_viagem,
    };

    let error = null;

    if (currentTrip.id) {
      // Update
      const { error: updateError } = await supabase
        .from('viagens')
        .update(payload)
        .eq('id', currentTrip.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('viagens')
        .insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Viagem salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentTrip(null);
      fetchTrips();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta viagem?")) return;

    const { error } = await supabase
      .from('viagens')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Viagem deletada.", });
      fetchTrips();
    }
  };

  const openEditDialog = (trip: Trip) => {
    setCurrentTrip(trip);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentTrip({ titulo: '', localizacao: '', descricao: '', data_viagem: '' });
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
              Admin Viagens
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
        ) : trips.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Plane className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma viagem cadastrada.</p>
          </div>
        ) : (
          trips.map((trip) => (
            <Card key={trip.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white truncate">{trip.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {trip.localizacao} | Data: {new Date(trip.data_viagem).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(trip)}
                    className="text-[#3A00FF] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(trip.id)}
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
              {currentTrip?.id ? 'Editar Viagem' : 'Nova Viagem'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <CustomInput
                id="titulo"
                value={currentTrip?.titulo || ''}
                onChange={(e) => setCurrentTrip({ ...currentTrip, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="localizacao">Localização</Label>
              <CustomInput
                id="localizacao"
                value={currentTrip?.localizacao || ''}
                onChange={(e) => setCurrentTrip({ ...currentTrip, localizacao: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_viagem">Data da Viagem</Label>
              <CustomInput
                id="data_viagem"
                type="date"
                value={currentTrip?.data_viagem ? currentTrip.data_viagem.split('T')[0] : ''}
                onChange={(e) => setCurrentTrip({ ...currentTrip, data_viagem: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição/Detalhes</Label>
              <CustomTextarea
                id="descricao"
                value={currentTrip?.descricao || ''}
                onChange={(e) => setCurrentTrip({ ...currentTrip, descricao: e.target.value })}
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

export default ViagensAdmin;