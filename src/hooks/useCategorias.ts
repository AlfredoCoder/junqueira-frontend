import { useState, useEffect } from 'react';

export interface Categoria {
  codigo: number;
  designacao: string;
  descricao?: string;
  status: string;
}

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Dados das categorias de serviços do sistema
      const mockCategorias: Categoria[] = [
        { codigo: 1, designacao: 'Propina', descricao: 'Pagamentos de propinas escolares', status: 'Activo' },
        { codigo: 2, designacao: 'Matricula', descricao: 'Taxas de matrícula', status: 'Activo' },
        { codigo: 3, designacao: 'Confirmacao', descricao: 'Taxas de confirmação', status: 'Activo' },
        { codigo: 4, designacao: 'Uniformes', descricao: 'Uniformes escolares', status: 'Activo' },
        { codigo: 5, designacao: 'Folhas de prova', descricao: 'Folhas para provas', status: 'Activo' },
        { codigo: 6, designacao: 'Declaracao', descricao: 'Declarações diversas', status: 'Activo' },
        { codigo: 7, designacao: 'Certificado', descricao: 'Certificados de conclusão', status: 'Activo' },
        { codigo: 8, designacao: 'Diploma', descricao: 'Diplomas de formação', status: 'Activo' },
        { codigo: 9, designacao: 'Cartao de escola', descricao: 'Cartão de identificação escolar', status: 'Activo' },
        { codigo: 10, designacao: 'Justifivo', descricao: 'Justificativos de faltas', status: 'Activo' },
        { codigo: 11, designacao: 'Boletim de notas', descricao: 'Boletins de notas', status: 'Activo' },
        { codigo: 12, designacao: 'Saidas extra escolares', descricao: 'Atividades extra escolares', status: 'Activo' }
      ];
      
      setCategorias(mockCategorias);
    } catch (err) {
      setError('Erro ao carregar categorias');
      console.error('Erro ao carregar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    refetch: fetchCategorias
  };
};
