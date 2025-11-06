import { useState, useCallback, useMemo } from "react"
import { toast } from "react-toastify"
import turmaService from "@/services/turma.service"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"
import { useOptimizedCache, useOptimizedPaginatedCache } from "./useOptimizedCache"

// Hook otimizado para gerenciar turmas com cache inteligente
export const useTurmaManagerOptimized = (
  initialPage: number = 1,
  initialLimit: number = 10,
  initialSearch: string = ""
) => {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [limit] = useState(initialLimit)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch)

  // Cache otimizado para dados paginados
  const { 
    data: response, 
    loading: isLoading, 
    error, 
    refetch: refetchData 
  } = useOptimizedPaginatedCache(
    turmaService.getTurmas,
    currentPage,
    limit,
    debouncedSearch
  );

  // Memoizar dados extraídos
  const turmas = useMemo(() => response?.data || [], [response?.data]);
  const pagination = useMemo(() => response?.pagination || {
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: limit,
    totalPages: 1
  }, [response?.pagination, limit]);

  // Debounce otimizado
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    
    // Debounce manual otimizado
    const timer = setTimeout(() => {
      setDebouncedSearch(term);
      setCurrentPage(1); // Reset para página 1
    }, 300); // Reduzido de 500ms para 300ms

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refetch = useCallback(() => {
    refetchData();
  }, [refetchData]);

  // Estatísticas memoizadas
  const stats = useMemo(() => ({
    total: pagination.totalItems,
    active: turmas.filter((t: ITurma) => t.status === "Ativo").length,
    inactive: turmas.filter((t: ITurma) => t.status === "Inativo").length,
  }), [turmas, pagination.totalItems]);

  return {
    // Dados
    turmas,
    pagination,
    stats,
    
    // Estados
    isLoading,
    error,
    searchTerm,
    currentPage,
    
    // Ações
    handleSearch,
    handlePageChange,
    refetch
  };
};

// Hook otimizado para todas as turmas (sem paginação)
export const useAllTurmasOptimized = (search: string = "") => {
  return useOptimizedCache(
    () => turmaService.getAllTurmas(search),
    { 
      key: `all-turmas-${search}`,
      ttl: 5 * 60 * 1000 // 5 minutos
    }
  );
};

// Hook otimizado para turma específica
export const useTurmaOptimized = (id: number) => {
  return useOptimizedCache(
    () => turmaService.getTurmaById(id),
    { 
      key: `turma-${id}`,
      ttl: 10 * 60 * 1000 // 10 minutos para dados específicos
    }
  );
};

// Hook para criar turma (sem cache)
export const useCreateTurma = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTurma = useCallback(async (data: ITurmaInput) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await turmaService.createTurma(data);
      toast.success('Turma criada com sucesso!');
      
      // Limpar cache relacionado
      // clearAllCache(); // Se necessário
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar turma';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createTurma,
    isLoading,
    error
  };
};

// Hook para atualizar turma (sem cache)
export const useUpdateTurma = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTurma = useCallback(async (id: number, data: ITurmaInput) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await turmaService.updateTurma(id, data);
      toast.success('Turma atualizada com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar turma';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    updateTurma,
    isLoading,
    error
  };
};

// Hook para deletar turma (sem cache)
export const useDeleteTurma = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTurma = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await turmaService.deleteTurma(id);
      toast.success('Turma excluída com sucesso!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir turma';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    deleteTurma,
    isLoading,
    error
  };
};
