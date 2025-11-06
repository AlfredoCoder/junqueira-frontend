import { useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useOptimizedCache } from './useOptimizedCache';
import api from '@/utils/api.utils';

// ===============================
// HOOKS OTIMIZADOS PARA SISTEMA FINANCEIRO GERAL
// ===============================

// Hook otimizado para SAFT (Sistema de Auditoria Fiscal e Tributária)
export const useSAFTOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saftData, setSaftData] = useState<any>(null);

  const generateSAFT = useCallback(async (filters: {
    dataInicio: string;
    dataFim: string;
    tipo?: 'completo' | 'resumido';
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/saft/generate', filters);
      const result = response.data;
      setSaftData(result.data);
      toast.success('SAFT gerado com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar SAFT';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadSAFT = useCallback(async (saftId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/saft/download/${saftId}`);
      const result = response.data;
      toast.success('Download do SAFT iniciado!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao baixar SAFT';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saftData,
    loading,
    error,
    generateSAFT,
    downloadSAFT
  };
};

// Hook otimizado para serviços financeiros
export const useFinanceServicesOptimized = (
  page: number = 1,
  limit: number = 10,
  search: string = ''
) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: page,
    itemsPerPage: limit,
    totalPages: 1
  });

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/financial-services/tipos-servicos', {
        params: { page, limit, search }
      });
      
      if (response.data.success) {
        setServices(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  // Carregar dados automaticamente
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refetch = fetchServices;


  const stats = useMemo(() => {
    if (!services.length) return { total: 0, active: 0, inactive: 0 };
    
    return {
      total: services.length,
      active: services.filter((s: any) => s.status === 'Ativo').length,
      inactive: services.filter((s: any) => s.status === 'Inativo').length,
    };
  }, [services]);

  return {
    services,
    pagination,
    stats,
    loading,
    error,
    refetch
  };
};

// Hook otimizado para notas de crédito
export const useCreditNotesOptimized = (
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
  const filterKey = filters ? JSON.stringify(filters) : 'no-filters';
  const cacheKey = `credit-notes-${page}-${limit}-${filterKey}`;

  const { 
    data: response, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/payment-management/notas-credito', {
        params: { page, limit, ...filters }
      });
      return response.data;
    },
    { 
      key: cacheKey,
      ttl: 2 * 60 * 1000 // 2 minutos - notas de crédito são dinâmicas
    }
  );

  const creditNotes = useMemo(() => response?.data || [], [response?.data]);
  const pagination = useMemo(() => response?.pagination || {
    totalItems: 0,
    currentPage: page,
    itemsPerPage: limit,
    totalPages: 1
  }, [response?.pagination, page, limit]);

  const stats = useMemo(() => {
    if (!creditNotes.length) return { total: 0, pending: 0, approved: 0, cancelled: 0 };
    
    return {
      total: creditNotes.length,
      pending: creditNotes.filter(cn => cn.status === 'Pendente').length,
      approved: creditNotes.filter(cn => cn.status === 'Aprovada').length,
      cancelled: creditNotes.filter(cn => cn.status === 'Cancelada').length,
    };
  }, [creditNotes]);

  return {
    creditNotes,
    pagination,
    stats,
    loading,
    error,
    refetch,
    fetchCreditNotes: refetch // Alias para compatibilidade
  };
};

// Hook para criar serviço financeiro (sem cache)
export const useCreateFinanceServiceOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createService = useCallback(async (serviceData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/finance/services', serviceData);
      const result = response.data;
      toast.success('Serviço criado com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar serviço';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createService,
    loading,
    error
  };
};

// Hook para criar nota de crédito (sem cache)
export const useCreateCreditNoteOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCreditNote = useCallback(async (creditNoteData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/finance/credit-notes', creditNoteData);
      const result = response.data;
      toast.success('Nota de crédito criada com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar nota de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createCreditNote,
    loading,
    error
  };
};

// Hook para atualizar serviço financeiro (sem cache)
export const useUpdateFinanceServiceOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateService = useCallback(async (serviceId: number, serviceData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`/api/finance/services/${serviceId}`, serviceData);
      const result = response.data;
      toast.success('Serviço atualizado com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar serviço';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateService,
    loading,
    error
  };
};

// Hook para estatísticas financeiras gerais (cache longo)
export const useFinanceStatsOptimized = () => {
  const { 
    data: stats, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/finance/stats');
      return response.data;
    },
    { 
      key: 'finance-stats-general',
      ttl: 10 * 60 * 1000 // 10 minutos - estatísticas gerais
    }
  );

  const processedStats = useMemo(() => {
    if (!stats?.data) return null;
    
    const data = stats.data;
    return {
      ...data,
      totalReceitas: data.pagamentos?.total || 0,
      totalPendente: data.pagamentos?.pendente || 0,
      totalVencido: data.pagamentos?.vencido || 0,
      totalServicos: data.servicos?.total || 0,
      totalNotasCredito: data.notasCredito?.total || 0,
      crescimentoMensal: data.crescimento?.mensal || 0,
    };
  }, [stats]);

  return {
    stats: processedStats,
    loading,
    error,
    refetch
  };
};
