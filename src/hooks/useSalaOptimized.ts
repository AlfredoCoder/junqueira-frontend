import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useOptimizedCache } from './useOptimizedCache';
import api from '@/utils/api.utils';
import { ISala, ISalaInput } from '@/types/sala.types';

// ===============================
// HOOKS OTIMIZADOS PARA SALAS
// ===============================

// Hook otimizado para listar salas
export const useSalasOptimized = () => {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSalas = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/academic-management/salas', {
        params: { page, limit, search }
      });
      
      if (response.data.success) {
        setSalas(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar salas');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar salas';
      setError(errorMessage);
      setSalas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    salas,
    pagination,
    loading,
    error,
    fetchSalas,
    refetch: () => fetchSalas()
  };
};

// Hook otimizado para sala específica
export const useSalaOptimized = (id: number) => {
  const { 
    data: sala, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get(`/api/academic-management/salas/${id}`);
      return response.data;
    },
    { 
      key: `sala-${id}`,
      ttl: 10 * 60 * 1000 // 10 minutos - dados de sala são relativamente estáveis
    }
  );

  return {
    sala: sala?.data || null,
    loading,
    error,
    refetch
  };
};

// Hook para criar sala (sem cache)
export const useCreateSalaOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSala = useCallback(async (data: ISalaInput): Promise<ISala> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/academic-management/salas', data);
      
      if (response.data.success) {
        toast.success('Sala criada com sucesso!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar sala');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar sala';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createSala, loading, error };
};

// Hook para atualizar sala (sem cache)
export const useUpdateSalaOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSala = useCallback(async (id: number, data: ISalaInput): Promise<ISala> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/api/academic-management/salas/${id}`, data);
      
      if (response.data.success) {
        toast.success('Sala atualizada com sucesso!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar sala');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar sala';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateSala, loading, error };
};

// Hook para excluir sala (sem cache)
export const useDeleteSalaOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSala = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.delete(`/api/academic-management/salas/${id}`);
      
      if (response.data.success) {
        toast.success('Sala excluída com sucesso!');
      } else {
        throw new Error(response.data.message || 'Erro ao excluir sala');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao excluir sala';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSala, loading, error };
};

// Hook para todas as salas (com cache)
export const useAllSalasOptimized = () => {
  const { 
    data: salas, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/academic-management/salas/all');
      return response.data;
    },
    { 
      key: 'all-salas',
      ttl: 5 * 60 * 1000 // 5 minutos - para selects e dropdowns
    }
  );

  return {
    salas: salas?.data || [],
    loading,
    error,
    refetch
  };
};

// Hook para estatísticas de salas (com cache)
export const useSalaStatsOptimized = () => {
  const { 
    data: stats, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/academic-management/salas/stats');
      return response.data;
    },
    { 
      key: 'sala-stats',
      ttl: 5 * 60 * 1000 // 5 minutos - estatísticas podem ter cache maior
    }
  );

  const processedStats = useMemo(() => {
    if (!stats?.data) return { total: 0, active: 0, inactive: 0, totalCapacity: 0 };
    
    const data = stats.data;
    return {
      total: data.total || 0,
      active: data.active || 0,
      inactive: data.inactive || 0,
      totalCapacity: data.totalCapacity || 0
    };
  }, [stats]);

  return {
    stats: processedStats,
    loading,
    error,
    refetch
  };
};
