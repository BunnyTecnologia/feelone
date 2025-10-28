import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AvailabilitySlot {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
}

const daysOfWeek = [
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

const AgendaAdmin = () => {
  const { toast } = useToast();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<Partial<AvailabilitySlot> | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('disponibilidade')
      .select('id, dia_semana, hora_inicio, hora_fim')
      .eq('user_id', user.id)
      .order('dia_semana', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSlots(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSlot?.dia_semana === undefined || !currentSlot?.hora_inicio || !currentSlot?.hora_fim) {
      toast({ title: "Atenção", description: "Dia da semana, hora de início e fim são obrigatórios.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      dia_semana: currentSlot.dia_semana,
      hora_inicio: currentSlot.hora_inicio,
      hora_fim: currentSlot.hora_fim,
    };

    let error = null;

    if (currentSlot.id) {
      // Update
      const { error: updateError } = await supabase
        .from('disponibilidade')
        .update(payload)
        .eq('id', currentSlot.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('disponibilidade')
        .insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Disponibilidade salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentSlot(null);
      fetchSlots();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este slot de disponibilidade?")) return;

    const { error } = await supabase
      .from('disponibilidade')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Slot deletado.", });
      fetchSlots();
    }
  };

  const openNewDialog = () => {
    setCurrentSlot({ dia_semana: 1, hora_inicio: '09:00', hora_fim: '18:00' });
    setIsDialogOpen(true);
  };

  const getDayLabel = (dayValue: number) => {
    return daysOfWeek.find(d => d.value === dayValue)?.label || 'Dia Desconhecido';
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
              Admin Agenda
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
        <h2 className="text-xl font-bold text-gray-900 dark:text-white w-full text-left mb-4">
          Slots de Disponibilidade
        </h2>
        
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : slots.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <CalendarCheck className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum slot de disponibilidade cadastrado.</p>
          </div>
        ) : (
          slots.map((slot) => (
            <Card key={slot.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{getDayLabel(slot.dia_semana)}</p>
                  <p className="text-sm text-gray-500 flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{slot.hora_inicio.substring(0, 5)} - {slot.hora_fim.substring(0, 5)}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  {/* Não vamos permitir edição direta de slots, apenas exclusão para simplificar o CRUD */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(slot.id)}
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

      {/* Dialog de Novo Slot */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
              Novo Slot de Disponibilidade
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dia_semana">Dia da Semana</Label>
              <Select 
                onValueChange={(value) => setCurrentSlot({ ...currentSlot, dia_semana: parseInt(value) })} 
                value={currentSlot?.dia_semana?.toString()}
                required
              >
                <SelectTrigger className="border-2 border-[#3A00FF] h-14 text-base rounded-xl">
                  <SelectValue placeholder="Selecione o dia..." />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.value} value={day.value.toString()}>{day.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hora_inicio">Hora Início</Label>
                <CustomInput
                  id="hora_inicio"
                  type="time"
                  value={currentSlot?.hora_inicio || '09:00'}
                  onChange={(e) => setCurrentSlot({ ...currentSlot, hora_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hora_fim">Hora Fim</Label>
                <CustomInput
                  id="hora_fim"
                  type="time"
                  value={currentSlot?.hora_fim || '18:00'}
                  onChange={(e) => setCurrentSlot({ ...currentSlot, hora_fim: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700">
                Adicionar Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgendaAdmin;