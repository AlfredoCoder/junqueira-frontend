import { toast } from "react-toastify"
import { 
  IDocente, 
  IDocenteInput, 
  IDocenteResponse, 
  IDocenteListResponse,
  IEspecialidadeResponse,
  IDisciplinaDocenteResponse
} from '@/types/teacher.types'
import api from '@/utils/api.utils';

class TeacherService {
  // ===============================
  // DOCENTES - CRUD
  // ===============================

  async getAllDocentes(search?: string): Promise<IDocenteListResponse> {
    let endpoint = `/api/professores?page=1&limit=1000`
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`
    }
    const response = await api.get(endpoint);
    return response.data;
  }

  async getDocentes(page: number = 1, limit: number = 10, search?: string): Promise<IDocenteListResponse> {
    let endpoint = `/api/professores?page=${page}&limit=${limit}`
    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`
    }
    const response = await api.get(endpoint);
    return response.data;
  }

  async getDocenteById(id: number): Promise<IDocenteResponse> {
    const response = await api.get(`/api/professores/${id}`);
    return response.data;
  }

  async createDocente(data: IDocenteInput): Promise<IDocenteResponse> {
    try {
      const response = await api.post('/api/professores', data);
      toast.success(response.data.message || "Docente criado com sucesso!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar docente";
      toast.error(errorMessage);
      throw error;
    }
  }

  async updateDocente(id: number, data: IDocenteInput): Promise<IDocenteResponse> {
    try {
      const response = await api.put(`/api/professores/${id}`, data);
      toast.success(response.data.message || "Docente atualizado com sucesso!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar docente";
      toast.error(errorMessage);
      throw error;
    }
  }

  async deleteDocente(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/professores/${id}`);
      toast.success(response.data.message || "Docente excluído com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao excluir docente";
      toast.error(errorMessage);
      throw error;
    }
  }

  // ===============================
  // ATRIBUIÇÕES DE PROFESSORES
  // ===============================

  async getAtribuicoesProfessor(professorId: number): Promise<any> {
    try {
      const response = await api.get(`/api/atribuicoes-professor/${professorId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar atribuições do professor:', error);
      return {
        success: false,
        data: {
          disciplinas: [],
          turmas: [],
          totalDisciplinas: 0,
          totalTurmas: 0
        }
      };
    }
  }

  async criarAtribuicaoCompleta(data: {
    professorId: number;
    disciplinaId: number;
    cursoId: number;
    turmaId?: number;
    anoLectivo: string;
  }): Promise<any> {
    try {
      const response = await api.post('/api/atribuicao-completa', data);
      toast.success(response.data.message || "Atribuição criada com sucesso!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar atribuição";
      toast.error(errorMessage);
      throw error;
    }
  }

  // ===============================
  // ESPECIALIDADES
  // ===============================

  async getEspecialidades(): Promise<IEspecialidadeResponse> {
    const response = await api.get('/api/academic-staff/especialidades');
    return response.data;
  }

  // ===============================
  // DISCIPLINAS DO DOCENTE
  // ===============================

  async getDisciplinasDocente(): Promise<IDisciplinaDocenteResponse> {
    const response = await api.get('/api/academic-staff/disciplinas-docente');
    return response.data;
  }

  async createDisciplinaDocente(data: { codigoDocente: number; codigoCurso: number; codigoDisciplina: number }): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('/api/academic-staff/disciplinas-docente', data);
      toast.success(response.data.message || "Disciplina associada ao docente com sucesso!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao associar disciplina ao docente";
      toast.error(errorMessage);
      throw error;
    }
  }

  async deleteDisciplinaDocente(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/api/academic-staff/disciplinas-docente/${id}`);
      toast.success(response.data.message || "Associação removida com sucesso!");
      return response.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao remover associação";
      toast.error(errorMessage);
      throw error;
    }
  }

  // ===============================
  // RELATÓRIOS E CONSULTAS AVANÇADAS
  // ===============================

  async getTurmasPorDocente(docenteId: number): Promise<Record<string, unknown>[]> {
    const response = await api.get(`/api/academic-staff/docentes/${docenteId}/turmas`);
    return response.data.data || [];
  }

  async getDocentesPorTurma(turmaId: number): Promise<IDocenteListResponse> {
    const response = await api.get(`/api/academic-staff/turmas/${turmaId}/docentes`);
    return response.data;
  }

  async getRelatorioAcademico(): Promise<Record<string, any>> {
    const response = await api.get('/api/academic-staff/relatorio-academico');
    return response.data;
  }
}

export const teacherService = new TeacherService()
export default teacherService
