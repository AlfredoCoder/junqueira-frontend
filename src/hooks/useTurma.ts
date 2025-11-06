import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import turmaService from "@/services/turma.service"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"

// Hook para listar TODAS as turmas (sem paginação)
export const useAllTurmas = () => {
  const [turmas, setTurmas] = useState<ITurma[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllTurmas = useCallback(async (search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Hook useAllTurmas: Buscando TODAS as turmas...', { search })
      const response = await turmaService.getAllTurmas(search)
      console.log('Hook useAllTurmas: Resposta recebida:', response)
      setTurmas(response.data)
    } catch (error: unknown) {
      console.error('Hook useAllTurmas: Erro ao buscar turmas:', error)
      setError(error instanceof Error ? error.message : "Erro ao buscar turmas")
      setTurmas([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    turmas,
    isLoading,
    error,
    fetchAllTurmas,
    refetch: () => fetchAllTurmas()
  }
}

// Hook para listar turmas (com paginação)
export const useTurmas = () => {
  const [turmas, setTurmas] = useState<ITurma[]>([])
  const [pagination, setPagination] = useState<ITurmaListResponse['pagination'] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTurmas = useCallback(async (page = 1, limit = 10, search = "") => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.getTurmas(page, limit, search)
      setTurmas(response.data)
      setPagination(response.pagination)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao buscar turmas")
      setTurmas([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    turmas,
    pagination,
    isLoading,
    error,
    fetchTurmas,
    refetch: () => fetchTurmas()
  }
}

// Hook para buscar uma turma específica
export const useTurma = (id: number) => {
  const [turma, setTurma] = useState<ITurma | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTurma = useCallback(async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.getTurmaById(id)
      setTurma(response)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao buscar turma")
      setTurma(null)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTurma()
  }, [fetchTurma])

  return {
    turma,
    isLoading,
    error,
    refetch: fetchTurma
  }
}

// Hook para criar turma
export const useCreateTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTurma = async (data: ITurmaInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.createTurma(data)
      return response
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao criar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createTurma,
    isLoading,
    error
  }
}

// Hook para atualizar turma
export const useUpdateTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTurma = async (id: number, data: ITurmaInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.updateTurma(id, data)
      return response
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateTurma,
    isLoading,
    error
  }
}

// Hook para deletar turma
export const useDeleteTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteTurma = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.deleteTurma(id)
      return response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao deletar turma"
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteTurma,
    isLoading,
    error
  }
}

// Hook para validar disponibilidade de sala
export const useValidateSala = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateSalaDisponibilidade = async (codigoSala: number, codigoPeriodo: number, codigoAnoLectivo: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.validateSalaDisponibilidade(codigoSala, codigoPeriodo, codigoAnoLectivo)
      return response
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao validar sala"
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    validateSalaDisponibilidade,
    isLoading,
    error
  }
}

// Hook para arquivar/desativar turma
export const useArchiveTurma = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const archiveTurma = async (id: number, status: 'Ativo' | 'Inativo' | 'Arquivado') => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await turmaService.updateTurmaStatus(id, status)
      return response
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao arquivar turma")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    archiveTurma,
    isLoading,
    error
  }
}

// Hook personalizado para gerenciar estado local das turmas (TODAS)
export const useTurmaManager = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null)

  const { turmas, isLoading, error, fetchAllTurmas } = useAllTurmas()

  // Effect para carregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchAllTurmas(searchTerm)
  }, [searchTerm, fetchAllTurmas])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const refetch = useCallback(() => {
    fetchAllTurmas(searchTerm)
  }, [fetchAllTurmas, searchTerm])

  // Estatísticas básicas
  const stats = {
    total: turmas?.length || 0,
    active: turmas?.filter((t: ITurma) => t.status === "Ativo").length || 0,
    inactive: turmas?.filter((t: ITurma) => t.status === "Inativo").length || 0,
  }

  return {
    // Dados
    turmas: turmas || [],
    stats,
    isLoading,
    error,
    
    // Estado local
    searchTerm,
    selectedTurma,
    
    // Funções
    handleSearch,
    refetch,
    setSelectedTurma
  }
}

// Hook personalizado para gerenciar turmas com paginação do servidor
export const useTurmaManagerPaginated = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedTurma, setSelectedTurma] = useState<ITurma | null>(null)

  const { turmas, pagination, isLoading, error, fetchTurmas } = useTurmas()

  // Debounce do search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setCurrentPage(1) // Reset para página 1 ao buscar
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Effect para carregar dados quando parâmetros mudarem - otimizado
  useEffect(() => {
    fetchTurmas(currentPage, limit, debouncedSearch)
  }, [currentPage, limit, debouncedSearch]) // Removido fetchTurmas das dependências

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const refetch = useCallback(() => {
    fetchTurmas(currentPage, limit, debouncedSearch)
  }, [fetchTurmas, currentPage, limit, debouncedSearch])

  // Estatísticas baseadas na paginação
  const stats = {
    total: pagination?.totalItems || 0,
    active: turmas?.filter((t: ITurma) => t.status === "Ativo").length || 0,
    inactive: turmas?.filter((t: ITurma) => t.status === "Inativo").length || 0,
  }

  return {
    // Dados
    turmas: turmas || [],
    pagination: pagination || { totalItems: 0, currentPage: 1, itemsPerPage: 10, totalPages: 1 },
    stats,
    isLoading,
    error,
    
    // Estado local
    searchTerm,
    currentPage,
    limit,
    selectedTurma,
    
    // Funções
    handleSearch,
    handlePageChange,
    refetch,
    setSelectedTurma
  }
}
