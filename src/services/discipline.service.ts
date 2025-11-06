import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { IDisciplineInput, IDisciplineStatistics } from "@/types/discipline.types"

class DisciplineService {
  async createDiscipline(payload: IDisciplineInput) {
    const response = await api.post("/api/academic-management/disciplinas", payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Disciplina criada com sucesso!")
      return apiResponse.data
    }
  }

  async getDisciplines(page = 1, limit = 10, search = "") {
    const response = await api.get("/api/academic-management/disciplinas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data
    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
  }

  async getDisciplineById(id: number) {
    const response = await api.get(`/api/academic-management/disciplinas/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
  }

  async updateDiscipline(id: number, payload: IDisciplineInput) {
    const response = await api.put(`/api/academic-management/disciplinas/${id}`, payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Disciplina atualizada com sucesso!")
      return apiResponse.data
    }
  }

  async deleteDiscipline(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/disciplinas/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Disciplina deletada com sucesso!")
    } else {
      toast.error(apiResponse.message || "Erro ao deletar disciplina")
      throw new Error(apiResponse.message || "Erro ao deletar disciplina")
    }
  }

  async getDisciplineStatistics(): Promise<IDisciplineStatistics | undefined> {
    const response = await api.get("/api/academic-management/disciplinas/stats")
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
  }
}

const disciplineService = new DisciplineService();
export default disciplineService;
