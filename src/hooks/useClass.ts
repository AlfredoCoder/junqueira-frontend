import { useState, useEffect, useRef, useCallback } from "react"
import { toast } from "react-toastify"
import classService from "@/services/class.service"
import { IClass, IClassInput, IPagination } from "@/types/class.types"

// Cache helper
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface CacheData<T> {
  data: T;
  timestamp: number;
  key: string;
}

function getCachedClasses(cacheKey: string): { data: IClass[], pagination: IPagination | null } | null {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp }: CacheData<{ data: IClass[], pagination: IPagination | null }> = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp < CACHE_TTL) {
      console.log(`✅ Cache hit para ${cacheKey}`);
      return data;
    }

    sessionStorage.removeItem(cacheKey);
    return null;
  } catch {
    return null;
  }
}

function setCachedClasses(cacheKey: string, data: IClass[], pagination: IPagination | null): void {
  try {
    const cacheData: CacheData<{ data: IClass[], pagination: IPagination | null }> = {
      data: { data, pagination },
      timestamp: Date.now(),
      key: cacheKey,
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`Erro ao salvar cache para ${cacheKey}:`, error);
  }
}

// Hook para listar classes
export const useClasses = () => {
  const [classes, setClasses] = useState<IClass[]>([])
  const [pagination, setPagination] = useState<IPagination | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)
  const fetchingRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchClasses = useCallback(async (page = 1, limit = 100, search = "") => {
    if (fetchingRef.current) return;

    const cacheKey = `classes-${page}-${limit}-${search}`;
    
    // Verificar cache primeiro
    const cached = getCachedClasses(cacheKey);
    if (cached) {
      setClasses(cached.data);
      setPagination(cached.pagination);
      setIsLoading(false);
      return;
    }

    fetchingRef.current = true;
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.getClasses(page, limit, search)
      if (isMountedRef.current) {
        setClasses(response.data)
        setPagination(response.pagination)
        setCachedClasses(cacheKey, response.data, response.pagination);
      }
    } catch (error: any) {
      if (isMountedRef.current) {
        setError(error.message || "Erro ao buscar classes")
        setClasses([])
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
      fetchingRef.current = false;
    }
  }, [])

  // Carregar classes automaticamente
  useEffect(() => {
    fetchClasses()
  }, [fetchClasses])

  return {
    classes,
    pagination,
    isLoading,
    error,
    fetchClasses,
    refetch: () => fetchClasses()
  }
}

// Hook para buscar uma classe específica
export const useClass = (id: number) => {
  const [classItem, setClassItem] = useState<IClass | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClass = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.getClassById(id)
      setClassItem(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar classe")
      setClassItem(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClass()
  }, [id])

  return {
    classItem,
    isLoading,
    error,
    refetch: fetchClass
  }
}

// Hook para criar classe
export const useCreateClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createClass = async (data: IClassInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.createClass(data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao criar classe")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createClass,
    isLoading,
    error
  }
}

// Hook para atualizar classe
export const useUpdateClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateClass = async (id: number, data: IClassInput) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.updateClass(id, data)
      return response
    } catch (error: any) {
      setError(error.message || "Erro ao atualizar classe")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    updateClass,
    isLoading,
    error
  }
}

// Hook para deletar classe
export const useDeleteClass = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteClass = async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await classService.deleteClass(id)
      return response
    } catch (error: any) {
      const errorMessage = error.message || "Erro ao deletar classe";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return {
    deleteClass,
    isLoading,
    error
  }
}

// Hook personalizado para gerenciar estado local das classes
export const useClassManager = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [limit, setLimit] = useState(10)
  const [selectedClass, setSelectedClass] = useState<IClass | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { classes, pagination, isLoading, error, fetchClasses } = useClasses()

  // Effect para carregar dados quando parâmetros mudarem
  useEffect(() => {
    fetchClasses(currentPage, limit, searchTerm)
  }, [currentPage, limit, searchTerm])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset para primeira página ao fazer busca
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }

  const openCreateModal = () => {
    setSelectedClass(null)
    setIsModalOpen(true)
  }

  const openEditModal = (classItem: IClass) => {
    setSelectedClass(classItem)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedClass(null)
  }

  const openDeleteModal = (classItem: IClass) => {
    setSelectedClass(classItem)
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setSelectedClass(null)
  }

  const refetch = () => {
    fetchClasses(currentPage, limit, searchTerm)
  }

  // Estatísticas baseadas nos dados da paginação e da página atual
  const stats = {
    total: pagination?.totalItems || 0,
    active: classes?.filter((c: IClass) => c.status === 1).length || 0,
    inactive: classes?.filter((c: IClass) => c.status === 0).length || 0,
  }

  return {
    // Dados
    classes: classes || [],
    pagination,
    stats,
    isLoading,
    error,
    
    // Estado local
    currentPage,
    searchTerm,
    limit,
    selectedClass,
    isModalOpen,
    isDeleteModalOpen,
    
    // Ações
    handleSearch,
    handlePageChange,
    handleLimitChange,
    openCreateModal,
    openEditModal,
    closeModal,
    openDeleteModal,
    closeDeleteModal,
    refetch,
  }
}