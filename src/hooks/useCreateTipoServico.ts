import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';

export interface ITipoServicoInput {
  designacao: string;
  preco: number;
  descricao: string;
  codigo_Utilizador: number;
  codigo_Moeda: number;
  tipoServico: string;
  status: string;
  aplicarMulta: boolean;
  aplicarDesconto: boolean;
  valorMulta?: number;
  percentualDesconto?: number;
  categoria?: number | null;
  codigo_Classe?: number | null;
  codigo_Curso?: number | null;
}

export const useCreateTipoServico = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTipoServico = useCallback(async (data: ITipoServicoInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/api/financial-services/tipos-servicos', data);
      
      if (response.data.success) {
        toast.success('Serviço criado com sucesso!');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar serviço');
      }
    } catch (err: any) {
      console.log('🔍 Detalhes do erro:', err.response?.data);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Erro ao criar serviço';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createTipoServico,
    loading,
    error
  };
};
