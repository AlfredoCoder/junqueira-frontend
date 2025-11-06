import { useState, useEffect } from 'react';

export interface Curso {
  codigo: number;
  designacao: string;
  codigo_Status: number;
}

export const useCursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dados mock temporários para cursos
      const mockCursos: Curso[] = [
        { codigo: 1, designacao: 'Informática', codigo_Status: 1 },
        { codigo: 2, designacao: 'Contabilidade', codigo_Status: 1 },
        { codigo: 3, designacao: 'Administração', codigo_Status: 1 },
        { codigo: 4, designacao: 'Secretariado', codigo_Status: 1 },
        { codigo: 5, designacao: 'Electrónica', codigo_Status: 1 },
        { codigo: 6, designacao: 'Construção Civil', codigo_Status: 1 },
        { codigo: 7, designacao: 'Mecânica', codigo_Status: 1 }
      ];
      
      setCursos(mockCursos);
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error('Erro ao carregar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  return {
    cursos,
    loading,
    error,
    refetch: fetchCursos
  };
};
