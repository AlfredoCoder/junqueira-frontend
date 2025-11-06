import { useMemo } from 'react';
import useAuth from './useAuth';

/**
 * Hook para obter informações do utilizador atual
 * Retorna o código do utilizador logado para usar em formulários
 */
export const useCurrentUser = () => {
  const { user, isAuthenticated } = useAuth();

  const currentUserInfo = useMemo(() => {
    if (!isAuthenticated || !user) {
      return {
        codigo_Utilizador: null,
        nome: null,
        tipo: null,
        isAuthenticated: false
      };
    }

    return {
      codigo_Utilizador: (user as any).codigo || (user as any).id || null,
      nome: (user as any).nome || (user as any).name || user.username || null,
      tipo: (user as any).tipo || (user as any).tipoDesignacao || null,
      isAuthenticated: true
    };
  }, [user, isAuthenticated]);

  return currentUserInfo;
};
