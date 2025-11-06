import { useState, useEffect, useCallback } from "react"
import { toast } from "react-toastify"
import salaService from "@/services/sala.service"
import { ISala, ISalaInput, ISalaListResponse } from "@/types/sala.types"

// Cache helper
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface CacheData<T> {
  data: T;
  timestamp: number;
  key: string;
}

function getCachedSalas(cacheKey: string): { data: ISala[], pagination: any } | null {
  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp }: CacheData<{ data: ISala[], pagination: any }> = JSON.parse(cached);
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

function setCachedSalas(cacheKey: string, data: ISala[], pagination: any): void {
  try {
    const cacheData: CacheData<{ data: ISala[], pagination: any }> = {
      data: { data, pagination },
      timestamp: Date.now(),
      key: cacheKey,
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`Erro ao salvar cache para ${cacheKey}:`, error);
  }
}

// Hook para listar salas - otimizado
export const useSalas = () => {
  const [salas, setSalas] = useState<ISala[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSalas = useCallback(async (page = 1, limit = 10, search = "") => {
    const cacheKey = `salas-${page}-${limit}-${search}`;
    
    // Tentar buscar do cache primeiro
    const cached = getCachedSalas(cacheKey);
    if (cached) {
      setSalas(cached.data);
      setPagination(cached.pagination);
      setError(null);
      return;
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await salaService.getSalas(page, limit, search)
      setSalas(response.data)
      setPagination(response.pagination)
      
      // Salvar no cache
      setCachedSalas(cacheKey, response.data, response.pagination);
    } catch (error: any) {
      setError(error.message || "Erro ao buscar salas")
      setSalas([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Função para limpar cache
  const clearCache = useCallback(() => {
    // Limpar todos os caches de salas
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('salas-')) {
        sessionStorage.removeItem(key);
      }
    });
  }, []);

  return {
    salas,
    pagination,
    loading: isLoading,
    isLoading,
    error,
    fetchSalas,
    refetch: fetchSalas,
    clearCache
  }
}

// Hook para buscar uma sala específica
export const useSala = (id: number) => {
  const [sala, setSala] = useState<ISala | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSala = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await salaService.getSalaById(id)
      setSala(response)
    } catch (error: any) {
      setError(error.message || "Erro ao buscar sala")
      setSala(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSala()
  }, [id])

  return {
    sala,
    isLoading,
    error,
    refetch: fetchSala
  }
}

// Hook para criar sala
export const useCreateSala = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSala = async (data: ISalaInput): Promise<ISala> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await salaService.createSala(data)
      toast.success('Sala criada com sucesso!')
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar sala'
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { createSala, isLoading, error }
}

// Hook para atualizar sala
export const useUpdateSala = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSala = async (id: number, data: ISalaInput): Promise<ISala> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await salaService.updateSala(id, data)
      toast.success('Sala atualizada com sucesso!')
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar sala'
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateSala, isLoading, error }
}

// Hook para excluir sala
export const useDeleteSala = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteSala = async (id: number): Promise<void> => {
    setIsLoading(true)
    setError(null)
    
    try {
      await salaService.deleteSala(id)
      toast.success('Sala excluída com sucesso!')
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao excluir sala'
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteSala, loading: isLoading, isLoading, error }
}
