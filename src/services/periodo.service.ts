import api from "@/utils/api.utils"
import { IPeriodo, IPeriodoInput, IPeriodoListResponse } from "@/types/periodo.types"

class PeriodoService {
  async getPeriodos(page = 1, limit = 10, search = ""): Promise<IPeriodoListResponse> {
    const response = await api.get("/api/academic-management/periodos", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar períodos")
  }

  async getPeriodoById(id: number): Promise<IPeriodo> {
    const response = await api.get(`/api/academic-management/periodos/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar período")
  }

  async createPeriodo(payload: IPeriodoInput): Promise<IPeriodo> {
    const response = await api.post("/api/academic-management/periodos", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar período")
  }

  async updatePeriodo(id: number, payload: IPeriodoInput): Promise<IPeriodo> {
    const response = await api.put(`/api/academic-management/periodos/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar período")
  }

  async deletePeriodo(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/periodos/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar período")
    }
  }
}

const periodoService = new PeriodoService();
export default periodoService;
