import { useState, useEffect, useCallback } from 'react';
import { ProfessoresService } from '@/services/professores.service';
import { IProfessor, IFiltrosProfessor } from '@/types/professores.types';

// Hook para buscar professores com paginação
export function useProfessores(
  page: number = 1, 
  limit: number = 10, 
  search?: string,
  status?: string
) {
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  const fetchProfessores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtros: IFiltrosProfessor = {
        page,
        limit,
        search: search || undefined,
        status: status && status !== 'all' ? status as any : undefined
      };

      const response = await ProfessoresService.listar(filtros);
      
      if (response.success) {
        setProfessores(response.data || []);
        setPagination(response.pagination || null);
      } else {
        setError(response.message || 'Erro ao carregar professores');
      }
    } catch (err: unknown) {
      console.error('Erro ao buscar professores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar professores');
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchProfessores();
  }, [fetchProfessores]);

  return {
    professores,
    loading,
    error,
    pagination,
    refetch: fetchProfessores
  };
}

// Hook para buscar todos os professores sem paginação
export function useAllProfessores(search?: string) {
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProfessores = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtros: IFiltrosProfessor = {
        page: 1,
        limit: 1000, // Buscar todos
        search: search || undefined
      };

      const response = await ProfessoresService.listar(filtros);
      
      if (response.success) {
        setProfessores(response.data || []);
      } else {
        setError(response.message || 'Erro ao carregar professores');
      }
    } catch (err: unknown) {
      console.error('Erro ao buscar todos os professores:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar professores');
      setProfessores([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAllProfessores();
  }, [fetchAllProfessores]);

  return {
    professores,
    loading,
    error,
    refetch: fetchAllProfessores
  };
}
