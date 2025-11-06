'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSystemOptimized, usePreloadCriticalData, usePerformanceMonitor } from '@/hooks/useSystemOptimized';

// Context para otimizações do sistema
interface OptimizationContextType {
  clearSystemCache: () => void;
  getCacheStatistics: () => any;
  optimizeSystem: () => void;
  preloadCriticalData: () => Promise<void>;
  measurePageTransition: (fromPage: string, toPage: string) => () => number;
}

const OptimizationContext = createContext<OptimizationContextType | null>(null);

// Hook para usar o contexto
export const useOptimization = () => {
  const context = useContext(OptimizationContext);
  if (!context) {
    throw new Error('useOptimization deve ser usado dentro de OptimizationProvider');
  }
  return context;
};

// Provider das otimizações
interface OptimizationProviderProps {
  children: ReactNode;
  enablePreload?: boolean;
  enablePerformanceMonitoring?: boolean;
}

export const OptimizationProvider: React.FC<OptimizationProviderProps> = ({
  children,
  enablePreload = true,
  enablePerformanceMonitoring = process.env.NODE_ENV === 'development'
}) => {
  const { clearSystemCache, getCacheStatistics, optimizeSystem } = useSystemOptimized();
  const { preloadCriticalData } = usePreloadCriticalData();
  const { measurePageTransition } = usePerformanceMonitor();

  // Preload inicial de dados críticos
  useEffect(() => {
    if (enablePreload) {
      // Delay para não interferir com o carregamento inicial
      const timer = setTimeout(() => {
        preloadCriticalData();
      }, 2000); // 2 segundos após o mount

      return () => clearTimeout(timer);
    }
  }, [enablePreload, preloadCriticalData]);

  // Log de inicialização
  useEffect(() => {
    if (enablePerformanceMonitoring) {
      console.log('🚀 Sistema de otimizações inicializado');
      console.log('📊 Configurações:', {
        preload: enablePreload,
        monitoring: enablePerformanceMonitoring,
        environment: process.env.NODE_ENV
      });
    }
  }, [enablePreload, enablePerformanceMonitoring]);

  const contextValue: OptimizationContextType = {
    clearSystemCache,
    getCacheStatistics,
    optimizeSystem,
    preloadCriticalData,
    measurePageTransition
  };

  return (
    <OptimizationContext.Provider value={contextValue}>
      {children}
    </OptimizationContext.Provider>
  );
};

// HOC para páginas otimizadas
export const withOptimization = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    preloadData?: () => Promise<void>;
    pageName?: string;
  }
) => {
  const OptimizedComponent: React.FC<P> = (props) => {
    const { measurePageTransition } = useOptimization();

    useEffect(() => {
      if (options?.pageName) {
        const endMeasure = measurePageTransition('previous', options.pageName);
        
        // Preload específico da página
        if (options?.preloadData) {
          options.preloadData().catch(console.error);
        }

        return () => {
          endMeasure();
        };
      }
    }, [measurePageTransition]);

    return <Component {...props} />;
  };

  OptimizedComponent.displayName = `withOptimization(${Component.displayName || Component.name})`;
  
  return OptimizedComponent;
};

// Hook para transições de página otimizadas
export const useOptimizedNavigation = () => {
  const { measurePageTransition } = useOptimization();

  const navigateWithMeasurement = (fromPage: string, toPage: string, navigationFn: () => void) => {
    const endMeasure = measurePageTransition(fromPage, toPage);
    
    // Executar navegação
    navigationFn();
    
    // Medir após um pequeno delay para capturar o tempo de renderização
    setTimeout(() => {
      endMeasure();
    }, 100);
  };

  return { navigateWithMeasurement };
};

export default OptimizationProvider;
