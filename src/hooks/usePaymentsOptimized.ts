import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useOptimizedCache } from './useOptimizedCache';
import api from '@/utils/api.utils';
import { IPayment, IStudentConfirmed } from './usePayments';

// ===============================
// HOOKS OTIMIZADOS PARA PAGAMENTOS
// ===============================

// Hook otimizado para alunos confirmados
export const useStudentsConfirmedOptimized = () => {
  const [students, setStudents] = useState<IStudentConfirmed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchStudents = useCallback(async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    turma?: number,
    curso?: number
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (turma) params.append('turma', turma.toString());
      if (curso) params.append('curso', curso.toString());

      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      
      if (response.data.success) {
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    students,
    pagination,
    loading,
    error,
    fetchStudents
  };
};

// Hook otimizado para dados financeiros do aluno
export const useStudentFinancialDataOptimized = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = useCallback(async (studentId: number, anoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    console.log('💰 [OTIMIZADO] Buscando dados completos do aluno:', { studentId, anoLectivo });
    
    try {
      // Usar a API corrigida que retorna dados da confirmação mais recente
      const response = await api.get(`/api/payment-management/aluno/${studentId}/completo`);
      
      if (response.data.success) {
        console.log('✅ [OTIMIZADO] Dados completos recebidos');
        
        // Buscar também dados de meses se ano letivo especificado
        let dadosCompletos = response.data.data;
        
        if (anoLectivo) {
          try {
            const mesesResponse = await api.get(`/api/payment-management/aluno/${studentId}/meses-ano-letivo/${anoLectivo}`);
            if (mesesResponse.data.success) {
              dadosCompletos = {
                ...dadosCompletos,
                mesesPropina: mesesResponse.data.data.meses,
                resumo: mesesResponse.data.data.resumo,
                historicoFinanceiro: mesesResponse.data.data.pagamentos || []
              };
            }
          } catch (mesesErr) {
            console.warn('⚠️ [OTIMIZADO] Erro ao buscar meses, continuando sem eles:', mesesErr);
          }
        }
        
        setData(dadosCompletos);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do aluno');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados do aluno';
      setError(errorMessage);
      setData(null);
      console.error('❌ [OTIMIZADO] Erro ao buscar dados financeiros:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchFinancialData,
    clearData
  };
};

// Hook otimizado para lista de pagamentos
export const usePaymentsListOptimized = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchPayments = useCallback(async (
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
      studentId?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) params.append('dateTo', filters.dateTo);
      if (filters?.studentId) params.append('studentId', filters.studentId.toString());

      const response = await api.get(`/api/payment-management/pagamentos?${params}`);
      
      if (response.data.success) {
        setPayments(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar pagamentos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar pagamentos';
      setError(errorMessage);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const stats = useMemo(() => {
    if (!payments.length) return { total: 0, paid: 0, pending: 0, overdue: 0 };
    
    return {
      total: payments.length,
      paid: payments.filter((p: any) => p.status === 'Pago').length,
      pending: payments.filter((p: any) => p.status === 'Pendente').length,
      overdue: payments.filter((p: any) => p.status === 'Vencido').length,
    };
  }, [payments]);

  return {
    payments,
    pagination,
    stats,
    loading,
    error,
    fetchPayments
  };
};

// Hook para gerar PDF de fatura (sem cache - sempre gerar novo)
export const useGenerateInvoicePDFOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = useCallback(async (invoiceId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular geração de PDF por enquanto
      const response = { data: { success: true, message: 'PDF simulado gerado' } };
      
      if (response.data.success) {
        toast.success('PDF gerado com sucesso!');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Erro ao gerar PDF');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao gerar PDF';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    generatePDF,
    loading,
    error
  };
};

// Hook para criar novo pagamento (sem cache)
export const useCreatePaymentOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (paymentData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/payment-management/pagamentos', paymentData);
      
      if (response.data.success) {
        toast.success('Pagamento criado com sucesso!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar pagamento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createPayment,
    loading,
    error
  };
};

// Hook para atualizar pagamento (sem cache)
export const useUpdatePaymentOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePayment = useCallback(async (paymentId: number, paymentData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/payment-management/pagamentos/${paymentId}`, paymentData);
      
      if (response.data.success) {
        toast.success('Pagamento atualizado com sucesso!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar pagamento';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updatePayment,
    loading,
    error
  };
};

// Hook para estatísticas de pagamentos (cache médio)
export const usePaymentStatsOptimized = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular estatísticas por enquanto
      const response = { data: { success: true, data: { totalPagamentos: 0, valorTotal: 0, pagamentosHoje: 0 }, message: 'Estatísticas simuladas' } };
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar estatísticas');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar estatísticas';
      setError(errorMessage);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refetch: fetchStats
  };
};
