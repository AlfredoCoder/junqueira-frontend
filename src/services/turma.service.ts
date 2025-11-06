import api from "@/utils/api.utils"
import { toast } from "react-toastify"
import { ITurma, ITurmaInput, ITurmaListResponse } from "@/types/turma.types"

class TurmaService {
  async createTurma(payload: ITurmaInput): Promise<ITurma> {
    try {
      const response = await api.post("/api/academic-management/turmas", payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma criada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao criar turma")
      throw new Error(apiResponse.message || "Erro ao criar turma")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      let errorMessage = err?.response?.data?.message || err?.message || "Erro ao criar turma"
      
      // Verificar se é erro específico de sala já usada
      if (errorMessage.toLowerCase().includes('sala') && 
          (errorMessage.toLowerCase().includes('já') || 
           errorMessage.toLowerCase().includes('atribuída') ||
           errorMessage.toLowerCase().includes('ocupada') ||
           errorMessage.toLowerCase().includes('conflito'))) {
        errorMessage = "Sala já atribuída para outro horário. Por favor, escolha uma sala diferente ou verifique os horários disponíveis."
      }
      
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async getAllTurmas(search = ""): Promise<ITurmaListResponse> {
    const response = await api.get("/api/academic-management/turmas", {
      params: { page: 1, limit: 1000, search } // Buscar até 1000 registros
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar todas as turmas")
  }

  async getTurmas(page = 1, limit = 10, search = ""): Promise<ITurmaListResponse> {
    const response = await api.get("/api/academic-management/turmas", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar turmas")
  }

  async getTurmaById(id: number): Promise<ITurma> {
    const response = await api.get(`/api/academic-management/turmas/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar turma")
  }

  async updateTurma(id: number, payload: ITurmaInput): Promise<ITurma> {
    try {
      const response = await api.put(`/api/academic-management/turmas/${id}`, payload)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma atualizada com sucesso!")
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar turma")
      throw new Error(apiResponse.message || "Erro ao atualizar turma")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = err?.response?.data?.message || err?.message || "Erro ao atualizar turma"
      toast.error(errorMessage)
      throw error
    }
  }

  async deleteTurma(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/academic-management/turmas/${id}`)
      const apiResponse = response.data

      if (apiResponse.success) {
        toast.success(apiResponse.message || "Turma deletada com sucesso!")
      } else {
        toast.error(apiResponse.message || "Erro ao deletar turma")
        throw new Error(apiResponse.message || "Erro ao deletar turma")
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = err?.response?.data?.message || err?.message || "Erro ao deletar turma"
      toast.error(errorMessage)
      throw error
    }
  }

  // Validar disponibilidade de sala
  async validateSalaDisponibilidade(codigoSala: number, codigoPeriodo: number, codigoAnoLectivo: number): Promise<{
    disponivel: boolean;
    conflitos?: Array<{
      turma: string;
      periodo: string;
      anoLectivo: string;
    }>;
    message?: string;
  }> {
    try {
      const response = await api.get(`/api/academic-management/salas/${codigoSala}/disponibilidade`, {
        params: { codigoPeriodo, codigoAnoLectivo }
      })
      const apiResponse = response.data

      if (apiResponse.success) {
        return apiResponse.data
      }
      throw new Error(apiResponse.message || "Erro ao validar disponibilidade da sala")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = err?.response?.data?.message || err?.message || "Erro ao validar sala"
      throw new Error(errorMessage)
    }
  }

  // Atualizar status da turma (Ativo/Inativo/Arquivado)
  async updateTurmaStatus(id: number, status: 'Ativo' | 'Inativo' | 'Arquivado'): Promise<ITurma> {
    try {
      const response = await api.patch(`/api/academic-management/turmas/${id}/status`, { status })
      const apiResponse = response.data

      if (apiResponse.success) {
        const statusMessage = status === 'Arquivado' ? 'arquivada' : 
                            status === 'Inativo' ? 'desativada' : 'ativada'
        toast.success(apiResponse.message || `Turma ${statusMessage} com sucesso!`)
        return apiResponse.data
      }
      toast.error(apiResponse.message || "Erro ao atualizar status da turma")
      throw new Error(apiResponse.message || "Erro ao atualizar status da turma")
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string }
      const errorMessage = err?.response?.data?.message || err?.message || "Erro ao atualizar status da turma"
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}

const turmaService = new TurmaService();
export default turmaService;
