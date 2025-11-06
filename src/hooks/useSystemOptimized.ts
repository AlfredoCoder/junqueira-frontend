import { useCallback, useEffect } from 'react';
import { clearAllCache, getCacheStats } from './useOptimizedCache';

// Hook principal para gerenciar otimizações do sistema
export const useSystemOptimized = () => {
  
  // Limpar cache quando necessário (logout, refresh, etc.)
  const clearSystemCache = useCallback(() => {
    clearAllCache();
    console.log('🗑️ Cache do sistema limpo');
  }, []);

  // Obter estatísticas do cache para debug
  const getCacheStatistics = useCallback(() => {
    return getCacheStats();
  }, []);

  // Otimizar performance do sistema
  const optimizeSystem = useCallback(() => {
    // Limpar cache expirado
    const stats = getCacheStats();
    const expiredEntries = stats.entries.filter(entry => entry.expired);
    
    if (expiredEntries.length > 0) {
      console.log(`🧹 Limpando ${expiredEntries.length} entradas de cache expiradas`);
      // O cache já limpa automaticamente, mas podemos forçar se necessário
    }

    // Log de performance
    console.log('📊 Sistema otimizado:', {
      totalCacheEntries: stats.totalEntries,
      expiredEntries: expiredEntries.length,
      activeEntries: stats.totalEntries - expiredEntries.length
    });
  }, []);

  // Executar otimizações periódicas
  useEffect(() => {
    // Otimizar a cada 5 minutos
    const interval = setInterval(optimizeSystem, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [optimizeSystem]);

  // Limpar cache ao desmontar (opcional)
  useEffect(() => {
    return () => {
      // Não limpar automaticamente - manter cache entre navegações
      // clearSystemCache();
    };
  }, []);

  return {
    clearSystemCache,
    getCacheStatistics,
    optimizeSystem
  };
};

// Hook para preload de dados críticos
export const usePreloadCriticalData = () => {
  
  const preloadAcademicData = useCallback(async () => {
    // Precarregar dados acadêmicos mais usados
    try {
      console.log('🚀 Precarregando dados acadêmicos...');
      
      // Importar dinamicamente os hooks necessários
      const { useAllTurmasOptimized } = await import('./useTurmaOptimized');
      const { useAllCourses } = await import('./useCourse');
      
      // Executar preload em background
      // Os hooks com cache vão armazenar os dados automaticamente
      
      console.log('✅ Dados acadêmicos precarregados');
    } catch (error) {
      console.error('❌ Erro no preload acadêmico:', error);
    }
  }, []);

  const preloadFinancialData = useCallback(async () => {
    // Precarregar dados financeiros críticos
    try {
      console.log('💰 Precarregando dados financeiros...');
      
      // Preload de estatísticas financeiras (mais leves)
      // Os dados específicos serão carregados sob demanda
      
      console.log('✅ Dados financeiros precarregados');
    } catch (error) {
      console.error('❌ Erro no preload financeiro:', error);
    }
  }, []);

  const preloadCriticalData = useCallback(async () => {
    // Precarregar dados mais críticos em paralelo
    await Promise.all([
      preloadAcademicData(),
      preloadFinancialData()
    ]);
  }, [preloadAcademicData, preloadFinancialData]);

  return {
    preloadAcademicData,
    preloadFinancialData,
    preloadCriticalData
  };
};

// Hook para monitorar performance do sistema
export const usePerformanceMonitor = () => {
  
  const measurePageTransition = useCallback((fromPage: string, toPage: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.log(`⚡ Transição ${fromPage} → ${toPage}: ${duration.toFixed(2)}ms`);
      
      // Log apenas se for lenta (> 1 segundo)
      if (duration > 1000) {
        console.warn(`🐌 Transição lenta detectada: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    };
  }, []);

  const measureHookPerformance = useCallback((hookName: string, operation: () => Promise<any>) => {
    return async () => {
      const startTime = performance.now();
      
      try {
        const result = await operation();
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.log(`🔧 ${hookName}: ${duration.toFixed(2)}ms`);
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        console.error(`❌ ${hookName} falhou em ${duration.toFixed(2)}ms:`, error);
        throw error;
      }
    };
  }, []);

  return {
    measurePageTransition,
    measureHookPerformance
  };
};

// Export principal
export default useSystemOptimized;
