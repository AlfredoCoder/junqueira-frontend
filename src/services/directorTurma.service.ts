import {
  IDiretorTurma,
  IDiretorTurmaInput,
  IDiretorTurmaResponse,
  IDiretorTurmaListResponse,
  IDiretorTurmaActionResponse
} from '@/types/directorTurma.types';
import api from '@/utils/api.utils';

class DirectorTurmaService {
  // Listar diretores de turma com paginação
  async getDiretoresTurma(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<IDiretorTurmaListResponse> {
    let endpoint = `/api/academic-staff/diretores-turmas?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar diretor de turma por ID
  async getDiretorTurmaById(id: number): Promise<IDiretorTurmaResponse> {
    const response = await api.get(`/api/academic-staff/diretores-turmas/${id}`);
    return response.data;
  }

  // Criar diretor de turma
  async createDiretorTurma(data: IDiretorTurmaInput): Promise<IDiretorTurmaActionResponse> {
    const response = await api.post('/api/academic-staff/diretores-turmas', data);
    return response.data;
  }

  // Atualizar diretor de turma
  async updateDiretorTurma(id: number, data: IDiretorTurmaInput): Promise<IDiretorTurmaActionResponse> {
    const response = await api.put(`/api/academic-staff/diretores-turmas/${id}`, data);
    return response.data;
  }

  // Excluir diretor de turma
  async deleteDiretorTurma(id: number): Promise<IDiretorTurmaActionResponse> {
    const response = await api.delete(`/api/academic-staff/diretores-turmas/${id}`);
    return response.data;
  }
}

export const directorTurmaService = new DirectorTurmaService();
