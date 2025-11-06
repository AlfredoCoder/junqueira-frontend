import api from "@/utils/api.utils"
import { IEnrollment, IEnrollmentInput, IEnrollmentListResponse } from "@/types/enrollment.types"

export default class EnrollmentService {
  static async createEnrollment(payload: IEnrollmentInput): Promise<IEnrollment> {
    const response = await api.post("/api/student-management/matriculas", payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar matrícula")
  }

  static async getEnrollments(page = 1, limit = 10, search = ""): Promise<IEnrollmentListResponse> {
    const response = await api.get("/api/student-management/matriculas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data
    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrículas")
  }

  static async getEnrollmentById(id: number): Promise<IEnrollment> {
    const response = await api.get(`/api/student-management/matriculas/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar matrícula")
  }

  static async updateEnrollment(id: number, payload: IEnrollmentInput): Promise<IEnrollment> {
    const response = await api.put(`/api/student-management/matriculas/${id}`, payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar matrícula")
  }

  static async deleteEnrollment(id: number): Promise<void> {
    const response = await api.delete(`/api/student-management/matriculas/${id}`)
    const apiResponse = response.data
    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar matrícula")
    }
  }

  static async batchEnrollment(payload: IEnrollmentInput[]): Promise<IEnrollment[]> {
    const response = await api.post("/api/student-management/matriculas/batch", { matriculas: payload })
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar matrículas em lote")
  }
}
