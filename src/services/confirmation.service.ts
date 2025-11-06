import api from "@/utils/api.utils"
import {
  IConfirmation,
  IConfirmationInput,
  IConfirmationListResponse,
  IConfirmationsByClassAndYear,
  IConfirmationStatistics
} from "@/types/confirmation.types"

export default class ConfirmationService {

  static async createConfirmation(payload: IConfirmationInput): Promise<IConfirmation> {
    const response = await api.post("/api/student-management/confirmacoes", payload)
    const apiResponse = response.data
    return apiResponse.data
  }

  static async getConfirmations(
    page = 1, 
    limit = 10,
    search = "", 
    status?: string | null, 
    anoLectivo?: string | null
  ): Promise<IConfirmationListResponse> {
    const params: Record<string, string | number> = { page, limit };
    
    if (search) params.search = search;
    if (status && status !== 'all') params.status = status;
    if (anoLectivo && anoLectivo !== 'all') params.anoLectivo = anoLectivo;
    
    const response = await api.get("/api/student-management/confirmacoes", { params })
    const apiResponse = response.data
    return { data: apiResponse.data, pagination: apiResponse.pagination }
  }

  static async getConfirmationById(id: number): Promise<IConfirmation> {
    const response = await api.get(`/api/student-management/confirmacoes/${id}`)
    const apiResponse = response.data
    return apiResponse.data
  }

  static async updateConfirmation(id: number, payload: Partial<IConfirmationInput>): Promise<IConfirmation> {
    const response = await api.put(`/api/student-management/confirmacoes/${id}`, payload)
    const apiResponse = response.data
    return apiResponse.data
  }

  static async deleteConfirmation(id: number): Promise<void> {
    await api.delete(`/api/student-management/confirmacoes/${id}`);
  }

  static async batchConfirmation(payload: IConfirmationInput[]): Promise<IConfirmation[]> {
    const response = await api.post("/api/student-management/confirmacoes/batch", { confirmacoes: payload })
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async getConfirmationsByClassAndYear(params: IConfirmationsByClassAndYear): Promise<IConfirmation[]> {
    const response = await api.get(`/api/student-management/confirmacoes/turma/${params.codigo_Turma}/ano/${params.codigo_AnoLectivo}`)
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async getConfirmationsStatistics(status?: string | null, anoLectivo?: string | null): Promise<IConfirmationStatistics> {
    const params: Record<string, string> = {};
    
    if (status && status !== 'all') params.status = status;
    if (anoLectivo && anoLectivo !== 'all') params.anoLectivo = anoLectivo;
    
    const response = await api.get("/api/student-management/statistics/confirmacoes", { params });
    const apiResponse = response.data;
    
    if (apiResponse.success) {
      return apiResponse.data;
    }
    throw new Error(apiResponse.message || "Erro ao buscar estatísticas de confirmações");
  }
}