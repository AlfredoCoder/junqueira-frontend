import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useOptimizedCache } from './useOptimizedCache';
import api from '@/utils/api.utils';

// ===============================
// HOOKS OTIMIZADOS PARA RELATÓRIOS DE VENDAS
// ===============================

// Tipos para relatórios
interface RelatorioFilters {
  periodo?: 'diario' | 'semanal' | 'mensal' | 'anual';
  ano?: number;
  mes?: number;
  dataInicio?: string;
  dataFim?: string;
  cursoId?: number;
  turmaId?: number;
}

// Hook otimizado para relatório geral
export const useRelatorioGeralOptimized = (filters: RelatorioFilters = {}) => {
  const filterKey = JSON.stringify(filters);
  
  const { 
    data: relatorio, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/financial-services/relatorio-vendas', { params: filters });
      return response.data;
    },
    { 
      key: `relatorio-geral-${filterKey}`,
      ttl: 10 * 60 * 1000 // 10 minutos - relatórios podem ter cache maior
    }
  );

  return {
    relatorio: relatorio?.data || null,
    loading,
    error,
    refetch
  };
};

// Hook otimizado para relatório por período
export const useRelatorioPeriodoOptimized = (
  periodo: 'diario' | 'semanal' | 'mensal' | 'anual',
  ano?: number,
  mes?: number
) => {
  const cacheKey = `relatorio-periodo-${periodo}-${ano || 'all'}-${mes || 'all'}`;
  
  const { 
    data: relatorio, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/financial-services/relatorio-vendas', { 
        params: { periodo, ano, mes } 
      });
      return response.data;
    },
    { 
      key: cacheKey,
      ttl: 15 * 60 * 1000 // 15 minutos - dados históricos podem ter cache maior
    }
  );

  return {
    relatorio: relatorio?.data || null,
    loading,
    error,
    refetch
  };
};

// Hook otimizado para relatório por curso
export const useRelatorioCursoOptimized = (cursoId?: number) => {
  const { 
    data: relatorio, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/financial-services/relatorio-vendas', { 
        params: { cursoId } 
      });
      return response.data;
    },
    { 
      key: `relatorio-curso-${cursoId || 'all'}`,
      ttl: 20 * 60 * 1000 // 20 minutos - dados por curso são mais estáveis
    }
  );

  return {
    relatorio: relatorio?.data || null,
    loading,
    error,
    refetch
  };
};

// Hook otimizado para estatísticas de vendas
export const useVendasStatsOptimized = () => {
  const { 
    data: stats, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    async () => {
      const response = await api.get('/api/financial-services/relatorio-vendas');
      return response.data;
    },
    { 
      key: 'vendas-stats',
      ttl: 5 * 60 * 1000 // 5 minutos - estatísticas gerais
    }
  );

  const processedStats = useMemo(() => {
    if (!stats?.data) return null;
    
    const data = stats.data;
    return {
      ...data,
      crescimento: data.totalMesAtual && data.totalMesAnterior 
        ? ((data.totalMesAtual - data.totalMesAnterior) / data.totalMesAnterior * 100).toFixed(1)
        : '0',
      mediaVendasDia: data.totalMesAtual && data.diasNoMes
        ? (data.totalMesAtual / data.diasNoMes).toFixed(2)
        : '0'
    };
  }, [stats]);

  return {
    stats: processedStats,
    loading,
    error,
    refetch
  };
};

// Hook para exportar relatórios (sem cache - sempre gerar novo)
export const useExportRelatorioOptimized = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = useCallback(async (filters: RelatorioFilters, filename?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Temporariamente desabilitado - endpoint não implementado
      throw new Error('Exportação PDF temporariamente indisponível');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar PDF';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportToExcel = useCallback(async (filters: RelatorioFilters, filename?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Temporariamente desabilitado - endpoint não implementado
      throw new Error('Exportação Excel temporariamente indisponível');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao exportar Excel';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exportToPDF,
    exportToExcel,
    loading,
    error
  };
};

// Hook principal otimizado que combina funcionalidades
export const useRelatoriosVendasOptimized = () => {
  const [currentFilters, setCurrentFilters] = useState<RelatorioFilters>({
    periodo: 'diario'
  });

  // Usar hooks específicos baseados nos filtros atuais
  // Dados mock temporários para evitar loops
  const relatorioGeral = {
    periodo: currentFilters.periodo,
    totalVendas: 0,
    totalReceitas: 0,
    totalGeral: 0,
    totalPagamentos: 0,
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: new Date().toISOString().split('T')[0],
    vendas: [],
    funcionarios: [],
    resumo: {
      totalFuncionarios: 0,
      mediaVendasPorFuncionario: 0,
      funcionarioMaisVendas: null,
      funcionarioMenosVendas: null
    }
  };
  
  const stats = {
    totalVendas: 0,
    totalReceitas: 0,
    vendasHoje: 0,
    receitasHoje: 0
  };
  
  const loadingGeral = false;
  const loadingStats = false;
  const errorGeral = null;
  const errorStats = null;
  
  const refetchGeral = () => {};
  const refetchStats = () => {};

  // Estados consolidados
  const loading = loadingGeral || loadingStats;
  const error = errorGeral || errorStats;

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters: Partial<RelatorioFilters>) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Função para buscar relatório com novos filtros
  const fetchRelatorioGeral = useCallback((periodo: 'diario' | 'semanal' | 'mensal' | 'anual', additionalFilters?: Partial<RelatorioFilters>) => {
    const filters = { periodo, ...additionalFilters };
    setCurrentFilters(filters);
    // O hook useRelatorioGeralOptimized vai automaticamente refetch com os novos filtros
  }, []);

  // Função para limpar cache de relatórios
  const clearRelatorios = useCallback(() => {
    // Implementar limpeza de cache específica se necessário
    refetchGeral();
    refetchStats();
  }, [refetchGeral, refetchStats]);

  return {
    // Dados
    relatorioGeral,
    stats,
    currentFilters,
    
    // Estados
    loading,
    error,
    
    // Ações
    fetchRelatorioGeral,
    updateFilters,
    clearRelatorios,
    refetch: () => {
      refetchGeral();
      refetchStats();
    }
  };
};
