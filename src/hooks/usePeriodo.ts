import { useState, useEffect } from "react"
import periodoService from "@/services/periodo.service"
import { IPeriodo, IPeriodoInput, IPeriodoListResponse } from "@/types/periodo.types"

// Hook para listar períodos
export const usePeriodos = () => {
  const [periodos, setPeriodos] = useState<IPeriodo[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPeriodos = async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await periodoService.getPeriodos(page, limit, search)
      setPeriodos(response.data)
      setPagination(response.pagination)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar períodos")
      setPeriodos([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    periodos,
    pagination,
    isLoading,
    error,
    fetchPeriodos,
    refetch: () => fetchPeriodos()
  }
}

// Hook para buscar um período específico
export const usePeriodo = (id: number) => {
  const [periodo, setPeriodo] = useState<IPeriodo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPeriodo = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await periodoService.getPeriodoById(id)
      setPeriodo(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar período")
      setPeriodo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPeriodo()
  }, [id])

  return {
    periodo,
    isLoading,
    error,
    refetch: fetchPeriodo
  }
}
