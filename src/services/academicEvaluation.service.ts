import {
  ITipoAvaliacaoInput,
  ITipoAvaliacaoResponse,
  ITipoAvaliacaoListResponse,
  ITipoNotaInput,
  ITipoNotaResponse,
  ITipoNotaListResponse,
  ITipoNotaValorResponse,
  ITipoNotaValorListResponse,
  ITipoPautaResponse,
  ITipoPautaListResponse,
  ITrimestreInput,
  ITrimestreResponse,
  ITrimestreListResponse,
  IAcademicEvaluationReportResponse,
  IEstatisticasNotas,
  IAcademicEvaluationActionResponse,
} from '@/types/academicEvaluation.types';
import api from '@/utils/api.utils';

class AcademicEvaluationService {
  // ===============================
  // TIPOS DE AVALIAÇÃO
  // ===============================

  // Listar tipos de avaliação
  async getTiposAvaliacao(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoAvaliacaoListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-avaliacao?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar tipo de avaliação por ID
  async getTipoAvaliacaoById(id: number): Promise<ITipoAvaliacaoResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-avaliacao/${id}`);
    return response.data;
  }

  // Buscar tipos de avaliação por tipo
  async getTiposAvaliacaoPorTipo(tipoAvaliacao: number): Promise<ITipoAvaliacaoListResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-avaliacao/tipo/${tipoAvaliacao}`);
    return response.data;
  }

  // Criar tipo de avaliação
  async createTipoAvaliacao(data: ITipoAvaliacaoInput): Promise<ITipoAvaliacaoResponse> {
    const response = await api.post('/api/academic-evaluation/tipos-avaliacao', data);
    return response.data;
  }

  // Atualizar tipo de avaliação
  async updateTipoAvaliacao(id: number, data: ITipoAvaliacaoInput): Promise<ITipoAvaliacaoResponse> {
    const response = await api.put(`/api/academic-evaluation/tipos-avaliacao/${id}`, data);
    return response.data;
  }

  // Excluir tipo de avaliação
  async deleteTipoAvaliacao(id: number): Promise<IAcademicEvaluationActionResponse> {
    const response = await api.delete(`/api/academic-evaluation/tipos-avaliacao/${id}`);
    return response.data;
  }

  // ===============================
  // TIPOS DE NOTA
  // ===============================

  // Listar tipos de nota
  async getTiposNota(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoNotaListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-nota?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar tipo de nota por ID
  async getTipoNotaById(id: number): Promise<ITipoNotaResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-nota/${id}`);
    return response.data;
  }

  // Buscar tipos de nota ativos
  async getTiposNotaAtivos(): Promise<ITipoNotaListResponse> {
    const response = await api.get('/api/academic-evaluation/tipos-nota/ativos');
    return response.data;
  }

  // Criar tipo de nota
  async createTipoNota(data: ITipoNotaInput): Promise<ITipoNotaResponse> {
    const response = await api.post('/api/academic-evaluation/tipos-nota', data);
    return response.data;
  }

  // Atualizar tipo de nota
  async updateTipoNota(id: number, data: ITipoNotaInput): Promise<ITipoNotaResponse> {
    const response = await api.put(`/api/academic-evaluation/tipos-nota/${id}`, data);
    return response.data;
  }

  // Excluir tipo de nota
  async deleteTipoNota(id: number): Promise<IAcademicEvaluationActionResponse> {
    const response = await api.delete(`/api/academic-evaluation/tipos-nota/${id}`);
    return response.data;
  }

  // ===============================
  // TIPOS DE NOTA VALOR
  // ===============================

  // Listar tipos de nota valor
  async getTiposNotaValor(
    page: number = 1,
    limit: number = 10,
    tipoNotaId?: number
  ): Promise<ITipoNotaValorListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-nota-valor?page=${page}&limit=${limit}`;
    
    if (tipoNotaId) {
      endpoint += `&tipoNotaId=${tipoNotaId}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar tipo de nota valor por ID
  async getTipoNotaValorById(id: number): Promise<ITipoNotaValorResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-nota-valor/${id}`);
    return response.data;
  }

  // Buscar valores por tipo de nota
  async getValoresPorTipoNota(tipoNotaId: number): Promise<ITipoNotaValorListResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-nota/${tipoNotaId}/valores`);
    return response.data;
  }

  // ===============================
  // TIPOS DE PAUTA
  // ===============================

  // Listar tipos de pauta
  async getTiposPauta(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITipoPautaListResponse> {
    let endpoint = `/api/academic-evaluation/tipos-pauta?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar tipo de pauta por ID
  async getTipoPautaById(id: number): Promise<ITipoPautaResponse> {
    const response = await api.get(`/api/academic-evaluation/tipos-pauta/${id}`);
    return response.data;
  }

  // ===============================
  // TRIMESTRES
  // ===============================

  // Listar trimestres
  async getTrimestres(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<ITrimestreListResponse> {
    let endpoint = `/api/academic-evaluation/trimestres?page=${page}&limit=${limit}`;
    
    if (search && search.trim()) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  }

  // Buscar trimestre por ID
  async getTrimestreById(id: number): Promise<ITrimestreResponse> {
    const response = await api.get(`/api/academic-evaluation/trimestres/${id}`);
    return response.data;
  }

  // Criar trimestre
  async createTrimestre(data: ITrimestreInput): Promise<ITrimestreResponse> {
    const response = await api.post('/api/academic-evaluation/trimestres', data);
    return response.data;
  }

  // Atualizar trimestre
  async updateTrimestre(id: number, data: ITrimestreInput): Promise<ITrimestreResponse> {
    const response = await api.put(`/api/academic-evaluation/trimestres/${id}`, data);
    return response.data;
  }

  // Excluir trimestre
  async deleteTrimestre(id: number): Promise<IAcademicEvaluationActionResponse> {
    const response = await api.delete(`/api/academic-evaluation/trimestres/${id}`);
    return response.data;
  }

  // ===============================
  // RELATÓRIOS E ESTATÍSTICAS
  // ===============================

  // Gerar relatório de avaliação
  async getRelatorioAvaliacao(): Promise<IAcademicEvaluationReportResponse> {
    try {
      const response = await api.get('/api/academic-evaluation/relatorio');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Gerar estatísticas de notas
  async getEstatisticasNotas(): Promise<{ success: boolean; message: string; data: IEstatisticasNotas }> {
    const response = await api.get('/api/academic-evaluation/estatisticas/notas');
    return response.data;
  }
}

const academicEvaluationService = new AcademicEvaluationService();
export default academicEvaluationService;
