import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { directorTurmaService } from '@/services/directorTurma.service';
import {
  IDiretorTurma,
  IDiretorTurmaInput,
  IDiretorTurmaPagination
} from '@/types/directorTurma.types';

// Hook para listar diretores de turma
export function useDiretoresTurma(
  page: number = 1,
  limit: number = 10,
  search?: string
) {
  const [data, setData] = useState<IDiretorTurma[]>([]);
  const [pagination, setPagination] = useState<IDiretorTurmaPagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiretoresTurma = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await directorTurmaService.getDiretoresTurma(page, limit, search);
      setData(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar diretores de turma');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchDiretoresTurma();
  }, [fetchDiretoresTurma]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchDiretoresTurma
  };
}

// Hook para buscar diretor de turma por ID
export function useDiretorTurma(id: number) {
  const [data, setData] = useState<IDiretorTurma | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDiretorTurma = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await directorTurmaService.getDiretorTurmaById(id);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar diretor de turma');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDiretorTurma();
  }, [fetchDiretorTurma]);

  return {
    data,
    loading,
    error,
    refetch: fetchDiretorTurma
  };
}

// Hook para criar diretor de turma
export function useCreateDiretorTurma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDiretorTurma = async (data: IDiretorTurmaInput): Promise<IDiretorTurma | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await directorTurmaService.createDiretorTurma(data);
      return response.data || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar diretor de turma');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createDiretorTurma,
    loading,
    error
  };
}

// Hook para atualizar diretor de turma
export function useUpdateDiretorTurma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDiretorTurma = async (id: number, data: IDiretorTurmaInput): Promise<IDiretorTurma | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await directorTurmaService.updateDiretorTurma(id, data);
      return response.data || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar diretor de turma');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateDiretorTurma,
    loading,
    error
  };
}

// Hook para excluir diretor de turma
export function useDeleteDiretorTurma() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDiretorTurma = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await directorTurmaService.deleteDiretorTurma(id);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir diretor de turma';
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteDiretorTurma,
    loading,
    error
  };
}
