import { useState, useEffect, useCallback } from 'react';
import { paymentPrincipalService } from '@/services/paymentPrincipal.service';
import { 
  IPagamentoPrincipal, 
  IPagamentoPrincipalInput,
  IAlunoBasico
} from '@/types/financialService.types';

// ===============================
// HOOK PARA CRIAR PAGAMENTO PRINCIPAL
// ===============================

export const useCreatePagamentoPrincipal = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPagamentoPrincipal = async (data: IPagamentoPrincipalInput): Promise<IPagamentoPrincipal | null> => {
    setIsCreating(true);
    setError(null);
    
    try {
      const pagamento = await paymentPrincipalService.createPagamentoPrincipal(data);
      return pagamento;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar pagamento principal');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createPagamentoPrincipal,
    isCreating,
    error,
  };
};

// ===============================
// HOOK PARA LISTAR TODOS OS PAGAMENTOS PRINCIPAIS (SEM PAGINAÇÃO)
// ===============================

export const useAllPagamentosPrincipais = (
  filters: Record<string, unknown> = {}
) => {
  const [pagamentos, setPagamentos] = useState<IPagamentoPrincipal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllPagamentos = useCallback(async (filters: Record<string, unknown> = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await paymentPrincipalService.getAllPagamentosPrincipais(filters);
      setPagamentos(result.data);
    } catch (err: unknown) {
      console.error('❌ Erro ao buscar todos os pagamentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar pagamentos principais');
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchAllPagamentos(filters);
  }, [fetchAllPagamentos, filters]);

  return {
    pagamentos,
    isLoading,
    error,
    refetch: fetchAllPagamentos,
  };
};

// ===============================
// HOOK PARA LISTAR PAGAMENTOS PRINCIPAIS (COM PAGINAÇÃO)
// ===============================

export const usePagamentosPrincipais = (
  page: number = 1,
  limit: number = 10,
  filters: Record<string, unknown> = {}
) => {
  const [pagamentos, setPagamentos] = useState<IPagamentoPrincipal[]>([]);
  const [pagination, setPagination] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPagamentos = useCallback(async (filters: Record<string, unknown> = {}) => {
    setIsLoading(true);
    setError(null);
    
    // Limpar qualquer cache local
    localStorage.removeItem('pagamentos-cache');
    sessionStorage.removeItem('pagamentos-cache');
    
    try {
      const result = await paymentPrincipalService.getPagamentosPrincipais(page, limit, filters);
      setPagamentos(result.data);
      setPagination(result.pagination);
    } catch (err: unknown) {
      console.error(' Erro ao buscar pagamentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar pagamentos principais');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, JSON.stringify(filters)]);

  useEffect(() => {
    fetchPagamentos(filters);
  }, [fetchPagamentos, filters]);

  return {
    pagamentos,
    pagination,
    isLoading,
    error,
    refetch: fetchPagamentos,
  };
};

// ===============================
// HOOK PARA BUSCAR PAGAMENTO PRINCIPAL POR ID
// ===============================

export const usePagamentoPrincipal = (id: number | null) => {
  const [pagamento, setPagamento] = useState<IPagamentoPrincipal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPagamento = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await paymentPrincipalService.getPagamentoPrincipalById(id);
        setPagamento(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar pagamento principal');
        setPagamento(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPagamento();
  }, [id]);

  return {
    pagamento,
    isLoading,
    error,
  };
};

// ===============================
// HOOK PARA ATUALIZAR PAGAMENTO PRINCIPAL
// ===============================

export const useUpdatePagamentoPrincipal = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePagamentoPrincipal = async (
    id: number, 
    data: Partial<IPagamentoPrincipalInput>
  ): Promise<IPagamentoPrincipal | null> => {
    setIsUpdating(true);
    setError(null);
    
    try {
      const pagamento = await paymentPrincipalService.updatePagamentoPrincipal(id, data);
      return pagamento;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pagamento principal');
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updatePagamentoPrincipal,
    isUpdating,
    error,
  };
};

// ===============================
// HOOK PARA EXCLUIR PAGAMENTO PRINCIPAL
// ===============================

export const useDeletePagamentoPrincipal = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePagamentoPrincipal = async (id: number): Promise<boolean> => {
    setIsDeleting(true);
    setError(null);
    
    try {
      await paymentPrincipalService.deletePagamentoPrincipal(id);
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pagamento principal');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deletePagamentoPrincipal,
    isDeleting,
    error,
  };
};

// ===============================
// HOOK PARA BUSCAR ALUNOS BÁSICOS
// ===============================

export const useAlunosBasicos = () => {
  const [alunos, setAlunos] = useState<IAlunoBasico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await paymentPrincipalService.getAlunosBasicos();
      setAlunos(result);
    } catch (err: any) {
      console.error('❌ Erro ao buscar alunos:', err);
      setError(err.message || 'Erro ao buscar alunos');
      setAlunos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  return {
    alunos,
    isLoading,
    error,
    refetch: fetchAlunos,
  };
};
