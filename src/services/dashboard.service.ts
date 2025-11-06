import api from "@/utils/api.utils";

import type {
  DashboardStats,
  EnrollmentEvolution,
  MonthlyRevenue,
  GradeDistribution,
  WeeklyAttendance,
  RecentActivity,
  SystemStatus,
  DashboardData
} from "@/types/dashboard.types";

export class DashboardService {
  /**
   * Obter todos os dados do dashboard de uma vez
   */
  static async getDashboardData(): Promise<DashboardData> {
    const response = await api.get('/api/dashboard');
    return response.data.data;
  }

  /**
   * Obter apenas estatísticas gerais
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/api/dashboard/stats');
    return response.data.data;
  }

  /**
   * Obter evolução de matrículas
   */
  static async getEnrollmentEvolution(): Promise<EnrollmentEvolution[]> {
    const response = await api.get('/api/dashboard/enrollment-evolution');
    return response.data.data;
  }

  /**
   * Obter receita mensal
   */
  static async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const response = await api.get('/api/dashboard/monthly-revenue');
    return response.data.data;
  }

  /**
   * Obter distribuição de notas
   */
  static async getGradeDistribution(): Promise<GradeDistribution[]> {
    const response = await api.get('/api/dashboard/grade-distribution');
    return response.data.data;
  }

  /**
   * Obter presença semanal
   */
  static async getWeeklyAttendance(): Promise<WeeklyAttendance[]> {
    const response = await api.get('/api/dashboard/weekly-attendance');
    return response.data.data;
  }

  /**
   * Obter atividades recentes
   */
  static async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get(`/api/dashboard/recent-activity?limit=${limit}`);
    return response.data.data;
  }

  /**
   * Obter status do sistema
   */
  static async getSystemStatus(): Promise<SystemStatus> {
    const response = await api.get('/api/dashboard/system-status');
    return response.data.data;
  }
}

export default DashboardService;
