import { IInstitution, IInstitutionInput, IInstitutionResponse, IInstitutionListResponse } from '@/types/institution.types'
import api from '@/utils/api.utils';

class InstitutionService {
  // Buscar todos os dados institucionais
  async getInstitution(): Promise<IInstitutionListResponse> {
    const response = await api.get('/api/institutional/dados-instituicao');
    return response.data;
  }

  // Buscar dados principais da instituição (primeiro registro)
  async getInstitutionPrincipal(): Promise<IInstitutionResponse> {
    const response = await api.get('/api/institutional/dados-instituicao');
    const data = response.data;
    // Retorna o primeiro registro como dados principais
    if (data.data && data.data.length > 0) {
      return {
        success: data.success,
        message: data.message,
        data: data.data[0]
      }
    }
    throw new Error('Nenhum dado institucional encontrado')
  }

  // Buscar dados institucionais por ID
  async getInstitutionById(id: number): Promise<IInstitutionResponse> {
    const response = await api.get(`/api/institutional/dados-instituicao/${id}`);
    return response.data;
  }

  // Criar dados institucionais
  async createInstitution(data: IInstitutionInput): Promise<IInstitutionResponse> {
    const response = await api.post('/api/institutional-management/dados-instituicao', data);
    return response.data;
  }

  // Atualizar dados institucionais
  async updateInstitution(id: number, data: IInstitutionInput): Promise<IInstitutionResponse> {
    const response = await api.put(`/api/institutional-management/dados-instituicao/${id}`, data);
    return response.data;
  }

  // Upload de logo
  async uploadLogo(file: File): Promise<{ success: boolean; url: string }> {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await api.post('/api/settings-management/instituicao/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }
}

const institutionService = new InstitutionService();
export default institutionService;
