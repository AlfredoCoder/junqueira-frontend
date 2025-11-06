"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';
import useDashboard from '@/hooks/useDashboard';
import {
  ChartCard,
} from '@/components/dashboard';
import {
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Clock,
  Target,
  Award,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import StatCard from '@/components/layout/StatCard';
import WelcomeHeader from '@/components/layout/WelcomeHeader';
import { UserPermissionsDebug } from '@/components/debug/UserPermissionsDebug';


export default function Dashboard() {
  const { user, logout } = useAuth();

  // Usar o hook personalizado do dashboard
  const {
    stats,
    enrollmentEvolution,
    monthlyRevenue,
    gradeDistribution,
    weeklyAttendance,
    isLoading,
  } = useDashboard();

  // Função para formatar valores de moeda
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M Kz`;
    }
    return `${(value / 1000).toFixed(0)}K Kz`;
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
        {/* Welcome Header */}
        <WelcomeHeader
          iconMain={<Users className="w-8 h-8 text-white" />}
          title={`Bem-vindo, ${user?.nome || 'Usuário'}!`}
          description={`Painel Administrativo - ${user?.tipoDesignacao || 'Sistema Complexo Abilio Junqueira'}`}
        />

        {/* KPI Cards principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard
            title="Total de Estudantes"
            value={isLoading ? "Carregando..." : `${stats?.totalStudents.toLocaleString('pt-AO') || '0'}`}
            change={isLoading ? "..." : `${stats?.activeStudents || 0} ativos`}
            changeType="up"
            icon={Users}
            color="text-[#182F59]"
            bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
            accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
          />
          <StatCard
            title="Professores Ativos"
            value={isLoading ? "Carregando..." : `${stats?.activeTeachers || 0}`}
            change={isLoading ? "..." : `de ${stats?.totalTeachers || 0} total`}
            changeType="up"
            icon={GraduationCap}
            color="text-emerald-600"
            bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
            accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
          />
          <StatCard
            title="Taxa de Atividade"
            value={isLoading ? "Carregando..." : `${stats?.activityRate || 0}%`}
            change={isLoading ? "..." : "alunos ativos"}
            changeType="up"
            icon={Award}
            color="text-[#FFD002]"
            bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
            accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
          />
          <StatCard
            title="Receita Total"
            value={isLoading ? "Carregando..." : stats?.totalRevenue && stats.totalRevenue > 0 ? formatCurrency(stats.totalRevenue) : "Sem dados"}
            change={isLoading ? "..." : `${stats?.totalPayments || 0} pagamentos`}
            changeType="up"
            icon={DollarSign}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
            accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
          />
        </div>

        {/* Charts principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-10">
          {/* Evolução de matrículas */}
          <div className="lg:col-span-2 xl:col-span-2 order-1">
            <ChartCard
              title="Evolução de Matrículas"
              icon={TrendingUp}
              action={
                <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </Button>
              }
            >
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={280} className="sm:h-[300px] lg:h-[320px]">
                  <AreaChart data={enrollmentEvolution || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="teachersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      fontSize={10}
                      fontWeight={500}
                      tick={{ fontSize: 10 }}
                      interval={0}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={10}
                      fontWeight={500}
                      tick={{ fontSize: 10 }}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#studentsGradient)"
                      name="Estudantes"
                    />
                    <Area
                      type="monotone"
                      dataKey="teachers"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#teachersGradient)"
                      name="Professores"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Distribuição de notas */}
          <div className="lg:col-span-2 xl:col-span-1 order-2">
            <ChartCard title="Distribuição de Notas" icon={Target}>
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={280} className="sm:h-[300px] lg:h-[320px]">
                  <PieChart>
                    <Pie
                      data={gradeDistribution || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={50}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} alunos (${props.payload.percentage}%)`,
                        `Nota ${props.payload.grade}`
                      ]}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mt-4 px-2">
                {(gradeDistribution || []).map((item) => (
                  <div key={item.grade} className="flex items-center space-x-1 sm:space-x-2">
                    <div
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${item.grade === 'A' ? 'bg-emerald-500' :
                          item.grade === 'B' ? 'bg-cyan-500' :
                            item.grade === 'C' ? 'bg-amber-500' :
                              item.grade === 'D' ? 'bg-orange-500' :
                                'bg-red-500'
                        }`}
                    ></div>
                    <span className="text-xs font-medium text-gray-600">
                      {item.grade}: {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Seção de receitas e presença */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
          <div className="xl:col-span-2">
            {/* Receitas */}
            <ChartCard title="Receitas Mensais" icon={DollarSign}>
              <div className="w-full overflow-hidden">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyRevenue || []} barGap={10} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="propinasBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      </linearGradient>
                      <linearGradient id="servicosBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                    <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px'
                      }}
                      formatter={(value) => [new Intl.NumberFormat('pt-AO').format(Number(value)) + ' Kz', '']}
                    />
                    <Bar dataKey="propinas" fill="url(#propinasBar)" name="Propinas" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="servicos" fill="url(#servicosBar)" name="Serviços" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Taxa de presença */}
          <ChartCard title="Taxa de Presença Semanal" icon={Clock}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyAttendance || []}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px'
                  }}
                  formatter={(value, name) => [
                    name === 'attendance' ? `${value}%` : `${value} alunos`,
                    name === 'attendance' ? 'Presença' : 'Total de Alunos'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="#f59e0b"
                  fill="url(#attendanceGradient)"
                  strokeWidth={0}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#f59e0b"
                  strokeWidth={4}
                  dot={{ fill: '#f59e0b', strokeWidth: 0, r: 6 }}
                  activeDot={{ r: 8, fill: '#f59e0b', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Debug de Permissões - Remover em produção */}
        <div className="mt-8">
          <UserPermissionsDebug />
        </div>
    </div>
  );
}