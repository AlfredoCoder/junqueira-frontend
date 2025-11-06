import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import academicEvaluationService from '@/services/academicEvaluation.service';
import { useOptimizedCache, useOptimizedPaginatedCache } from './useOptimizedCache';
import {
  ITipoAvaliacao,
  ITipoAvaliacaoInput,
  ITipoNota,
  ITipoNotaInput,
  ITrimestre,
  ITrimestreInput,
  IAcademicEvaluationReport,
  IEstatisticasNotas,
} from '@/types/academicEvaluation.types';

// ===============================
// HOOKS OTIMIZADOS PARA TIPOS DE AVALIAÇÃO
// ===============================

export function useTiposAvaliacaoOptimized(
  page: number = 1, 
  limit: number = 10, 
  search: string = ''
) {
  const { 
    data: response, 
    loading, 
    error, 
    refetch 
  } = useOptimizedPaginatedCache(
    academicEvaluationService.getTiposAvaliacao,
    page,
    limit,
    search
  );

  const tiposAvaliacao = useMemo(() => response?.data || [], [response?.data]);
  const pagination = useMemo(() => response?.pagination || null, [response?.pagination]);

  return {
    tiposAvaliacao,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useTipoAvaliacaoOptimized(id: number) {
  const { 
    data: tipoAvaliacao, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    () => academicEvaluationService.getTipoAvaliacaoById(id),
    { 
      key: `tipo-avaliacao-${id}`,
      ttl: 10 * 60 * 1000 // 10 minutos
    }
  );

  return {
    tipoAvaliacao: tipoAvaliacao?.data || null,
    loading,
    error,
    refetch,
  };
}

// ===============================
// HOOKS OTIMIZADOS PARA TIPOS DE NOTA
// ===============================

export function useTiposNotaOptimized(
  page: number = 1, 
  limit: number = 10, 
  search: string = ''
) {
  const { 
    data: response, 
    loading, 
    error, 
    refetch 
  } = useOptimizedPaginatedCache(
    academicEvaluationService.getTiposNota,
    page,
    limit,
    search
  );

  const tiposNota = useMemo(() => response?.data || [], [response?.data]);
  const pagination = useMemo(() => response?.pagination || null, [response?.pagination]);

  return {
    tiposNota,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useTipoNotaOptimized(id: number) {
  const { 
    data: tipoNota, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    () => academicEvaluationService.getTipoNotaById(id),
    { 
      key: `tipo-nota-${id}`,
      ttl: 10 * 60 * 1000 // 10 minutos
    }
  );

  return {
    tipoNota: tipoNota?.data || null,
    loading,
    error,
    refetch,
  };
}

// ===============================
// HOOKS OTIMIZADOS PARA TRIMESTRES
// ===============================

export function useTrimestresOptimized(
  page: number = 1, 
  limit: number = 10, 
  search: string = ''
) {
  const { 
    data: response, 
    loading, 
    error, 
    refetch 
  } = useOptimizedPaginatedCache(
    academicEvaluationService.getTrimestres,
    page,
    limit,
    search
  );

  const trimestres = useMemo(() => response?.data || [], [response?.data]);
  const pagination = useMemo(() => response?.pagination || null, [response?.pagination]);

  return {
    trimestres,
    loading,
    error,
    pagination,
    refetch,
  };
}

export function useTrimestreOptimized(id: number) {
  const { 
    data: trimestre, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    () => academicEvaluationService.getTrimestreById(id),
    { 
      key: `trimestre-${id}`,
      ttl: 10 * 60 * 1000 // 10 minutos
    }
  );

  return {
    trimestre: trimestre?.data || null,
    loading,
    error,
    refetch,
  };
}

// ===============================
// HOOKS PARA RELATÓRIOS (SEM CACHE - DADOS DINÂMICOS)
// ===============================

export function useRelatorioAvaliacaoOptimized() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatorio, setRelatorio] = useState<IAcademicEvaluationReport | null>(null);

  const fetchRelatorio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getRelatorioAvaliacao();
      setRelatorio(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao gerar relatório';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    relatorio,
    loading,
    error,
    fetchRelatorio,
  };
}

// ===============================
// HOOKS PARA OPERAÇÕES CRUD (SEM CACHE)
// ===============================

export function useCreateTrimestreOptimized() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrimestre = useCallback(async (data: ITrimestreInput) => {
    try {
      setLoading(true);
      setError(null);
      const result = await academicEvaluationService.createTrimestre(data);
      toast.success('Trimestre criado com sucesso!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar trimestre';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTrimestre, loading, error };
}

export function useCreateTipoNotaOptimized() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTipoNota = useCallback(async (data: ITipoNotaInput) => {
    try {
      setLoading(true);
      setError(null);
      const result = await academicEvaluationService.createTipoNota(data);
      toast.success('Tipo de nota criado com sucesso!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar tipo de nota';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTipoNota, loading, error };
}

export function useDeleteTrimestreOptimized() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTrimestre = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await academicEvaluationService.deleteTrimestre(id);
      toast.success('Trimestre excluído com sucesso!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir trimestre';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTrimestre, loading, error };
}

export function useDeleteTipoNotaOptimized() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTipoNota = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await academicEvaluationService.deleteTipoNota(id);
      toast.success('Tipo de nota excluído com sucesso!');
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir tipo de nota';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTipoNota, loading, error };
}

// Hook para estatísticas (com cache curto)
export function useEstatisticasNotasOptimized() {
  const { 
    data: estatisticas, 
    loading, 
    error, 
    refetch 
  } = useOptimizedCache(
    () => academicEvaluationService.getEstatisticasNotas(),
    { 
      key: 'estatisticas-notas',
      ttl: 2 * 60 * 1000 // 2 minutos - dados mais dinâmicos
    }
  );

  return {
    estatisticas: estatisticas?.data || null,
    loading,
    error,
    refetch,
  };
}
