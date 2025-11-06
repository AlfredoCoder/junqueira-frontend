import { useState, useEffect, useCallback } from "react"
import ConfirmationService from "@/services/confirmation.service"
import {
  IConfirmation,
  IConfirmationInput,
  IConfirmationListResponse,
  IConfirmationsByClassAndYear,
  IConfirmationStatistics
} from "@/types/confirmation.types"
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/getErrorMessage.utils';

// Listagem com paginação e busca com filtros
export function useConfirmations(
  page = 1,
  limit = 10,
  search = "",
  status?: string | null,
  anoLectivo?: string | null
) {
  const [confirmations, setConfirmations] = useState<IConfirmation[]>([])
  const [pagination, setPagination] = useState<IConfirmationListResponse["pagination"] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Buscar diretamente na API com filtros otimizados
      const { data, pagination } = await ConfirmationService.getConfirmations(
        page,
        limit,
        search,
        status,
        anoLectivo
      )

      
      setConfirmations(data)
      setPagination(pagination)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar confirmações");
      setError(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfirmations()
  }, [])

  return { confirmations, pagination, loading, error, refetch: fetchConfirmations }
}

// Uma confirmação por ID - Otimizado para modal rápido
export function useConfirmation(id?: number) {
  const [confirmation, setConfirmation] = useState<IConfirmation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmation = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔍 Carregando confirmação ID:', id);
      const startTime = performance.now();
      
      const data = await ConfirmationService.getConfirmationById(id)
      
      const endTime = performance.now();
      
      setConfirmation(data)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar confirmação");
      setError(errorMessage);
      console.error('❌ Erro ao carregar confirmação:', err);
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch manual para modal - não automático
  const fetchConfirmationManual = useCallback(async (confirmationId: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const startTime = performance.now();
      
      const data = await ConfirmationService.getConfirmationById(confirmationId)
      
      const endTime = performance.now();
      
      setConfirmation(data)
      return data;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar confirmação");
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) {
      fetchConfirmation()
    }
  }, [id])

  return { 
    confirmation, 
    loading, 
    error, 
    refetch: fetchConfirmation,
    fetchConfirmationManual,
    clearConfirmation: () => setConfirmation(null)
  }
}

// Criar
export function useCreateConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createConfirmation = useCallback(async (payload: IConfirmationInput) => {
    try {
      setLoading(true)
      setError(null)
      const result = await ConfirmationService.createConfirmation(payload)
      toast.success("Confirmação criada com sucesso!")
      return result
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao criar confirmação");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return { createConfirmation, loading, error }
}

// Atualizar
export function useUpdateConfirmation(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateConfirmation = useCallback(async (payload: Partial<IConfirmationInput>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await ConfirmationService.updateConfirmation(id, payload)
      if (result) {
        toast.success("Confirmação atualizada com sucesso!")
      }
      return result
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao atualizar confirmação");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [id])

  return { updateConfirmation, loading, error }
}

// Deletar
export function useDeleteConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteConfirmation = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await ConfirmationService.deleteConfirmation(id)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar confirmação");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteConfirmation, loading, error }
}

// Batch
export function useBatchConfirmation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchConfirmation = useCallback(async (payload: IConfirmationInput[]) => {
    try {
      setLoading(true)
      setError(null)
      const result = await ConfirmationService.batchConfirmation(payload)
      if (result) {
        toast.success("Confirmações criadas com sucesso!")
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao criar confirmações em lote");
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])
  return { batchConfirmation, loading, error }
}

// Confirmações por turma e ano
export function useConfirmationsByClassAndYear() {
  const [confirmations, setConfirmations] = useState<IConfirmation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConfirmationsByClassAndYear = useCallback(async (params: IConfirmationsByClassAndYear) => {
    try {
      setLoading(true)
      setError(null)
      const data = await ConfirmationService.getConfirmationsByClassAndYear(params);
      setConfirmations(data);
      return data
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar confirmações por turma e ano");
      toast.error(errorMessage);
      throw err
    } finally {
      setLoading(false);
    }
  }, [])

  return {
    confirmations,
    loading,
    error,
    fetchConfirmationsByClassAndYear
  }
}

// Estatísticas de confirmações
export function useConfirmationsStatistics(status?: string | null, anoLectivo?: string | null) {
  const [statistics, setStatistics] = useState<IConfirmationStatistics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await ConfirmationService.getConfirmationsStatistics(status, anoLectivo)
      setStatistics(data)
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Erro ao carregar estatísticas de confirmações");
      setError(errorMessage)
      toast.error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [status, anoLectivo])

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  return { statistics, loading, error, refetch: fetchStatistics }
}