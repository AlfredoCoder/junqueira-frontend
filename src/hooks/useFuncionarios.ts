import { useState, useEffect, useCallback } from 'react';
import { FuncionariosService, type Funcionario } from '../services/funcionarios.service';

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFuncionarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await FuncionariosService.getAllFuncionarios();
      setFuncionarios(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFuncionarioById = useCallback((id: number) => {
    return funcionarios.find(f => f.codigo === id) || null;
  }, [funcionarios]);

  const getCurrentUser = useCallback(() => {
    return FuncionariosService.getCurrentUser();
  }, []);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

  return {
    funcionarios,
    loading,
    error,
    fetchFuncionarios,
    getFuncionarioById,
    getCurrentUser
  };
};
