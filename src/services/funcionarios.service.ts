import api from '../utils/api.utils';

export interface Funcionario {
  codigo: number;
  nome: string;
  user: string;
  estadoActual: string;
}

export interface FuncionariosResponse {
  success: boolean;
  message: string;
  data: Funcionario[];
}

export class FuncionariosService {
  /**
   * Busca todos os funcionários ativos
   */
  static async getAllFuncionarios(): Promise<Funcionario[]> {
    try {
      const response = await api.get<FuncionariosResponse>('/api/payment-management/funcionarios');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar funcionários');
      }
    } catch (error: any) {
      console.error('Erro ao buscar funcionários:', error);
      throw new Error(error.response?.data?.message || 'Erro ao buscar funcionários');
    }
  }

  /**
   * Busca funcionário por ID
   */
  static async getFuncionarioById(id: number): Promise<Funcionario | null> {
    try {
      const funcionarios = await this.getAllFuncionarios();
      return funcionarios.find(f => f.codigo === id) || null;
    } catch (error) {
      console.error('Erro ao buscar funcionário por ID:', error);
      return null;
    }
  }

  /**
   * Busca funcionário logado atual
   */
  static getCurrentUser(): { id: number; nome: string; user: string } | null {
    try {
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          return {
            id: user.id || user.codigo || 1,
            nome: user.nome || user.name || 'Usuário',
            user: user.user || user.username || 'N/A'
          };
        }
      }
      return null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }
}
