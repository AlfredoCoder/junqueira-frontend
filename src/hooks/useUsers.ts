import { useState, useEffect, useCallback } from "react";
import usersService from "@/services/users.service";

interface IUser {
  codigo: number;
  nome: string;
  user: string;
  passe?: string;
  codigo_Tipo_Utilizador: number;
  estadoActual: string;
  dataCadastro: string;
  loginStatus?: string;
  tb_tipos_utilizador?: {
    codigo: number;
    designacao: string;
  };
}

interface IUserInput {
  nome: string;
  user: string;
  passe?: string;
  codigo_Tipo_Utilizador: number;
  estadoActual: string;
}

export function useUsersLegacy(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (pageParam = page, limitParam = limit) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersService.getAllUsersLegacy(pageParam, limitParam);

      setUsers(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    meta,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () => fetchUsers(page, limit),
  };
}

// Hook para criar usuário
export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: IUserInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersService.createLegacyUser(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao criar usuário');
      }

      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error };
}

// Hook para atualizar usuário
export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (id: string | number, userData: Partial<IUserInput>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersService.updateLegacyUser(Number(id), userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao atualizar usuário');
      }

      return response.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
}

// Hook para excluir usuário
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersService.deleteLegacyUser(Number(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao excluir usuário');
      }

      return response;
    } catch (err: any) {
      console.error('Erro detalhado ao excluir usuário:', err);
      
      // Extrair mensagem de erro mais específica
      let errorMessage = 'Erro ao excluir usuário';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
}

// Hook para desativar usuário
export function useDeactivateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deactivateUser = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await usersService.deactivateLegacyUser(Number(id));
      
      if (!response.success) {
        throw new Error(response.message || 'Erro ao desativar usuário');
      }

      return response;
    } catch (err: any) {
      console.error('Erro detalhado ao desativar usuário:', err);
      
      // Extrair mensagem de erro mais específica
      let errorMessage = 'Erro ao desativar usuário';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deactivateUser, loading, error };
}
