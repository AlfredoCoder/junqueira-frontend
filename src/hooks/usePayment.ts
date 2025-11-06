import { useState, useEffect, useCallback } from 'react';
import PaymentService from '@/services/payment.service';
import {
  IPagamentoPrincipal,
  IPagamentoPrincipalInput,
  IDetalhePagamento,
  IRelatorioFinanceiro,
  IDashboardFinanceiro,
  IEstatisticasPagamentos,
  IPagamentoFilter
} from '@/types/payment.types';


export function usePagamentosPrincipais(page: number = 1, limit: number = 10, filters?: IPagamentoFilter) {
  const [pagamentos, setPagamentos] = useState<IPagamentoPrincipal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchPagamentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getPagamentosPrincipais(page, limit, filters);
      setPagamentos(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPagamentos();
  }, []);

  return {
    pagamentos,
    loading,
    error,
    pagination,
    refetch: fetchPagamentos,
  };
}

export function usePagamentoPrincipal(id: number) {
  const [pagamento, setPagamento] = useState<IPagamentoPrincipal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPagamento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getPagamentoPrincipalById(id);
      setPagamento(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pagamento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPagamento();
  }, []);

  return {
    pagamento,
    loading,
    error,
    refetch: fetchPagamento,
  };
}

export function useCreatePagamentoPrincipal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPagamento = useCallback(async (data: IPagamentoPrincipalInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.createPagamentoPrincipal(data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createPagamento, loading, error };
}

export function useUpdatePagamentoPrincipal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePagamento = useCallback(async (id: number, data: IPagamentoPrincipalInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.updatePagamentoPrincipal(id, data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updatePagamento, loading, error };
}

export function useDeletePagamentoPrincipal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePagamento = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.deletePagamentoPrincipal(id);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deletePagamento, loading, error };
}

// ===============================
// HOOKS PARA DETALHES DE PAGAMENTO
// ===============================

export function useDetalhesPagamento(page: number = 1, limit: number = 10, filters?: IPagamentoFilter) {
  const [detalhes, setDetalhes] = useState<IDetalhePagamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchDetalhes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getDetalhesPagamento(page, limit, filters);
      setDetalhes(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes de pagamento');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDetalhes();
  }, []);

  return {
    detalhes,
    loading,
    error,
    pagination,
    refetch: fetchDetalhes,
  };
}

// ===============================
// HOOKS PARA DASHBOARD E RELATÓRIOS
// ===============================

export function useDashboardFinanceiro() {
  const [dashboard, setDashboard] = useState<IDashboardFinanceiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getDashboardFinanceiro();
      setDashboard(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard financeiro');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}

export function useRelatorioFinanceiro() {
  const [relatorio, setRelatorio] = useState<IRelatorioFinanceiro | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gerarRelatorio = useCallback(async (
    dataInicio: string,
    dataFim: string,
    tipoRelatorio: string = 'resumo',
    codigo_Aluno?: number,
    codigo_FormaPagamento?: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getRelatorioFinanceiro(
        dataInicio,
        dataFim,
        tipoRelatorio,
        codigo_Aluno,
        codigo_FormaPagamento
      );
      setRelatorio(response.data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar relatório financeiro');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    relatorio,
    loading,
    error,
    gerarRelatorio,
  };
}

export function useEstatisticasPagamentos(periodo: string = '30') {
  const [estatisticas, setEstatisticas] = useState<IEstatisticasPagamentos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstatisticas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PaymentService.getEstatisticasPagamentos(periodo);
      setEstatisticas(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas de pagamentos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstatisticas();
  }, []);

  return {
    estatisticas,
    loading,
    error,
    refetch: fetchEstatisticas,
  };
}
