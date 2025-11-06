import api from "@/utils/api.utils"
import {
  IMatricula,
  IMatriculaInput,
  IMatriculaListResponse,
  IMatriculaDetailed,
  IMatriculasByAnoLectivo,
  IMatriculasWithoutConfirmation,
  IBatchResponse,
  IMatriculaStatistics
} from "@/types/matricula.types"


export default class MatriculaService {
  
  static async createMatricula(payload: IMatriculaInput): Promise<IMatricula> {
    const response = await api.post("/api/student-management/matriculas", payload)
    const apiResponse = response.data
    return apiResponse.data
  }

  static async getMatriculas(page = 1, limit = 10, search = "", statusFilter?: string | null, cursoFilter?: string | null): Promise<IMatriculaListResponse> {
    const params: Record<string, string | number> = { page, limit, search };
    
    // Adicionar filtros apenas se forem fornecidos e não forem "all"
    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (cursoFilter && cursoFilter !== "all") {
      params.curso = cursoFilter;
    }
    
    const response = await api.get("/api/student-management/matriculas", { params })
    const apiResponse = response.data
    return { data: apiResponse.data, pagination: apiResponse.pagination }
  }

  static async getMatriculaById(id: number): Promise<IMatriculaDetailed> {
    const response = await api.get(`/api/student-management/matriculas/${id}`)
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async updateMatricula(id: number, payload: Partial<IMatriculaInput>): Promise<IMatricula> {
    const response = await api.put(`/api/student-management/matriculas/${id}`, payload)
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async deleteMatricula(id: number): Promise<void> {
    await api.delete(`/api/student-management/matriculas/${id}`)
  }

  static async batchMatricula(payload: IMatriculaInput[]): Promise<IBatchResponse<IMatricula>> {
    const response = await api.post("/api/student-management/matriculas/batch", { matriculas: payload })
    const apiResponse = response.data
    return apiResponse.data
  }

  static async getMatriculasByAnoLectivo(params: IMatriculasByAnoLectivo): Promise<IMatricula[]> {
    const response = await api.get(`/api/student-management/matriculas/ano-lectivo/${params.codigo_AnoLectivo}`)
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async getMatriculasWithoutConfirmacao(): Promise<IMatriculasWithoutConfirmation[]> {
    const response = await api.get("/api/student-management/matriculas/sem-confirmacao")
    const apiResponse = response.data;
    return apiResponse.data;
  }

  static async getMatriculasStatistics(statusFilter?: string | null, cursoFilter?: string | null): Promise<IMatriculaStatistics> {
    const params: Record<string, string> = {};
    
    // Adicionar filtros apenas se forem fornecidos e não forem "all"
    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter;
    }
    if (cursoFilter && cursoFilter !== "all") {
      params.curso = cursoFilter;
    }
    
    const response = await api.get("/api/student-management/statistics/matriculas", { params })
    const apiResponse = response.data;
    return apiResponse.data;
  }

}