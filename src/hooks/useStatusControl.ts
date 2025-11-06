import { useState, useEffect, useCallback } from "react"
import StatusControlService from "@/services/status-control.service"
import {
  ITipoStatus,
  ITipoStatusInput,
  ITipoStatusListResponse,
  IStatus,
  IStatusInput,
  IStatusListResponse,
  IAssociarStatusInput,
  ITipoStatusComContagem
} from "@/types/status-control.types"

// ===============================
// TIPO STATUS - HOOKS
// ===============================

// Listar tipos de status com paginação e busca
export function useTiposStatus(page = 1, limit = 10, search = "") {
  const [tiposStatus, setTiposStatus] = useState<ITipoStatus[]>([])
  const [pagination, setPagination] = useState<
    ITipoStatusListResponse["pagination"] | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTiposStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, pagination } = await StatusControlService.getTiposStatus(
        page,
        limit,
        search
      )
      setTiposStatus(data)
      setPagination(pagination)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tipos de status")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchTiposStatus()
  }, [fetchTiposStatus])

  return { tiposStatus, pagination, loading, error, refetch: fetchTiposStatus }
}

// Buscar tipo de status por ID
export function useTipoStatus(id?: number) {
  const [tipoStatus, setTipoStatus] = useState<ITipoStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTipoStatus = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.getTipoStatusById(id)
      setTipoStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tipo de status")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTipoStatus()
  }, [fetchTipoStatus])

  return { tipoStatus, loading, error, refetch: fetchTipoStatus }
}

// Criar tipo de status
export function useCreateTipoStatus() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTipoStatus = useCallback(async (payload: ITipoStatusInput) => {
    try {
      setLoading(true)
      setError(null)
      return await StatusControlService.createTipoStatus(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar tipo de status")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createTipoStatus, loading, error }
}

// Atualizar tipo de status
export function useUpdateTipoStatus(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTipoStatus = useCallback(
    async (payload: ITipoStatusInput) => {
      try {
        setLoading(true)
        setError(null)
        return await StatusControlService.updateTipoStatus(id, payload)
      } catch (err: any) {
        setError(err.message || "Erro ao atualizar tipo de status")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [id]
  )

  return { updateTipoStatus, loading, error }
}

// Deletar tipo de status
export function useDeleteTipoStatus() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTipoStatus = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await StatusControlService.deleteTipoStatus(id)
    } catch (err: any) {
      setError(err.message || "Erro ao deletar tipo de status")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteTipoStatus, loading, error }
}

// ===============================
// STATUS - HOOKS
// ===============================

// Listar status com paginação e busca
export function useStatus(page = 1, limit = 10, search = "") {
  const [status, setStatus] = useState<IStatus[]>([])
  const [pagination, setPagination] = useState<
    IStatusListResponse["pagination"] | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, pagination } = await StatusControlService.getStatus(
        page,
        limit,
        search
      )
      setStatus(data)
      setPagination(pagination)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar status")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return { status, pagination, loading, error, refetch: fetchStatus }
}

// Buscar status por ID
export function useStatusById(id?: number) {
  const [status, setStatus] = useState<IStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.getStatusById(id)
      setStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar status")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return { status, loading, error, refetch: fetchStatus }
}

// Criar status
export function useCreateStatus() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createStatus = useCallback(async (payload: IStatusInput) => {
    try {
      setLoading(true)
      setError(null)
      return await StatusControlService.createStatus(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar status")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createStatus, loading, error }
}

// Atualizar status
export function useUpdateStatus(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateStatus = useCallback(
    async (payload: IStatusInput) => {
      try {
        setLoading(true)
        setError(null)
        return await StatusControlService.updateStatus(id, payload)
      } catch (err: any) {
        setError(err.message || "Erro ao atualizar status")
        throw err
      } finally {
        setLoading(false)
      }
    },
    [id]
  )

  return { updateStatus, loading, error }
}

// Deletar status
export function useDeleteStatus() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteStatus = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await StatusControlService.deleteStatus(id)
    } catch (err: any) {
      setError(err.message || "Erro ao deletar status")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteStatus, loading, error }
}

// ===============================
// OPERAÇÕES ESPECIAIS - HOOKS
// ===============================

// Buscar status por tipo
export function useStatusByTipo(tipoStatusId?: number) {
  const [status, setStatus] = useState<IStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatusByTipo = useCallback(async () => {
    if (!tipoStatusId) return
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.getStatusByTipo(tipoStatusId)
      setStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar status por tipo")
    } finally {
      setLoading(false)
    }
  }, [tipoStatusId])

  useEffect(() => {
    fetchStatusByTipo()
  }, [fetchStatusByTipo])

  return { status, loading, error, refetch: fetchStatusByTipo }
}

// Buscar status sem tipo
export function useStatusSemTipo() {
  const [status, setStatus] = useState<IStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStatusSemTipo = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.getStatusSemTipo()
      setStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar status sem tipo")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatusSemTipo()
  }, [fetchStatusSemTipo])

  return { status, loading, error, refetch: fetchStatusSemTipo }
}

// Buscar tipos de status com contagem
export function useTiposStatusComContagem() {
  const [tiposStatus, setTiposStatus] = useState<ITipoStatusComContagem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTiposStatusComContagem = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.getTiposStatusComContagem()
      setTiposStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar tipos de status com contagem")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTiposStatusComContagem()
  }, [fetchTiposStatusComContagem])

  return { tiposStatus, loading, error, refetch: fetchTiposStatusComContagem }
}

// Buscar status por designação
export function useBuscarStatusPorDesignacao(designacao: string) {
  const [status, setStatus] = useState<IStatus[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buscarStatus = useCallback(async () => {
    if (!designacao) return
    try {
      setLoading(true)
      setError(null)
      const data = await StatusControlService.buscarStatusPorDesignacao(designacao)
      setStatus(data)
    } catch (err: any) {
      setError(err.message || "Erro ao buscar status por designação")
    } finally {
      setLoading(false)
    }
  }, [designacao])

  useEffect(() => {
    buscarStatus()
  }, [buscarStatus])

  return { status, loading, error, refetch: buscarStatus }
}

// Associar status ao tipo
export function useAssociarStatusAoTipo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const associarStatus = useCallback(async (payload: IAssociarStatusInput) => {
    try {
      setLoading(true)
      setError(null)
      return await StatusControlService.associarStatusAoTipo(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao associar status ao tipo")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { associarStatus, loading, error }
}

// Desassociar status do tipo
export function useDesassociarStatusDoTipo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const desassociarStatus = useCallback(async (statusId: number) => {
    try {
      setLoading(true)
      setError(null)
      return await StatusControlService.desassociarStatusDoTipo(statusId)
    } catch (err: any) {
      setError(err.message || "Erro ao desassociar status do tipo")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { desassociarStatus, loading, error }
}
