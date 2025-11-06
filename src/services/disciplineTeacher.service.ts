import { toast } from "react-toastify"
import {
  IDisciplinaDocenteResponse,
  IDisciplinaDocenteInput,
  IDisciplinaDocenteActionResponse
} from '@/types/disciplineTeacher.types';
import api from '@/utils/api.utils';

class DisciplineTeacherService {
  // Listar disciplinas do docente com paginação
  async getDisciplinasDocente(
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ): Promise<IDisciplinaDocenteResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    const response = await api.get(`/api/academic-staff/disciplinas-docente?${params}`);
    return response.data;
  }

  // Buscar disciplina do docente por ID
  async getDisciplinaDocenteById(id: number): Promise<IDisciplinaDocenteActionResponse> {
    const response = await api.get(`/api/academic-staff/disciplinas-docente/${id}`);
    return response.data;
  }

  // Criar nova associação disciplina-docente
  async createDisciplinaDocente(data: IDisciplinaDocenteInput): Promise<IDisciplinaDocenteActionResponse> {
    const response = await api.post('/api/academic-staff/disciplinas-docente', data);
    if (response.data.success) {
      toast.success(response.data.message || "Disciplina associada ao docente com sucesso!");
    }
    return response.data;
  }

  // Atualizar associação disciplina-docente
  async updateDisciplinaDocente(id: number, data: IDisciplinaDocenteInput): Promise<IDisciplinaDocenteActionResponse> {
    const response = await api.put(`/api/academic-staff/disciplinas-docente/${id}`, data);
    if (response.data.success) {
      toast.success(response.data.message || "Associação atualizada com sucesso!");
    }
    return response.data;
  }

  // Excluir associação disciplina-docente
  async deleteDisciplinaDocente(id: number): Promise<IDisciplinaDocenteActionResponse> {
    const response = await api.delete(`/api/academic-staff/disciplinas-docente/${id}`);
    if (response.data.success) {
      toast.success(response.data.message || "Associação removida com sucesso!");
    }
    return response.data;
  }

  // Obter estatísticas de disciplinas-docente
  async getEstatisticasDisciplinasDocente(): Promise<{
    success: boolean;
    message: string;
    data: {
      resumo: {
        totalAtribuicoes: number;
        professoresAtivos: number;
        cursosUnicos: number;
        disciplinasUnicas: number;
      };
      rankings: {
        topDocentes: Array<{ codigo: number; nome: string; totalAtribuicoes: number }>;
        topCursos: Array<{ codigo: number; nome: string; totalAtribuicoes: number }>;
      };
    };
  }> {
    const response = await api.get('/api/academic-staff/disciplinas-docente/estatisticas');
    return response.data;
  }
}

export const disciplineTeacherService = new DisciplineTeacherService();
