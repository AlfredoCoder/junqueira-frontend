import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { ICourseInput, ICourseListResponse } from "@/types/course.types"

export default class CourseService {

  static async createCourse(payload: ICourseInput) {
    const response = await api.post("/api/academic-management/cursos", payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Curso criado com sucesso!")
      return apiResponse.data
    }
  }

  static async getAllCourses(search = "", includeArchived = false): Promise<ICourseListResponse> {
    // Buscar todos os cursos sem paginação
    return this.getCourses(1, 1000, search, includeArchived);
  }

  static async getCourses(page = 1, limit = 10, search = "", includeArchived = false): Promise<ICourseListResponse> {
    const response = await api.get("/api/academic-management/cursos", {
      params: { page, limit, search, includeArchived }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }

    // Retorna um resultado vazio como fallback para garantir o tipo esperado
    return { data: apiResponse?.data || [], pagination: apiResponse?.pagination || { total: 0, page, limit } }
  }

  static async getCourseById(id: number) {
    const response = await api.get(`/api/academic-management/cursos/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
  }

  static async updateCourse(id: number, payload: ICourseInput) {
    const response = await api.put(`/api/academic-management/cursos/${id}`, payload)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Curso atualizado com sucesso!")
      return apiResponse.data
    }
  }

  static async archiveCourse(id: number): Promise<void> {
    const response = await api.patch(`/api/academic-management/cursos/${id}/archive`)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Curso arquivado com sucesso!")
    }
  }

  static async unarchiveCourse(id: number): Promise<void> {
    const response = await api.patch(`/api/academic-management/cursos/${id}/unarchive`)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Curso restaurado com sucesso!")
    }
  }

  // Buscar estatísticas de cursos (total, ativos, inativos)
  static async getCourseStats(): Promise<{ total: number; active: number; inactive: number } | undefined> {
    const response = await api.get('/api/academic-management/cursos/stats')
    const apiResponse = response.data
    if (apiResponse.success) {
      return apiResponse.data
    }
    return undefined
  }

  // Manter método de exclusão para casos específicos (apenas para admin)
  static async deleteCourse(id: number): Promise<void> {
    const response = await api.delete(`/api/academic-management/cursos/${id}`)
    const apiResponse = response.data
    if (apiResponse.success) {
      toast.success(apiResponse.message || "Curso deletado permanentemente!")
    }
  }
}
