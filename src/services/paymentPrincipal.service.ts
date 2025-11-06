import { toast } from "react-toastify";
import { 
  IPagamentoPrincipalInput, 
  IPagamentoPrincipal,
  IPagamentoPrincipalResponse,
  IPagamentoPrincipalListResponse,
  IAlunoBasicoResponse,
  IAlunoBasico
} from '@/types/financialService.types';
import api from '@/utils/api.utils';

class PaymentPrincipalService {
  // ===============================
  // PAGAMENTOS PRINCIPAIS
  // ===============================

  async createPagamentoPrincipal(data: IPagamentoPrincipalInput): Promise<IPagamentoPrincipal> {
    try {
      const response = await api.post('/api/payment-management/pagamentos-principais', data);
      toast.success(response.data.message || 'Pagamento principal criado com sucesso!');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao criar pagamento principal';
      toast.error(errorMessage);
      console.error('Erro ao criar pagamento principal:', error);
      throw error;
    }
  }

  async getAllPagamentosPrincipais(
    filters: Record<string, unknown> = {}
  ): Promise<{ data: IPagamentoPrincipal[]; pagination: Record<string, unknown> }> {
    return this.getPagamentosPrincipais(1, 1000, filters);
  }

  async getPagamentosPrincipais(
    page: number = 1, 
    limit: number = 10, 
    filters: Record<string, unknown> = {}
  ): Promise<{ data: IPagamentoPrincipal[]; pagination: Record<string, unknown> }> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      params.append('_t', Date.now().toString());
      
      Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `/api/payment-management/pagamentos-principais?${params}`;
      console.log('🌐 Fazendo requisição para:', url);
      
      const response = await api.get(url);
      console.log('📊 Dados recebidos:', response.data);

      const result = response.data;

      if (result.data && Array.isArray(result.data)) {
        return {
          data: result.data,
          pagination: result.pagination || {
            currentPage: page,
            totalPages: Math.ceil((result.data.length || 0) / limit),
            totalItems: result.data.length || 0,
            itemsPerPage: limit
          }
        };
      }

      if (Array.isArray(result)) {
        return {
          data: result,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(result.length / limit),
            totalItems: result.length,
            itemsPerPage: limit
          }
        };
      }

      return {
        data: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: limit
        }
      };

    } catch (error: any) {
      console.error('❌ Erro ao buscar pagamentos principais:', error);
      throw error;
    }
  }

  async getPagamentoPrincipalById(id: number): Promise<IPagamentoPrincipal> {
    try {
      const response = await api.get(`/api/payment-management/pagamentos-principais/${id}`);
      return response.data.data;
    } catch (error: any) {
      console.error('Erro ao buscar pagamento principal:', error);
      throw error;
    }
  }

  async updatePagamentoPrincipal(id: number, data: Partial<IPagamentoPrincipalInput>): Promise<IPagamentoPrincipal> {
    try {
      const response = await api.put(`/api/payment-management/pagamentos-principais/${id}`, data);
      toast.success(response.data.message || 'Pagamento principal atualizado com sucesso!');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar pagamento principal';
      toast.error(errorMessage);
      console.error('Erro ao atualizar pagamento principal:', error);
      throw error;
    }
  }

  async deletePagamentoPrincipal(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/payment-management/pagamentos-principais/${id}`);
      toast.success(response.data.message || 'Pagamento principal excluído com sucesso!');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao excluir pagamento principal';
      toast.error(errorMessage);
      console.error('Erro ao excluir pagamento principal:', error);
      throw error;
    }
  }

  // ===============================
  // ALUNOS BÁSICOS
  // ===============================

  async getAlunosBasicos(): Promise<IAlunoBasico[]> {
    try {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('limit', '1000');

      const url = `/api/student-management/alunos/basicos?${params}`;
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar alunos básicos:', error);
      throw error;
    }
  }
}

export const paymentPrincipalService = new PaymentPrincipalService();
