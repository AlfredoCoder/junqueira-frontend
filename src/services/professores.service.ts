import api from '@/utils/api.utils';
import {
  IProfessor,
  IProfessorInput,
  IAtribuicaoDisciplinaInput,
  IAtribuicaoTurmaInput,
  IApiResponse,
  IFiltrosProfessor,
  IProfessorTurma
} from '@/types/professores.types';

// ===============================================================
// SERVIÇO DE PROFESSORES
// ===============================================================

export class ProfessoresService {
  private static baseUrl = '/api/professores';

  /**
   * Listar professores com filtros e paginação
   */
  static async listar(filtros: IFiltrosProfessor = {}): Promise<IApiResponse<IProfessor[]>> {
    const params = new URLSearchParams();
    
    if (filtros.search) params.append('search', filtros.search);
    if (filtros.status) params.append('status', filtros.status);
    if (filtros.page) params.append('page', filtros.page.toString());
    if (filtros.limit) params.append('limit', filtros.limit.toString());

    const response = await api.get(`${this.baseUrl}?${params.toString()}`);
    return response.data;
  }

  /**
   * Buscar professor por ID
   */
  static async buscarPorId(id: number): Promise<IApiResponse<IProfessor>> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Criar novo professor
   */
  static async criar(dados: IProfessorInput): Promise<IApiResponse<IProfessor>> {
    const response = await api.post(this.baseUrl, dados);
    return response.data;
  }

  /**
   * Atualizar professor
   */
  static async atualizar(id: number, dados: Partial<IProfessorInput>): Promise<IApiResponse<IProfessor>> {
    const response = await api.put(`${this.baseUrl}/${id}`, dados);
    return response.data;
  }

  /**
   * Buscar turmas do professor
   */
  static async buscarTurmas(professorId: number, anoLectivo?: string): Promise<IApiResponse<IProfessorTurma[]>> {
    const params = new URLSearchParams();
    if (anoLectivo) params.append('anoLectivo', anoLectivo);

    const response = await api.get(`${this.baseUrl}/${professorId}/turmas?${params.toString()}`);
    return response.data;
  }

  /**
   * Atribuir disciplina ao professor
   */
  static async atribuirDisciplina(
    professorId: number, 
    dados: IAtribuicaoDisciplinaInput
  ): Promise<IApiResponse<any>> {
    const response = await api.post(`${this.baseUrl}/${professorId}/disciplinas`, dados);
    return response.data;
  }

  /**
   * Atribuir turma ao professor
   */
  static async atribuirTurma(
    professorId: number, 
    dados: IAtribuicaoTurmaInput
  ): Promise<IApiResponse<any>> {
    const response = await api.post(`${this.baseUrl}/${professorId}/turmas`, dados);
    return response.data;
  }
}

export default ProfessoresService;
