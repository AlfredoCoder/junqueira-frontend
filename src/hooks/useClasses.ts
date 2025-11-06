import { useState, useEffect } from 'react';
import api from '@/utils/api.utils';

export interface Classe {
  codigo: number;
  designacao: string;
  status: number;
  notaMaxima: number;
  exame: boolean;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Buscando classes da API...');
      const response = await api.get('/api/academic-management/classes?page=1&limit=100');
      
      if (response.data.success) {
        console.log('✅ Classes carregadas:', response.data.data);
        setClasses(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar classes');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar classes';
      setError(errorMessage);
      console.error('❌ Erro ao carregar classes:', err);
      
      // Fallback para dados mock em caso de erro
      console.log('📋 Usando dados mock como fallback...');
      const mockClasses: Classe[] = [
        { codigo: 1, designacao: '10ª Classe', status: 1, notaMaxima: 20, exame: false },
        { codigo: 2, designacao: '11ª Classe', status: 1, notaMaxima: 20, exame: false },
        { codigo: 3, designacao: '12ª Classe', status: 1, notaMaxima: 20, exame: true },
        { codigo: 4, designacao: '13ª Classe', status: 1, notaMaxima: 20, exame: true }
      ];
      setClasses(mockClasses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses
  };
};
