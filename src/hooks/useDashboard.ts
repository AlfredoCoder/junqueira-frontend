// hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import type {
  DashboardData,
  DashboardStats,
  EnrollmentEvolution,
  MonthlyRevenue,
  GradeDistribution,
  WeeklyAttendance,
  RecentActivity,
  SystemStatus
} from '@/types/dashboard.types';

import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage.utils";

interface UseDashboardReturn {
  // Data
  dashboardData: DashboardData | null;
  stats: DashboardStats | null;
  enrollmentEvolution: EnrollmentEvolution[];
  monthlyRevenue: MonthlyRevenue[];
  gradeDistribution: GradeDistribution[];
  weeklyAttendance: WeeklyAttendance[];
  recentActivity: RecentActivity[];
  systemStatus: SystemStatus | null;

  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;
  isLoadingEnrollment: boolean;
  isLoadingRevenue: boolean;
  isLoadingGrades: boolean;
  isLoadingAttendance: boolean;
  isLoadingActivity: boolean;
  isLoadingStatus: boolean;

  // Error states
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchEnrollmentEvolution: () => Promise<void>;
  fetchMonthlyRevenue: () => Promise<void>;
  fetchGradeDistribution: () => Promise<void>;
  fetchWeeklyAttendance: () => Promise<void>;
  fetchRecentActivity: (limit?: number) => Promise<void>;
  fetchSystemStatus: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

export const useDashboard = (): UseDashboardReturn => {
  // States para dados
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrollmentEvolution, setEnrollmentEvolution] = useState<EnrollmentEvolution[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState<WeeklyAttendance[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // States para loading
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingEnrollment, setIsLoadingEnrollment] = useState(false);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);

  // State para erros
  const [error, setError] = useState<string | null>(null);

  /**
   * Buscar todos os dados do dashboard de uma vez
   */
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await DashboardService.getDashboardData();
      setDashboardData(data);

      // Atualizar estados individuais
      setStats(data.stats);
      setEnrollmentEvolution(data.enrollmentEvolution);
      setMonthlyRevenue(data.monthlyRevenue);
      setGradeDistribution(data.gradeDistribution);
      setWeeklyAttendance(data.weeklyAttendance);
      setRecentActivity(data.recentActivity);
      setSystemStatus(data.systemStatus);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar dados do dashboard");
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Buscar apenas estatísticas gerais
   */
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    setError(null);

    try {
      const data = await DashboardService.getDashboardStats();
      setStats(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar dados do dashboard");
      toast.error(errorMessage);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  /**
   * Buscar evolução de matrículas
   */
  const fetchEnrollmentEvolution = useCallback(async () => {
    setIsLoadingEnrollment(true);
    setError(null);

    try {
      const data = await DashboardService.getEnrollmentEvolution();
      setEnrollmentEvolution(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar evolução de matrículas");
      toast.error(errorMessage);
    } finally {
      setIsLoadingEnrollment(false);
    }
  }, []);

  /**
   * Buscar receita mensal
   */
  const fetchMonthlyRevenue = useCallback(async () => {
    setIsLoadingRevenue(true);
    setError(null);

    try {
      const data = await DashboardService.getMonthlyRevenue();
      setMonthlyRevenue(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar receita mensal");
      toast.error(errorMessage);
    } finally {
      setIsLoadingRevenue(false);
    }
  }, []);

  /**
   * Buscar distribuição de notas
   */
  const fetchGradeDistribution = useCallback(async () => {
    setIsLoadingGrades(true);
    setError(null);

    try {
      const data = await DashboardService.getGradeDistribution();
      setGradeDistribution(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar distribuição de notas");
      toast.error(errorMessage);
    } finally {
      setIsLoadingGrades(false);
    }
  }, []);

  /**
   * Buscar presença semanal
   */
  const fetchWeeklyAttendance = useCallback(async () => {
    setIsLoadingAttendance(true);
    setError(null);

    try {
      const data = await DashboardService.getWeeklyAttendance();
      setWeeklyAttendance(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar presença semanal");
      toast.error(errorMessage);
    } finally {
      setIsLoadingAttendance(false);
    }
  }, []);

  /**
   * Buscar atividades recentes
   */
  const fetchRecentActivity = useCallback(async (limit: number = 10) => {
    setIsLoadingActivity(true);
    setError(null);

    try {
      const data = await DashboardService.getRecentActivity(limit);
      setRecentActivity(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar atividades recentes");
      toast.error(errorMessage);
    } finally {
      setIsLoadingActivity(false);
    }
  }, []);

  /**
   * Buscar status do sistema
   */
  const fetchSystemStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setError(null);

    try {
      const data = await DashboardService.getSystemStatus();
      setSystemStatus(data);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar status do sistema");
      toast.error(errorMessage);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  /**
   * Atualizar todos os dados
   */
  const refreshAll = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  // Carregar dados automaticamente ao montar o componente
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // Data
    dashboardData,
    stats,
    enrollmentEvolution,
    monthlyRevenue,
    gradeDistribution,
    weeklyAttendance,
    recentActivity,
    systemStatus,

    // Loading states
    isLoading,
    isLoadingStats,
    isLoadingEnrollment,
    isLoadingRevenue,
    isLoadingGrades,
    isLoadingAttendance,
    isLoadingActivity,
    isLoadingStatus,

    // Error
    error,

    // Actions
    fetchDashboardData,
    fetchStats,
    fetchEnrollmentEvolution,
    fetchMonthlyRevenue,
    fetchGradeDistribution,
    fetchWeeklyAttendance,
    fetchRecentActivity,
    fetchSystemStatus,
    refreshAll
  };
};

export default useDashboard;
