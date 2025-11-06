import { useState, useEffect, useCallback, useRef } from 'react';

// Cache global para evitar requisições desnecessárias
const globalCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

interface CacheOptions {
  ttl?: number; // Time to live em milliseconds (padrão: 5 minutos)
  key: string;
}

export function useOptimizedCache<T>(
  fetchFunction: () => Promise<T>,
  options: CacheOptions
) {
  const { ttl = 5 * 60 * 1000, key } = options; // 5 minutos padrão
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Verificar cache primeiro
    if (!forceRefresh) {
      const cached = globalCache.get(key);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        console.log(`✅ Cache hit para ${key}`);
        setData(cached.data);
        setLoading(false);
        return cached.data;
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 Fazendo requisição para ${key}...`);
      const result = await fetchFunction();
      
      if (isMountedRef.current) {
        setData(result);
        
        // Salvar no cache
        globalCache.set(key, {
          data: result,
          timestamp: Date.now(),
          ttl
        });
        
        console.log(`💾 Dados salvos no cache para ${key}`);
      }
      
      return result;
    } catch (err) {
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(errorMessage);
        console.error(`❌ Erro ao buscar ${key}:`, err);
      }
      throw err;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchFunction, key, ttl]);

  const clearCache = useCallback(() => {
    globalCache.delete(key);
    console.log(`🗑️ Cache limpo para ${key}`);
  }, [key]);

  const refetch = useCallback(() => {
    return fetchData(true); // Force refresh
  }, [fetchData]);

  // Carregar dados na inicialização
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    fetchData
  };
}

// Hook específico para listas paginadas com cache inteligente
export function useOptimizedPaginatedCache<T>(
  fetchFunction: (page: number, limit: number, search?: string) => Promise<{ data: T[]; pagination: any }>,
  page: number = 1,
  limit: number = 10,
  search: string = ''
) {
  const cacheKey = `paginated-${page}-${limit}-${search}`;
  
  return useOptimizedCache(
    () => fetchFunction(page, limit, search),
    { key: cacheKey, ttl: 2 * 60 * 1000 } // 2 minutos para dados paginados
  );
}

// Limpar todo o cache (útil para logout ou refresh geral)
export function clearAllCache() {
  globalCache.clear();
  console.log('🗑️ Todo o cache foi limpo');
}

// Obter estatísticas do cache
export function getCacheStats() {
  const stats = {
    totalEntries: globalCache.size,
    entries: Array.from(globalCache.entries()).map(([key, value]) => ({
      key,
      age: Date.now() - value.timestamp,
      ttl: value.ttl,
      expired: Date.now() - value.timestamp > value.ttl
    }))
  };
  
  console.log('📊 Estatísticas do cache:', stats);
  return stats;
}
