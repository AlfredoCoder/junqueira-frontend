"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import useAuth from '@/hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isInitialized, loading } = useAuth();
  const { canAccess, userInfo } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized || loading) return;

    // Se não está autenticado, redirecionar para login
    if (!isAuthenticated) {
      if (pathname !== '/') {
        router.push('/');
      }
      return;
    }

    // Se está autenticado mas não tem permissão para a rota atual
    if (!canAccess.route(pathname)) {
      // Redirecionar baseado no tipo de usuário
      if (userInfo?.isProfessor) {
        // Professores vão para "Perfil Professor"
        router.push('/admin/perfil-professor');
      } else if (userInfo?.isAluno) {
        // Alunos vão para "Meu Perfil"
        router.push('/admin/perfil');
      } else {
        // Administradores e outros vão para dashboard
        router.push('/admin');
      }
      return;
    }
  }, [isAuthenticated, isInitialized, loading, pathname, canAccess, userInfo, router]);

  // Mostrar loading enquanto verifica
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4 loading-spinner"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (redirecionamento em andamento)
  if (!isAuthenticated) {
    return null;
  }

  // Se não tem permissão, não renderizar nada (redirecionamento em andamento)
  if (!canAccess.route(pathname)) {
    return null;
  }

  return <>{children}</>;
}
