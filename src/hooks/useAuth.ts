import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "@/contexts/auth.context";
import authService from "@/services/auth.service";
import { UserType } from "@/types/auth.types";

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default useAuth;

// Hook para buscar tipos de usuário
export function useUserTypes() {
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.getUserTypes();
      
      if (response.success && response.data) {
        setUserTypes(response.data);
      }
    } catch (err) {
      console.error('Erro ao buscar tipos de usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserTypes();
  }, [fetchUserTypes]);

  return {
    userTypes,
    loading,
    error,
    refetch: fetchUserTypes,
  };
}