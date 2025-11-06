import api from "@/utils/api.utils";
import { toast } from "react-toastify";
import {
  IFormaPagamento,
  IFormaPagamentoInput,
  IFormaPagamentoResponse,
  IFormaPagamentoListResponse,
  IPagamentoPrincipal,
  IPagamentoPrincipalInput,
  IPagamentoPrincipalResponse,
  IPagamentoPrincipalListResponse,
  IDetalhePagamento,
  IDetalhePagamentoInput,
  IDetalhePagamentoResponse,
  IDetalhePagamentoListResponse,
  IRelatorioFinanceiroResponse,
  IDashboardFinanceiroResponse,
  IEstatisticasPagamentosResponse,
  IPagamentoFilter,
  IPaymentActionResponse
} from '@/types/payment.types';

export default class PaymentService {

  // ===============================
  // PAGAMENTOS PRINCIPAIS
  // ===============================

  static async getAllPagamentosPrincipais(filters?: IPagamentoFilter): Promise<IPagamentoPrincipalListResponse> {
    // Buscar todos os pagamentos principais sem paginação
    return this.getPagamentosPrincipais(1, 1000, filters);
  }

  static async getPagamentosPrincipais(page: number = 1, limit: number = 10, filters?: IPagamentoFilter): Promise<IPagamentoPrincipalListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.codigo_Aluno && { codigo_Aluno: filters.codigo_Aluno.toString() }),
        ...(filters?.dataInicio && { dataInicio: filters.dataInicio }),
        ...(filters?.dataFim && { dataFim: filters.dataFim }),
        ...(filters?.status && { status: filters.status.toString() }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get(`/api/payment-management/pagamentos-principais?${params}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pagamentos principais:", error);
      throw error;
    }
  }

  static async getPagamentoPrincipalById(id: number): Promise<IPagamentoPrincipalResponse> {
    try {
      const response = await api.get(`/api/payment-management/pagamentos-principais/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pagamento principal:", error);
      throw error;
    }
  }

  static async createPagamentoPrincipal(data: IPagamentoPrincipalInput): Promise<IPagamentoPrincipalResponse> {
    try {
      const response = await api.post('/api/payment-management/pagamentos-principais', data);
      const apiResponse = response.data;
      
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Pagamento criado com sucesso!");
      }
      
      return apiResponse;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar pagamento principal";
      toast.error(errorMessage);
      console.error("Erro ao criar pagamento principal:", error);
      throw error;
    }
  }

  static async updatePagamentoPrincipal(id: number, data: IPagamentoPrincipalInput): Promise<IPagamentoPrincipalResponse> {
    try {
      const response = await api.put(`/api/payment-management/pagamentos-principais/${id}`, data);
      const apiResponse = response.data;
      
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Pagamento atualizado com sucesso!");
      }
      
      return apiResponse;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar pagamento principal";
      toast.error(errorMessage);
      console.error("Erro ao atualizar pagamento principal:", error);
      throw error;
    }
  }

  static async deletePagamentoPrincipal(id: number): Promise<IPaymentActionResponse> {
    try {
      const response = await api.delete(`/api/payment-management/pagamentos-principais/${id}`);
      const apiResponse = response.data;
      
      if (apiResponse.success) {
        toast.success(apiResponse.message || "Pagamento excluído com sucesso!");
      }
      
      return apiResponse;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao excluir pagamento principal";
      toast.error(errorMessage);
      console.error("Erro ao excluir pagamento principal:", error);
      throw error;
    }
  }

  // ===============================
  // DETALHES DE PAGAMENTO
  // ===============================

  static async getDetalhesPagamento(page: number = 1, limit: number = 10, filters?: IPagamentoFilter): Promise<IDetalhePagamentoListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(filters?.codigo_Aluno && { codigo_Aluno: filters.codigo_Aluno.toString() }),
        ...(filters?.codigo_Tipo_Servico && { codigo_Tipo_Servico: filters.codigo_Tipo_Servico.toString() }),
        ...(filters?.dataInicio && { dataInicio: filters.dataInicio }),
        ...(filters?.dataFim && { dataFim: filters.dataFim }),
        ...(filters?.search && { search: filters.search })
      });

      const response = await api.get(`/api/payment-management/pagamentos?${params}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhes de pagamento:", error);
      throw error;
    }
  }

  static async getDetalhePagamentoById(id: number): Promise<IDetalhePagamentoResponse> {
    try {
      const response = await api.get(`/api/payment-management/pagamentos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar detalhe de pagamento:", error);
      throw error;
    }
  }

  // ===============================
  // DASHBOARD E RELATÓRIOS
  // ===============================

  static async getDashboardFinanceiro(): Promise<IDashboardFinanceiroResponse> {
    try {
      const response = await api.get('/api/payment-management/dashboard');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar dashboard financeiro:", error);
      throw error;
    }
  }

  static async getRelatorioFinanceiro(
    dataInicio: string,
    dataFim: string,
    tipoRelatorio: string = 'resumo',
    codigo_Aluno?: number,
    codigo_FormaPagamento?: number
  ): Promise<IRelatorioFinanceiroResponse> {
    try {
      const params = new URLSearchParams({
        dataInicio,
        dataFim,
        tipoRelatorio,
        ...(codigo_Aluno && { codigo_Aluno: codigo_Aluno.toString() }),
        ...(codigo_FormaPagamento && { codigo_FormaPagamento: codigo_FormaPagamento.toString() })
      });

      const response = await api.get(`/api/payment-management/relatorio?${params}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao gerar relatório financeiro:", error);
      throw error;
    }
  }

  static async getEstatisticasPagamentos(periodo: string = '30'): Promise<IEstatisticasPagamentosResponse> {
    try {
      const params = new URLSearchParams({ periodo });
      const response = await api.get(`/api/payment-management/estatisticas?${params}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas de pagamentos:", error);
      throw error;
    }
  }
}
