import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/getErrorMessage.utils';
import { disciplineTeacherService } from '@/services/disciplineTeacher.service';
import { IDisciplinaDocente, IDisciplinaDocenteInput } from '@/types/disciplineTeacher.types';

// Hook para listar disciplinas do docente
export function useDisciplinasDocente(page: number = 1, limit: number = 10, search: string = '') {
  const [data, setData] = useState<IDisciplinaDocente[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisciplinasDocente = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.getDisciplinasDocente(page, limit, search);

      if (response.success) {
        setData(response.data);
        setPagination(response.pagination);
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar disciplinas do docente");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchDisciplinasDocente();
  }, [fetchDisciplinasDocente]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchDisciplinasDocente
  };
}

// Hook para buscar disciplina do docente por ID
export function useDisciplinaDocente(id: number) {
  const [data, setData] = useState<IDisciplinaDocente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplinaDocente = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await disciplineTeacherService.getDisciplinaDocenteById(id);

        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Disciplina do docente não encontrada');
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Erro ao carregar disciplina do docente");
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinaDocente();
  }, [id]);

  return { data, loading, error };
}

// Hook para criar disciplina do docente
export function useCreateDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDisciplinaDocente = async (data: IDisciplinaDocenteInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.createDisciplinaDocente(data);

      if (response.success) {
        return response.data;
      }
      
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao criar disciplina do docente");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createDisciplinaDocente, loading, error };
}

// Hook para atualizar disciplina do docente
export function useUpdateDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDisciplinaDocente = async (id: number, data: IDisciplinaDocenteInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.updateDisciplinaDocente(id, data);

      if (response.success) {
        return response.data;
      }

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao atualizar disciplina do docente");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateDisciplinaDocente, loading, error };
}

// Hook para excluir disciplina do docente
export function useDeleteDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDisciplinaDocente = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.deleteDisciplinaDocente(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao excluir disciplina do docente");
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDisciplinaDocente, loading, error };
}

// Hook para obter estatísticas de disciplinas-docente
export function useEstatisticasDisciplinasDocente() {
  const [data, setData] = useState<{
    resumo: {
      totalAtribuicoes: number;
      professoresAtivos: number;
      cursosUnicos: number;
      disciplinasUnicas: number;
    };
    rankings: {
      topDocentes: Array<{ codigo: number; nome: string; totalAtribuicoes: number }>;
      topCursos: Array<{ codigo: number; nome: string; totalAtribuicoes: number }>;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await disciplineTeacherService.getEstatisticasDisciplinasDocente();

        if (response.success && response.data) {
          setData(response.data);
        }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, "Erro ao carregar estatísticas");
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEstatisticas();
  }, []);

  return { data, loading, error };
}
