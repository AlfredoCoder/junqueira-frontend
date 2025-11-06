import { useState, useEffect, useCallback } from "react"
import anoLectivoService from "@/services/anoLectivo.service"
import { IAnoLectivo, IAnoLectivoInput } from "@/types/anoLectivo.types"

// Hook para listar anos letivos
export const useAnosLectivos = () => {
  const [anosLectivos, setAnosLectivos] = useState<IAnoLectivo[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnosLectivos = useCallback(async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.getAnosLectivos(page, limit, search)
      setAnosLectivos(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar anos letivos")
      setAnosLectivos([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    anosLectivos,
    pagination,
    isLoading,
    error,
    fetchAnosLectivos,
    refetch: () => fetchAnosLectivos()
  }
}

// Hook para buscar um ano letivo específico
export const useAnoLectivo = (id: number) => {
  const [anoLectivo, setAnoLectivo] = useState<IAnoLectivo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnoLectivo = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.getAnoLectivoById(id)
      setAnoLectivo(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar ano letivo")
      setAnoLectivo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnoLectivo()
  }, [id])

  return {
    anoLectivo,
    isLoading,
    error,
    refetch: fetchAnoLectivo
  }
}

// Hook para criar ano letivo
export const useCreateAnoLectivo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAnoLectivo = async (data: IAnoLectivoInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.createAnoLectivo(data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao criar ano letivo")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createAnoLectivo,
    isLoading,
    error
  }
}

// Hook para atualizar ano letivo
export const useUpdateAnoLectivo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateAnoLectivo = async (id: number, data: IAnoLectivoInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await anoLectivoService.updateAnoLectivo(id, data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar ano letivo")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateAnoLectivo,
    isLoading,
    error
  }
}

// Hook para deletar ano letivo
export const useDeleteAnoLectivo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteAnoLectivo = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      await anoLectivoService.deleteAnoLectivo(id)
    } catch (error: any) {
      setError(error.message || "Erro ao deletar ano letivo")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteAnoLectivo,
    isLoading,
    error
  }
}
