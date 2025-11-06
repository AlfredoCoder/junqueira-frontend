import { useState, useEffect, useCallback } from 'react';
import academicEvaluationService from '@/services/academicEvaluation.service';
import {
  ITipoAvaliacao,
  ITipoAvaliacaoInput,
  ITipoNota,
  ITipoNotaInput,
  ITipoNotaValor,
  ITipoPauta,
  ITrimestre,
  ITrimestreInput,
  IAcademicEvaluationReport,
  IEstatisticasNotas,
} from '@/types/academicEvaluation.types';

// ===============================
// HOOKS PARA TIPOS DE AVALIAÇÃO
// ===============================

export function useTiposAvaliacao(page: number = 1, limit: number = 10, search?: string) {
  const [tiposAvaliacao, setTiposAvaliacao] = useState<ITipoAvaliacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTiposAvaliacao = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTiposAvaliacao(page, limit, search);
      setTiposAvaliacao(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de avaliação');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTiposAvaliacao();
  }, [page, limit, search]); // Dependências específicas

  return {
    tiposAvaliacao,
    loading,
    error,
    pagination,
    refetch: fetchTiposAvaliacao,
  };
}

export function useTipoAvaliacao(id: number) {
  const [tipoAvaliacao, setTipoAvaliacao] = useState<ITipoAvaliacao | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoAvaliacao = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTipoAvaliacaoById(id);
      setTipoAvaliacao(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipo de avaliação');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTipoAvaliacao();
  }, [id]); // Dependência específica

  return {
    tipoAvaliacao,
    loading,
    error,
    refetch: fetchTipoAvaliacao,
  };
}

// ===============================
// HOOKS PARA TIPOS DE NOTA
// ===============================

export function useTiposNota(page: number = 1, limit: number = 10, search?: string) {
  const [tiposNota, setTiposNota] = useState<ITipoNota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTiposNota = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTiposNota(page, limit, search);
      setTiposNota(response.data || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de nota');
      setTiposNota([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTiposNota();
  }, [fetchTiposNota]);

  return {
    tiposNota,
    loading,
    error,
    pagination,
    refetch: fetchTiposNota,
  };
}

export function useTiposNotaAtivos() {
  const [tiposNota, setTiposNota] = useState<ITipoNota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposNotaAtivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTiposNotaAtivos();
      setTiposNota(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de nota ativos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposNotaAtivos();
  }, [fetchTiposNotaAtivos]);

  return {
    tiposNota,
    loading,
    error,
    refetch: fetchTiposNotaAtivos,
  };
}

export function useTipoNota(id: number) {
  const [tipoNota, setTipoNota] = useState<ITipoNota | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoNota = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTipoNotaById(id);
      setTipoNota(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipo de nota');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTipoNota();
  }, [fetchTipoNota]);

  return {
    tipoNota,
    loading,
    error,
    refetch: fetchTipoNota,
  };
}

// ===============================
// HOOKS PARA TIPOS DE NOTA VALOR
// ===============================

export function useTiposNotaValor(page: number = 1, limit: number = 10, tipoNotaId?: number) {
  const [tiposNotaValor, setTiposNotaValor] = useState<ITipoNotaValor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTiposNotaValor = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTiposNotaValor(page, limit, tipoNotaId);
      setTiposNotaValor(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de nota valor');
    } finally {
      setLoading(false);
    }
  }, [page, limit, tipoNotaId]);

  useEffect(() => {
    fetchTiposNotaValor();
  }, [fetchTiposNotaValor]);

  return {
    tiposNotaValor,
    loading,
    error,
    pagination,
    refetch: fetchTiposNotaValor,
  };
}

export function useValoresPorTipoNota(tipoNotaId: number) {
  const [valores, setValores] = useState<ITipoNotaValor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchValores = useCallback(async () => {
    if (!tipoNotaId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getValoresPorTipoNota(tipoNotaId);
      setValores(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar valores por tipo de nota');
    } finally {
      setLoading(false);
    }
  }, [tipoNotaId]);

  useEffect(() => {
    fetchValores();
  }, [fetchValores]);

  return {
    valores,
    loading,
    error,
    refetch: fetchValores,
  };
}

// ===============================
// HOOKS PARA TIPOS DE PAUTA
// ===============================

export function useTiposPauta(page: number = 1, limit: number = 10, search?: string) {
  const [tiposPauta, setTiposPauta] = useState<ITipoPauta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTiposPauta = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTiposPauta(page, limit, search);
      setTiposPauta(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de pauta');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTiposPauta();
  }, [fetchTiposPauta]);

  return {
    tiposPauta,
    loading,
    error,
    pagination,
    refetch: fetchTiposPauta,
  };
}

// ===============================
// HOOKS PARA TRIMESTRES
// ===============================

export function useTrimestres(page: number = 1, limit: number = 10, search?: string) {
  const [trimestres, setTrimestres] = useState<ITrimestre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchTrimestres = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTrimestres(page, limit, search);
      setTrimestres(response.data || []);
      setPagination(response.pagination || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar trimestres');
      setTrimestres([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTrimestres();
  }, [fetchTrimestres]);

  return {
    trimestres,
    loading,
    error,
    pagination,
    refetch: fetchTrimestres,
  };
}

export function useTrimestre(id: number) {
  const [trimestre, setTrimestre] = useState<ITrimestre | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrimestre = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getTrimestreById(id);
      setTrimestre(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar trimestre');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTrimestre();
  }, [fetchTrimestre]);

  return {
    trimestre,
    loading,
    error,
    refetch: fetchTrimestre,
  };
}

// ===============================
// HOOKS CRUD PARA TIPOS DE AVALIAÇÃO
// ===============================

export function useCreateTipoAvaliacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTipoAvaliacao = useCallback(async (data: ITipoAvaliacaoInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.createTipoAvaliacao(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tipo de avaliação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTipoAvaliacao, loading, error };
}

export function useUpdateTipoAvaliacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTipoAvaliacao = useCallback(async (id: number, data: ITipoAvaliacaoInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.updateTipoAvaliacao(id, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tipo de avaliação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTipoAvaliacao, loading, error };
}

export function useDeleteTipoAvaliacao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTipoAvaliacao = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.deleteTipoAvaliacao(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir tipo de avaliação');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTipoAvaliacao, loading, error };
}

// ===============================
// HOOKS CRUD PARA TIPOS DE NOTA
// ===============================

export function useCreateTipoNota() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTipoNota = useCallback(async (data: ITipoNotaInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.createTipoNota(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tipo de nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTipoNota, loading, error };
}

export function useUpdateTipoNota() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTipoNota = useCallback(async (id: number, data: ITipoNotaInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.updateTipoNota(id, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tipo de nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTipoNota, loading, error };
}

export function useDeleteTipoNota() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTipoNota = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.deleteTipoNota(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir tipo de nota');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTipoNota, loading, error };
}

// ===============================
// HOOKS CRUD PARA TRIMESTRES
// ===============================

export function useCreateTrimestre() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTrimestre = useCallback(async (data: ITrimestreInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.createTrimestre(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar trimestre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTrimestre, loading, error };
}

export function useUpdateTrimestre() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTrimestre = useCallback(async (id: number, data: ITrimestreInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.updateTrimestre(id, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar trimestre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTrimestre, loading, error };
}

export function useDeleteTrimestre() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTrimestre = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.deleteTrimestre(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir trimestre');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTrimestre, loading, error };
}

// ===============================
// HOOKS PARA RELATÓRIOS
// ===============================

export function useRelatorioAvaliacao() {
  const [relatorio, setRelatorio] = useState<IAcademicEvaluationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatorio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getRelatorioAvaliacao();
      setRelatorio(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório de avaliação');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRelatorio();
  }, [fetchRelatorio]);

  return {
    relatorio,
    loading,
    error,
    refetch: fetchRelatorio,
  };
}

export function useEstatisticasNotas() {
  const [estatisticas, setEstatisticas] = useState<IEstatisticasNotas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await academicEvaluationService.getEstatisticasNotas();
      setEstatisticas(response.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar estatísticas de notas');
      setEstatisticas(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstatisticas();
  }, [fetchEstatisticas]);

  return {
    estatisticas,
    loading,
    error,
    refetch: fetchEstatisticas,
  };
}
