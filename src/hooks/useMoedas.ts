import { useState, useEffect } from 'react';

export interface Moeda {
  codigo: number;
  designacao: string;
  simbolo: string;
  status: string;
}

export const useMoedas = (page: number = 1, limit: number = 100) => {
  const [moedas, setMoedas] = useState<Moeda[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMoedas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dados mock temporários para moedas
      const mockMoedas: Moeda[] = [
        { codigo: 1, designacao: 'Kwanza Angolano', simbolo: 'AOA', status: 'Activo' },
        { codigo: 2, designacao: 'Dólar Americano', simbolo: 'USD', status: 'Activo' },
        { codigo: 3, designacao: 'Euro', simbolo: 'EUR', status: 'Activo' }
      ];
      
      setMoedas(mockMoedas);
    } catch (err) {
      setError('Erro ao carregar moedas');
      console.error('Erro ao carregar moedas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoedas();
  }, [page, limit]);

  return {
    moedas,
    loading,
    error,
    refetch: fetchMoedas
  };
};
