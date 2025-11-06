import { useState, useCallback } from 'react';
import api from '../utils/api.utils';

export interface RelatorioVendasFuncionario {
  funcionarioId: number;
  funcionarioNome: string;
  funcionarioUser: string;
  totalVendas: number;
  quantidadePagamentos: number;
  percentualDoTotal?: string; // Percentual das vendas em relação ao total geral
  pagamentos: Array<{
    codigo: number;
    aluno: string;
    tipoServico: string;
    valor: number;
    mes: string;
    ano: number;
    data: string;
    formaPagamento: string;
  }>;
}

export interface RelatorioVendasGeral {
  periodo: string;
  dataInicio: string;
  dataFim: string;
  totalGeral: number;
  totalPagamentos: number;
  funcionarios: RelatorioVendasFuncionario[];
  resumo: {
    melhorFuncionario: RelatorioVendasFuncionario | null;
    totalFuncionarios: number;
    mediaVendasPorFuncionario: number;
  };
}

export interface RelatorioVendasDetalhado {
  funcionario: {
    codigo: number;
    nome: string;
    user: string;
  };
  periodo: string;
  dataInicio: string;
  dataFim: string;
  totalVendas: number;
  quantidadePagamentos: number;
  pagamentos: Array<{
    codigo: number;
    aluno: string;
    tipoServico: string;
    valor: number;
    mes: string;
    ano: number;
    data: string;
    formaPagamento: string;
    fatura: string;
  }>;
}

export const useRelatoriosVendas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [relatorioGeral, setRelatorioGeral] = useState<RelatorioVendasGeral | null>(null);
  const [relatorioDetalhado, setRelatorioDetalhado] = useState<RelatorioVendasDetalhado | null>(null);

  const fetchRelatorioGeral = useCallback(async (
    periodo: 'diario' | 'semanal' | 'mensal' = 'diario',
    dataInicio?: string,
    dataFim?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);
      
      const response = await api.get(`/api/payment-management/relatorios/vendas-funcionarios?${params.toString()}`);
      
      if (response.data.success) {
        setRelatorioGeral(response.data.data);
      } else {
        setError(response.data.message || 'Erro ao buscar relatório');
      }
    } catch (err: any) {
      console.error('Erro ao buscar relatório geral:', err);
      setError(err.response?.data?.message || 'Erro ao buscar relatório');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRelatorioDetalhado = useCallback(async (
    funcionarioId: number,
    periodo: 'diario' | 'semanal' | 'mensal' = 'diario',
    dataInicio?: string,
    dataFim?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      params.append('periodo', periodo);
      
      if (dataInicio) params.append('dataInicio', dataInicio);
      if (dataFim) params.append('dataFim', dataFim);
      
      const response = await api.get(`/api/payment-management/relatorios/vendas-funcionario/${funcionarioId}?${params.toString()}`);
      
      if (response.data.success) {
        setRelatorioDetalhado(response.data.data);
      } else {
        setError(response.data.message || 'Erro ao buscar relatório detalhado');
      }
    } catch (err: any) {
      console.error('Erro ao buscar relatório detalhado:', err);
      setError(err.response?.data?.message || 'Erro ao buscar relatório detalhado');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRelatorios = useCallback(() => {
    setRelatorioGeral(null);
    setRelatorioDetalhado(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    relatorioGeral,
    relatorioDetalhado,
    fetchRelatorioGeral,
    fetchRelatorioDetalhado,
    clearRelatorios
  };
};
