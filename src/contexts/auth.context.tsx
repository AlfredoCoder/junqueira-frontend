"use client";

import authService from "@/services/auth.service";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LegacyUser, AuthResponse, LoginResponse } from "@/types/auth.types";
import { toast } from "react-toastify";

interface AuthContextType {
  isAuthenticated: boolean;
  user: LegacyUser | null;
  loading: boolean;
  isInitialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<LegacyUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const router = useRouter();

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);

        // Primeiro verifica se há token armazenado
        if (!authService.hasValidToken()) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Se há token, tenta verificar sessão
        const response: AuthResponse<any> = await authService.integratedVerifySession();

        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data.usuario);
        } else {
          // Token inválido, limpar sessão
          authService.clearSession();
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        // Em caso de erro, limpar sessão
        authService.clearSession();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      checkAuth();
    }
  }, [isInitialized]);

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const response: AuthResponse<any> = await authService.integratedLogin({
        username: username,
        password: password
      });


      if (response.success && response.data) {
        const userData = response.data.usuario;

        // Atualizar estado
        setIsAuthenticated(true);
        setUser(userData);

        // Redirecionar imediatamente
        router.replace("/admin");
      } else {
        throw new Error(response.message || "Erro no login");
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      setUser(null);
      authService.clearSession();

      // Mostrar mensagem de erro
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro ao fazer login. Verifique suas credenciais.";
      toast.error(errorMessage);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await authService.integratedLogout();

      if (response.success) {
        toast.success(response.message || "Logout realizado com sucesso!");
      }
    } catch (error: any) {
      // Mostrar mensagem de aviso, mas não bloquear o logout
      const errorMessage = error.response?.data?.message ||
        error.message ||
        "Erro ao fazer logout no servidor, mas você foi desconectado localmente.";
      toast.warning(errorMessage);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      router.push("/"); // Redirect para página de login
    }
  };

  const refreshUser = async () => {
    try {
      if (!isAuthenticated) return;

      const response: AuthResponse<any> = await authService.integratedVerifySession();

      if (response.success && response.data) {
        setUser(response.data.usuario);
      }
    } catch (error) {
      // Se falhar, fazer logout
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      isInitialized,
      login,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}


