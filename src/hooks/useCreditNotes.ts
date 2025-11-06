import { useState, useCallback } from 'react';
import api from '@/utils/api.utils';

interface CreditNote {
  codigo: number;
  designacao: string;
  fatura: string;
  descricao: string;
  valor: string;
  codigo_aluno: number;
  documento: string;
  next: string;
  dataOperacao: string;
  codigoPagamentoi?: number;
  tb_alunos?: {
    codigo: number;
    nome: string;
    n_documento_identificacao: string;
  };
  tb_pagamentoi?: {
    codigo: number;
    data: string;
    preco: number;
    fatura: string;
    mes: string;
  };
}

interface CreditNotePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface CreateCreditNoteData {
  designacao: string;
  fatura: string;
  descricao: string;
  valor: string;
  codigo_aluno: number;
  documento: string;
  next: string;
  dataOperacao?: string;
  codigoPagamentoi?: number;
}

export const useCreditNotes = () => {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<CreditNotePagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchCreditNotes = useCallback(async (
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await api.get(`/api/payment-management/notas-credito?${params}`);
      
      if (response.data.success) {
        setCreditNotes(response.data.data || []);
        setPagination(response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit
        });
      } else {
        throw new Error(response.data.message || 'Erro ao carregar notas de crédito');
      }
    } catch (err: any) {
      console.error('Erro ao buscar notas de crédito:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao carregar notas de crédito');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCreditNote = useCallback(async (data: CreateCreditNoteData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/payment-management/notas-credito', data);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao criar nota de crédito');
      }
    } catch (err: any) {
      console.error('Erro ao criar nota de crédito:', err);
      console.error('Resposta completa do erro:', err.response?.data);
      console.error('Status do erro:', err.response?.status);
      console.error('Headers do erro:', err.response?.headers);
      
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar nota de crédito';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCreditNoteById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/api/payment-management/notas-credito/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao carregar nota de crédito');
      }
    } catch (err: any) {
      console.error('Erro ao buscar nota de crédito:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar nota de crédito';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    creditNotes,
    loading,
    error,
    pagination,
    fetchCreditNotes,
    createCreditNote,
    getCreditNoteById,
    clearError
  };
};

export default useCreditNotes;
