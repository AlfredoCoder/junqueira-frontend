import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { ISala, ISalaInput, ISalaListResponse } from "@/types/sala.types"

class SalaService {
  async getSalas(page = 1, limit = 10, search = ""): Promise<ISalaListResponse> {
    try {
      const response = await api.get("/api/academic-management/salas", {
        params: { page, limit, search }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar salas")
    } catch (error: any) {
      console.error("Erro ao buscar salas:", error)
      throw error
    }
  }

  async getSalaById(id: number): Promise<ISala> {
    try {
      const response = await api.get(`/api/academic-management/salas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar sala")
    } catch (error: any) {
      console.error("Erro ao buscar sala:", error)
      throw error
    }
  }

  async createSala(payload: ISalaInput): Promise<ISala> {
    try {
      const response = await api.post("/api/academic-management/salas", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Sala criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar sala")
      throw new Error(apiResponse.message || "Erro ao criar sala")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar sala"
      toast.error(errorMessage)
      console.error("Erro ao criar sala:", error)
      throw error
    }
  }

  async updateSala(id: number, payload: ISalaInput): Promise<ISala> {
    try {
      const response = await api.put(`/api/academic-management/salas/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Sala atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar sala")
      throw new Error(apiResponse.message || "Erro ao atualizar sala")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar sala"
      toast.error(errorMessage)
      console.error("Erro ao atualizar sala:", error)
      throw error
    }
  }

  async deleteSala(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/salas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Sala deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar sala")
        throw new Error(apiResponse.message || "Erro ao deletar sala")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar sala"
      toast.error(errorMessage)
      console.error("Erro ao deletar sala:", error)
      throw error
    }
  }
}

const salaService = new SalaService();
export default salaService;
