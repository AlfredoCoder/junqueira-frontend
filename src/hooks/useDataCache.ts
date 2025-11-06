import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheOptions {
  key: string;
  ttl?: number; // Time to live em milissegundos (padrão: 5 minutos)
  enabled?: boolean;
}

interface CacheData<T> {
  data: T;
  timestamp: number;
}

/**
 * Hook para gerenciar cache de dados com persistência
 * Evita recarregamentos desnecessários ao navegar entre páginas
 */
export function useDataCache<T>(
  fetchFn: () => Promise<T>,
  options: CacheOptions
) {
  const { key, ttl = 5 * 60 * 1000, enabled = true } = options; // 5 minutos padrão
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);

  // Verificar se há dados em cache válidos
  const getCachedData = useCallback((): T | null => {
    if (!enabled) return null;
    
    try {
      const cached = sessionStorage.getItem(key);
      if (!cached) return null;

      const { data: cachedData, timestamp }: CacheData<T> = JSON.parse(cached);
      const now = Date.now();

      // Verificar se o cache ainda é válido
      if (now - timestamp < ttl) {
        return cachedData;
      }

      // Cache expirado, remover
      sessionStorage.removeItem(key);
      return null;
    } catch (error) {
      console.warn(`Erro ao ler cache para ${key}:`, error);
      return null;
    }
  }, [key, ttl, enabled]);

  // Salvar dados no cache
  const setCachedData = useCallback((newData: T) => {
    if (!enabled) return;
    
    try {
      const cacheData: CacheData<T> = {
        data: newData,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn(`Erro ao salvar cache para ${key}:`, error);
    }
  }, [key, enabled]);

  // Buscar dados (com cache)
  const fetchData = useCallback(async (force = false) => {
    // Evitar múltiplas requisições simultâneas
    if (fetchingRef.current) return;

    // Se não forçar, verificar cache primeiro
    if (!force) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn();
      
      if (isMountedRef.current) {
        setData(result);
        setCachedData(result);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error('Erro ao buscar dados');
        setError(error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, []);

  // Invalidar cache
  const invalidateCache = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setData(null);
    } catch (error) {
      console.warn(`Erro ao invalidar cache para ${key}:`, error);
    }
  }, [key]);

  // Revalidar (forçar nova busca)
  const revalidate = useCallback(() => {
    return fetchData(true);
  }, []);

  // Carregar dados ao montar o componente
  useEffect(() => {
    isMountedRef.current = true;
    
    if (enabled) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    revalidate,
    invalidateCache,
    isStale: () => {
      const cached = getCachedData();
      return cached === null;
    },
  };
}

/**
 * Hook simplificado para dados que não precisam de cache
 */
export function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: React.DependencyList = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Erro ao buscar dados'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}
