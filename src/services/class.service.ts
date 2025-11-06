import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { IClass, IClassInput, IClassListResponse } from "@/types/class.types"

class ClassService {
  async createClass(payload: IClassInput): Promise<IClass> {
    try {
      const response = await api.post("/api/academic-management/classes", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Classe criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar classe")
      throw new Error(apiResponse.message || "Erro ao criar classe")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar classe"
      toast.error(errorMessage)
      console.error("Erro ao criar classe:", error)
      throw error
    }
  }

  async getClasses(page = 1, limit = 10, search = ""): Promise<IClassListResponse> {
    try {
      const response = await api.get("/api/academic-management/classes", {
        params: { page, limit, search }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return { data: apiResponse.data, pagination: apiResponse.pagination }
      }
      throw new Error(apiResponse.message || "Erro ao buscar classes")
    } catch (error: any) {
      console.error("Erro ao buscar classes:", error)
      throw error
    }
  }

  async getClassById(id: number): Promise<IClass> {
    try {
      const response = await api.get(`/api/academic-management/classes/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao buscar classe")
    } catch (error: any) {
      console.error("Erro ao buscar classe:", error)
      throw error
    }
  }

  async updateClass(id: number, payload: IClassInput): Promise<IClass> {
    try {
      const response = await api.put(`/api/academic-management/classes/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Classe atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar classe")
      throw new Error(apiResponse.message || "Erro ao atualizar classe")
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar classe"
      toast.error(errorMessage)
      console.error("Erro ao atualizar classe:", error)
      throw error
    }
  }

  async deleteClass(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/classes/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Classe deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar classe")
        throw new Error(apiResponse.message || "Erro ao deletar classe")
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar classe"
      toast.error(errorMessage)
      console.error("Erro ao deletar classe:", error)
      throw error
    }
  }
}

const classService = new ClassService();
export default classService;