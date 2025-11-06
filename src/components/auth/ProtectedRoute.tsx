"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { AlertTriangle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requirePermission?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/",
  requirePermission = true
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, isInitialized } = useAuth();
  const { canAccess, userType } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Só fazer redirecionamento após a inicialização estar completa
    if (isInitialized && !loading && !isAuthenticated) {
      // Verificar se já estamos na página de destino para evitar redirecionamento desnecessário
      if (window.location.pathname !== redirectTo) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, loading, isInitialized, router, redirectTo]);

  // Mostrar loading enquanto não inicializou ou ainda está carregando
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4 loading-spinner"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // O useEffect já fará o redirecionamento
  }

  // Verificar permissões se necessário
  if (requirePermission && !canAccess.route(pathname)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Tipo de usuário: <span className="font-medium capitalize">{userType}</span>
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}