import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Clock, CalendarCheck, Check, X, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AvailabilitySlot {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
}

interface Appointment {
  id: string;
  data_hora_agendamento: string;
  motivo: string;
  status: 'pendente' | 'confirmado' | 'cancelado';
  agendador_id: string | null;
  profiles: { // Perfil do agendador
    first_name: string | null;
    last_name: string | null;
  } | null;
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
  const location = useLocation();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentSlot, setCurrentSlot] = useState<Partial<AvailabilitySlot> | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Efeito para verificar o estado de navegação e abrir o modal
  useEffect(() => {
    if (location.state && (location.state as { openNew?: boolean }).openNew) {
      openNewDialog();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
    if (user?.id) {
      fetchSlots(user.id);
      fetchAppointments(user.id);
    } else {
      setLoadingSlots(false);
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchSlots = async (id: string) => {
    setLoadingSlots(true);
    const { data, error } = await supabase
      .from('disponibilidade')
      .select('id, dia_semana, hora_inicio, hora_fim')
      .eq('user_id', id)
      .order('dia_semana', { ascending: true })
      .order('hora_inicio', { ascending: true });

    if (error) {
      toast({ title: "Erro", description: `Falha ao carregar slots: ${error.message}`, variant: "destructive" });
    } else {
      setSlots(data || []);
    }
    setLoadingSlots(false);
  };

  const fetchAppointments = async (id: string) => {
    setLoadingAppointments(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id, data_hora_agendamento, motivo, status, agendador_id,
        profiles (first_name, last_name)
      `)
      .eq('dono_perfil_id', id)
      .order('data_hora_agendamento', { ascending: true });

    if (error) {
      toast({ title: "Erro", description: `Falha ao carregar agendamentos: ${error.message}`, variant: "destructive" });
    } else {
      setAppointments(data as Appointment[] || []);
    }
    setLoadingAppointments(false);
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSlot?.dia_semana === undefined || !currentSlot?.hora_inicio || !currentSlot?.hora_fim) {
      toast({ title: "Atenção", description: "Dia da semana, hora de início e fim são obrigatórios.", variant: "destructive" });
      return;
    }

    if (!userId) return;

    const payload = {
      user_id: userId,
      dia_semana: currentSlot.dia_semana,
      hora_inicio: currentSlot.hora_inicio,
      hora_fim: currentSlot.hora_fim,
    };

    const { error } = await supabase
      .from('disponibilidade')
      .insert(payload);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Disponibilidade salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentSlot(null);
      fetchSlots(userId);
    }
  };

  const handleDeleteSlot = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar este slot de disponibilidade?")) return;
    if (!userId) return;

    const { error } = await supabase
      .from('disponibilidade')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Slot deletado.", });
      fetchSlots(userId);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, newStatus: 'confirmado' | 'cancelado') => {
    if (!userId) return;

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      toast({ title: "Erro", description: `Falha ao atualizar status: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: `Agendamento ${newStatus === 'confirmado' ? 'confirmado' : 'cancelado'}.`, });
      fetchAppointments(userId);
    }
  };

  const openNewDialog = () => {
    setCurrentSlot({ dia_semana: 1, hora_inicio: '09:00', hora_fim: '18:00' });
    setIsDialogOpen(true);
  };

  const getDayLabel = (dayValue: number) => {
    return daysOfWeek.find(d => d.value === dayValue)?.label || 'Dia Desconhecido';
  };

  // Agrupar agendamentos por data
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const dateKey = format(parseISO(appointment.data_hora_agendamento), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const sortedDates = Object.keys(groupedAppointments).sort();

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const date = parseISO(appointment.data_hora_agendamento);
    const time = format(date, 'HH:mm');
    const name = appointment.profiles ? `${appointment.profiles.first_name || ''} ${appointment.profiles.last_name || ''}`.trim() : 'Usuário (ID: ' + appointment.agendador_id?.slice(0, 4) + '...)';

    let statusClass = "text-gray-500";
    let statusText = "Pendente";
    if (appointment.status === 'confirmado') {
      statusClass = "text-green-600";
      statusText = "Confirmado";
    } else if (appointment.status === 'cancelado') {
      statusClass = "text-red-600";
      statusText = "Cancelado";
    }

    return (
      <Card className="w-full shadow-md border border-gray-200 dark:border-gray-700">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-[#3A00FF]">{time}</p>
              <p className="text-sm text-gray-900 dark:text-white font-semibold truncate">{name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Motivo: {appointment.motivo || 'Não informado'}</p>
            </div>
            <span className={cn("text-sm font-semibold", statusClass)}>{statusText}</span>
          </div>

          {appointment.status === 'pendente' && (
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmado')}
              >
                <Check className="h-4 w-4 mr-1" /> Confirmar
              </Button>
              <Button 
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 flex-1"
                onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelado')}
              >
                <X className="h-4 w-4 mr-1" /> Recusar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
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

      <main className="w-full max-w-sm md:max-w-md flex flex-col items-center space-y-8 pb-8">
        
        {/* Seção 1: Agendamentos */}
        <div className="w-full space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white w-full text-left border-b pb-2 mb-4">
            Agendamentos Recebidos
          </h2>
          
          {loadingAppointments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
            </div>
          ) : sortedDates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <CalendarCheck className="h-12 w-12 mx-auto mb-4" />
              <p>Nenhum agendamento recebido.</p>
            </div>
          ) : (
            sortedDates.map(dateKey => (
              <div key={dateKey} className="space-y-3">
                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-4">
                  {format(parseISO(dateKey), 'EEEE, dd/MM/yyyy', { locale: ptBR })}
                </h3>
                {groupedAppointments[dateKey].map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Seção 2: Slots de Disponibilidade */}
        <div className="w-full space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white w-full text-left border-b pb-2 mb-4">
            Gerenciar Disponibilidade
          </h2>
          
          {loadingSlots ? (
            <p className="text-gray-500">Carregando slots...</p>
          ) : slots.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Clock className="h-12 w-12 mx-auto mb-4" />
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
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      {/* Dialog de Novo Slot */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
              Novo Slot de Disponibilidade
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSlot} className="grid gap-4 py-4">
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