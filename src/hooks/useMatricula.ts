import { useState, useEffect, useCallback } from "react"
import MatriculaService from "@/services/matricula.service"
import {
  IMatricula,
  IMatriculaInput,
  IMatriculaListResponse,
  IMatriculaDetailed,
  IMatriculasByAnoLectivo,
  IMatriculasWithoutConfirmation,
  IMatriculaStatistics
} from "@/types/matricula.types"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/utils/getErrorMessage.utils"

// Listagem com paginação e busca via API
export function useMatriculas(page = 1, limit = 10, search = "", statusFilter?: string | null, cursoFilter?: string | null) {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([])
  const [pagination, setPagination] = useState<IMatriculaListResponse["pagination"] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      // Buscar com filtros no backend
      const { data, pagination } = await MatriculaService.getMatriculas(page, limit, search, statusFilter, cursoFilter)

      setMatriculas(data)
      setPagination(pagination)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar matrículas");
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, statusFilter, cursoFilter])

  useEffect(() => {
    fetchMatriculas()
  }, [fetchMatriculas])

  return { matriculas, pagination, loading, error, refetch: fetchMatriculas }
}

// Uma matrícula por ID com detalhes completos
export function useMatricula(id?: number) {
  const [matricula, setMatricula] = useState<IMatriculaDetailed | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatricula = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculaById(id)
      setMatricula(data)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar receita mensal");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchMatricula()
  }, [fetchMatricula])

  return { matricula, loading, error, refetch: fetchMatricula }
}

// Criar
export function useCreateMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMatricula = useCallback(async (payload: IMatriculaInput) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.createMatricula(payload)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao criar matrícula");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return { createMatricula, loading, error }
}

// Atualizar
export function useUpdateMatricula(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMatricula = useCallback(async (payload: Partial<IMatriculaInput>) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.updateMatricula(id, payload)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao atualizar matrícula");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [id])

  return { updateMatricula, loading, error }
}

// Deletar
export function useDeleteMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteMatricula = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await MatriculaService.deleteMatricula(id)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar receita mensal");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteMatricula, loading, error }
}

// Batch
export function useBatchMatricula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchMatricula = useCallback(async (payload: IMatriculaInput[]) => {
    try {
      setLoading(true)
      setError(null)
      return await MatriculaService.batchMatricula(payload)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao criar matrículas em lote");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return { batchMatricula, loading, error }
}

// Matrículas por ano letivo
export function useMatriculasByAnoLectivo() {
  const [matriculas, setMatriculas] = useState<IMatricula[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculasByAnoLectivo = useCallback(async (params: IMatriculasByAnoLectivo) => {
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculasByAnoLectivo(params)
      setMatriculas(data)
      return data
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar matrículas por ano letivo");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    matriculas,
    loading,
    error,
    fetchMatriculasByAnoLectivo
  }
}

// Matrículas sem confirmação
export function useMatriculasWithoutConfirmacao() {
  const [matriculas, setMatriculas] = useState<IMatriculasWithoutConfirmation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatriculasWithoutConfirmacao = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculasWithoutConfirmacao()
      setMatriculas(data)
      return data
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar matrículas sem confirmação");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto fetch on mount
  useEffect(() => {
    fetchMatriculasWithoutConfirmacao()
  }, [fetchMatriculasWithoutConfirmacao])

  return {
    matriculas,
    loading,
    error,
    refetch: fetchMatriculasWithoutConfirmacao
  }
}

// Estatísticas de matrículas
export function useMatriculasStatistics(statusFilter?: string | null, cursoFilter?: string | null) {
  const [statistics, setStatistics] = useState<IMatriculaStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await MatriculaService.getMatriculasStatistics(statusFilter, cursoFilter)
      setStatistics(data)
      return data
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar estatísticas de matrículas");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [statusFilter, cursoFilter])

  // Auto fetch on mount and when filters change
  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return {
    statistics,
    loading,
    error,
    refetch: fetchStatistics
  }
}