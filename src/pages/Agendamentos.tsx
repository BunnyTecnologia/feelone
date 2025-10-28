import React, { useEffect, useState } from 'react';
import { ArrowLeft, CalendarCheck, Clock, User, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  dono_perfil_id: string;
  agendador_id: string | null;
  data_hora_agendamento: string;
  motivo: string;
  status: string;
  // Adicionar perfis para mostrar quem agendou/quem é o dono
  profiles_dono: { first_name: string; last_name: string } | null;
  profiles_agendador: { first_name: string; last_name: string } | null;
}

const Agendamentos = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'received' | 'scheduled'>('received');

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchAppointments(user.id);
      } else {
        navigate('/login');
      }
    };
    getUserId();
  }, [navigate]);

  const fetchAppointments = async (currentUserId: string) => {
    setLoading(true);

    // Busca agendamentos onde o usuário é o dono do perfil OU o agendador
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id, dono_perfil_id, agendador_id, data_hora_agendamento, motivo, status,
        profiles_dono:dono_perfil_id (first_name, last_name),
        profiles_agendador:agendador_id (first_name, last_name)
      `)
      .or(`dono_perfil_id.eq.${currentUserId},agendador_id.eq.${currentUserId}`)
      .order('data_hora_agendamento', { ascending: true });

    if (error) {
      toast({ title: "Erro", description: "Falha ao carregar agendamentos.", variant: "destructive" });
    } else {
      setAppointments(data as Appointment[] || []);
    }
    setLoading(false);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmado':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'cancelado':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const isReceived = appointment.dono_perfil_id === userId;
    const otherProfile = isReceived ? appointment.profiles_agendador : appointment.profiles_dono;
    const otherName = otherProfile ? `${otherProfile.first_name} ${otherProfile.last_name}` : 'Usuário Desconhecido';
    
    const date = format(parseISO(appointment.data_hora_agendamento), 'dd/MM/yyyy', { locale: ptBR });
    const time = format(parseISO(appointment.data_hora_agendamento), 'HH:mm');

    return (
      <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg font-bold text-[#3A00FF] truncate">
            {isReceived ? `Agendamento de ${otherName}` : `Agendamento com ${otherName}`}
          </CardTitle>
          <span className={cn("text-xs font-semibold px-2 py-1 rounded-full", getStatusClass(appointment.status))}>
            {appointment.status.toUpperCase()}
          </span>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-4 w-4 text-gray-500" />
            <span>Data: {date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Hora: {time}</span>
          </div>
          <p className="pt-2">Motivo: {appointment.motivo || 'Não especificado'}</p>
          
          {/* Ações (Apenas para o dono do perfil) */}
          {isReceived && appointment.status === 'pendente' && (
            <div className="flex justify-end space-x-2 pt-3">
              <Button variant="destructive" size="sm" className="h-8">
                Rejeitar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 h-8" size="sm">
                Confirmar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const receivedAppointments = appointments.filter(a => a.dono_perfil_id === userId);
  const scheduledAppointments = appointments.filter(a => a.agendador_id === userId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/perfil">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Agendamentos
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'received' | 'scheduled')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger value="received" className="text-base font-semibold">Recebidos ({receivedAppointments.length})</TabsTrigger>
            <TabsTrigger value="scheduled" className="text-base font-semibold">Agendados ({scheduledAppointments.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="received" className="mt-4 space-y-4">
            {receivedAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CalendarCheck className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum agendamento recebido.</p>
              </div>
            ) : (
              receivedAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
            )}
          </TabsContent>
          
          <TabsContent value="scheduled" className="mt-4 space-y-4">
            {scheduledAppointments.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <CalendarCheck className="h-12 w-12 mx-auto mb-4" />
                <p>Você não fez nenhum agendamento.</p>
              </div>
            ) : (
              scheduledAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)
            )}
          </TabsContent>
        </Tabs>
      </main>

      <MobileNavbar />
    </div>
  );
};

export default Agendamentos;