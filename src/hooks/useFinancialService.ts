import { useState, useEffect, useCallback } from 'react';
import FinancialServiceService from '@/services/financialService.service';
import {
  ITipoServico,
  ITipoServicoInput,
  ITipoServicoFilter,
  IMoeda,
  IMoedaInput,
  ICategoriaServico,
  ICategoriaServicoInput,
  IRelatorioFinanceiro
} from '@/types/financialService.types';

// ===============================
// HOOKS PARA TIPOS DE SERVIÇOS
// ===============================

export function useTiposServicos(page: number = 1, limit: number = 10, filters?: ITipoServicoFilter) {
  const [tiposServicos, setTiposServicos] = useState<ITipoServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchTiposServicos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Buscando tipos de serviços:', { page, limit, filters });
      const response = await FinancialServiceService.getTiposServicos(page, limit, filters);
      
      setTiposServicos(response.data);
      setPagination(response.pagination);
      console.log('✅ Tipos de serviços carregados:', response.data.length);
    } catch (err: any) {
      console.error('❌ Erro ao carregar tipos de serviços:', err);
      
      // Tentar requisição mais simples em caso de erro
      if (err.response?.status === 400 && (filters?.search || filters?.tipoServico !== 'all' || filters?.status !== 'all')) {
        try {
          console.log('🔄 Tentando fallback sem filtros...');
          const fallbackResponse = await FinancialServiceService.getTiposServicos(page, limit);
          setTiposServicos(fallbackResponse.data);
          setPagination(fallbackResponse.pagination);
          setError(null); // Limpar erro já que conseguimos carregar os dados
          console.log('✅ Fallback bem-sucedido:', fallbackResponse.data.length);
          return;
        } catch (fallbackErr) {
          console.error('❌ Fallback também falhou:', fallbackErr);
        }
      }
      
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de serviços');
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchTiposServicos();
  }, [fetchTiposServicos]);

  return {
    tiposServicos,
    loading,
    error,
    pagination,
    refetch: fetchTiposServicos,
  };
}

export function useTipoServico(id: number) {
  const [tipoServico, setTipoServico] = useState<ITipoServico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoServico = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.getTipoServicoById(id);
      setTipoServico(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipo de serviço');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchTipoServico();
    }
  }, [id]);

  return {
    tipoServico,
    loading,
    error,
    refetch: fetchTipoServico,
  };
}

export function useCreateTipoServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTipoServico = useCallback(async (data: ITipoServicoInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.createTipoServico(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tipo de serviço');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTipoServico, loading, error };
}

export function useUpdateTipoServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTipoServico = useCallback(async (id: number, data: ITipoServicoInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.updateTipoServico(id, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tipo de serviço');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateTipoServico, loading, error };
}

export function useDeleteTipoServico() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTipoServico = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.deleteTipoServico(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir tipo de serviço');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTipoServico, loading, error };
}

// ===============================
// HOOKS PARA MOEDAS
// ===============================

export function useMoedas(page: number = 1, limit: number = 10, search: string = '') {
  const [moedas, setMoedas] = useState<IMoeda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchMoedas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.getMoedas(page, limit, search);
      setMoedas(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar moedas');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchMoedas();
  }, [fetchMoedas]);

  return {
    moedas,
    loading,
    error,
    pagination,
    refetch: fetchMoedas,
  };
}

export function useCreateMoeda() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMoeda = useCallback(async (data: IMoedaInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.createMoeda(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar moeda');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createMoeda, loading, error };
}

export function useDeleteMoeda() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteMoeda = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.deleteMoeda(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir moeda');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteMoeda, loading, error };
}

// ===============================
// HOOKS PARA CATEGORIAS
// ===============================

export function useCategorias(page: number = 1, limit: number = 10, search: string = '') {
  const [categorias, setCategorias] = useState<ICategoriaServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.getCategorias(page, limit, search);
      setCategorias(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return {
    categorias,
    loading,
    error,
    pagination,
    refetch: fetchCategorias,
  };
}

export function useCreateCategoria() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategoria = useCallback(async (data: ICategoriaServicoInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.createCategoria(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCategoria, loading, error };
}

export function useDeleteCategoria() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategoria = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.deleteCategoria(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir categoria');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCategoria, loading, error };
}

// ===============================
// HOOKS PARA CONSULTAS ESPECIAIS
// ===============================

export function useTiposServicosAtivos() {
  const [tiposServicos, setTiposServicos] = useState<ITipoServico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposServicosAtivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.getTiposServicosAtivos();
      setTiposServicos(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de serviços ativos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposServicosAtivos();
  }, [fetchTiposServicosAtivos]);

  return {
    tiposServicos,
    loading,
    error,
    refetch: fetchTiposServicosAtivos,
  };
}

export function useRelatorioFinanceiro() {
  const [relatorio, setRelatorio] = useState<IRelatorioFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatorio = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FinancialServiceService.getRelatorioFinanceiro();
      setRelatorio(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório financeiro');
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
