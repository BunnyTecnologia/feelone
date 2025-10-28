import React from 'react';
import { Mail, Users, Eye, DollarSign, ShoppingCart, Calendar, Ticket, Building, Globe, Megaphone } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MetricCard from '@/components/MetricCard';
import TopAccessTable from '@/components/TopAccessTable';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DesktopOnlyWrapper from '@/components/DesktopOnlyWrapper';

const Dashboard = () => {
  // O Dashboard é projetado para desktop, então usamos padding para compensar a Sidebar.
  return (
    <DesktopOnlyWrapper>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        
        {/* 1. Sidebar */}
        <Sidebar />

        {/* 2. Main Content Area */}
        <div className="flex-1 ml-64 p-8">
          
          {/* Header do Dashboard */}
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gaviões da Fiel</h1>
              <p className="text-gray-500 dark:text-gray-400">Engajando Marcas</p>
            </div>
            
            {/* Perfil do Usuário */}
            <div className="flex items-center space-x-4">
              <Mail className="h-6 w-6 text-gray-500 cursor-pointer" />
              <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="https://i.pravatar.cc/150?img=68" alt="Julio Cesar" />
                  <AvatarFallback>JC</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Julio Cesar</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">juliocsm90@gmail.com</p>
                </div>
              </div>
            </div>
          </header>

          {/* Grid de Métricas Superiores */}
          <div className="grid grid-cols-5 gap-6 mb-8">
            <MetricCard 
              title="Patrocinadores" 
              value="1" 
              icon={Users} 
              iconBgClass="bg-green-700 text-white"
              isDark
            />
            <MetricCard 
              title="Torcedores" 
              value="131.000" 
              icon={Users} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Visualizações" 
              value="19.650.000" 
              icon={Eye} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Possível Receita" 
              value="R$393.000,00" 
              icon={DollarSign} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Campanhas" 
              value="15" 
              icon={Megaphone} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
          </div>

          {/* Seção de Tabela e Mapa */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="col-span-1">
              <TopAccessTable />
            </div>
            
            {/* Placeholder do Mapa de Torcedores */}
            <Card className="col-span-2 shadow-lg border-none rounded-xl bg-white dark:bg-gray-800">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Torcedores</CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-[300px] flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-b-xl">
                <Globe className="h-12 w-12 text-gray-500" />
                <span className="ml-2 text-gray-500">Mapa de Torcedores Placeholder</span>
              </CardContent>
            </Card>
          </div>

          {/* Grid de Métricas Inferiores */}
          <div className="grid grid-cols-5 gap-6">
            <MetricCard 
              title="Vendas Loja" 
              value="1.525" 
              icon={ShoppingCart} 
              iconBgClass="bg-green-700 text-white"
              isDark
            />
            <MetricCard 
              title="Eventos" 
              value="35" 
              icon={Calendar} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Ingressos Vendidos" 
              value="50.000" 
              icon={Ticket} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Sub-Sede" 
              value="200" 
              icon={Building} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
            <MetricCard 
              title="Acessos" 
              value="5.845.021" 
              icon={Users} 
              iconBgClass="bg-gray-200 text-gray-700"
              valueClass="text-3xl font-extrabold"
            />
          </div>
        </div>
      </div>
    </DesktopOnlyWrapper>
  );
};

export default Dashboard;