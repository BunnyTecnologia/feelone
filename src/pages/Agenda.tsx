import React, { useEffect, useState } from 'react';
import { ArrowLeft, CalendarCheck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import CustomTextarea from '@/components/CustomTextarea';
import { Label } from '@/components/ui/label';

interface AvailabilitySlot {
  id: string;
  dia_semana: number;
  hora_inicio: string;
  hora_fim: string;
}

interface Appointment {
  data_hora_agendamento: string;
  motivo: string;
}

const daysOfWeekMap: { [key: number]: string } = {
  0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta', 4: 'Quinta', 5: 'Sexta', 6: 'Sábado'
};

const Agenda = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<Appointment>({ data_hora_agendamento: '', motivo: '' });

  // ID do dono do perfil (Hardcoded para o exemplo, em um app real viria da rota/slug)
  // Usaremos o ID do usuário logado para buscar a disponibilidade dele mesmo, por enquanto.
  const [ownerId, setOwnerId] = useState<string | null>(null); 

  useEffect(() => {
    const fetchOwnerId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setOwnerId(user.id);
        fetchAvailability(user.id);
      } else {
        setLoading(false);
      }
    };
    fetchOwnerId();
  }, []);

  const fetchAvailability = async (userId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('disponibilidade')
      .select('id, dia_semana, hora_inicio, hora_fim')
      .eq('user_id', userId);

    if (error) {
      toast({ title: "Erro", description: "Falha ao carregar disponibilidade.", variant: "destructive" });
    } else {
      setAvailability(data || []);
    }
    setLoading(false);
  };

  const generateTimeSlots = (slot: AvailabilitySlot): string[] => {
    const start = parseISO(`2000-01-01T${slot.hora_inicio}`);
    const end = parseISO(`2000-01-01T${slot.hora_fim}`);
    const slots: string[] = [];
    let current = start;

    // Intervalo de 30 minutos
    while (current < end) {
      slots.push(format(current, 'HH:mm'));
      current = new Date(current.getTime() + 30 * 60000); // Adiciona 30 minutos
    }
    return slots;
  };

  const getAvailableSlotsForSelectedDay = () => {
    if (!selectedDate) return [];
    
    // 0 = Domingo, 6 = Sábado
    const dayOfWeek = selectedDate.getDay(); 
    
    const matchingSlots = availability.filter(slot => slot.dia_semana === dayOfWeek);
    
    let availableTimes: string[] = [];
    matchingSlots.forEach(slot => {
      availableTimes = availableTimes.concat(generateTimeSlots(slot));
    });

    // Aqui, em um app real, você faria uma consulta para remover horários já agendados.
    // Por simplicidade, retornamos todos os slots de disponibilidade.
    return availableTimes.sort();
  };

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return;
    
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const dateTimeString = `${dateString}T${time}:00.000Z`; // Supabase espera ISO formatado

    setSelectedTime(time);
    setBookingDetails({
      data_hora_agendamento: dateTimeString,
      motivo: ''
    });
    setIsBookingDialogOpen(true);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerId || !bookingDetails.data_hora_agendamento) return;

    const { data: { user: agendador } } = await supabase.auth.getUser();
    
    const payload = {
      dono_perfil_id: ownerId,
      agendador_id: agendador?.id || null, // Pode ser nulo se for agendamento público
      data_hora_agendamento: bookingDetails.data_hora_agendamento,
      motivo: bookingDetails.motivo || 'Consulta',
      status: 'pendente',
    };

    const { error } = await supabase
      .from('agendamentos')
      .insert(payload);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso!", description: "Agendamento solicitado com sucesso.", });
      setIsBookingDialogOpen(false);
      setSelectedTime(null);
    }
  };

  const availableTimes = getAvailableSlotsForSelectedDay();
  const formattedDate = selectedDate ? format(selectedDate, 'EEEE, dd/MM', { locale: ptBR }) : '';

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/perfil">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Agenda
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        
        {/* Calendário */}
        <div className="flex justify-center mb-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border border-[#3A00FF] shadow-lg"
            locale={ptBR}
          />
        </div>

        {/* Slots Disponíveis */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Horários disponíveis em {formattedDate}
        </h2>

        {loading ? (
          <p className="text-gray-500">Carregando disponibilidade...</p>
        ) : availableTimes.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Clock className="h-8 w-8 mx-auto mb-2" />
            <p>Nenhum horário disponível neste dia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {availableTimes.map(time => (
              <Button 
                key={time}
                variant="outline"
                className="border-2 border-[#3A00FF] text-[#3A00FF] hover:bg-[#D9D0FF]"
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        )}
      </main>

      <MobileNavbar />

      {/* Dialog de Agendamento */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
              Confirmar Agendamento
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBookAppointment} className="grid gap-4 py-4">
            <p className="text-lg font-semibold text-gray-700">
              Você está agendando para: <span className="text-[#3A00FF]">{selectedTime}</span> em <span className="text-[#3A00FF]">{format(selectedDate || new Date(), 'dd/MM/yyyy')}</span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo do Agendamento</Label>
              <CustomTextarea
                id="motivo"
                placeholder="Ex: Reunião de negócios, Consultoria..."
                value={bookingDetails.motivo}
                onChange={(e) => setBookingDetails({ ...bookingDetails, motivo: e.target.value })}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700">
                Agendar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Agenda;