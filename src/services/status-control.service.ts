import api from "@/utils/api.utils"
import {
  ITipoStatus,
  ITipoStatusInput,
  ITipoStatusListResponse,
  IStatus,
  IStatusInput,
  IStatusListResponse,
  IAssociarStatusInput,
  ITipoStatusComContagem
} from "@/types/status-control.types"

export default class StatusControlService {
  // ===============================
  // TIPO STATUS - CRUD COMPLETO
  // ===============================

  static async createTipoStatus(payload: ITipoStatusInput): Promise<ITipoStatus> {
    const response = await api.post("/api/status-control/tipos-status", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar tipo de status")
  }

  static async getTiposStatus(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<ITipoStatusListResponse> {
    const response = await api.get("/api/status-control/tipos-status", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar tipos de status")
  }

  static async getTipoStatusById(id: number): Promise<ITipoStatus> {
    const response = await api.get(`/api/status-control/tipos-status/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar tipo de status")
  }

  static async updateTipoStatus(
    id: number,
    payload: ITipoStatusInput
  ): Promise<ITipoStatus> {
    const response = await api.put(`/api/status-control/tipos-status/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar tipo de status")
  }

  static async deleteTipoStatus(id: number): Promise<void> {
    const response = await api.delete(`/api/status-control/tipos-status/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar tipo de status")
    }
  }

  // ===============================
  // STATUS - CRUD COMPLETO
  // ===============================

  static async createStatus(payload: IStatusInput): Promise<IStatus> {
    const response = await api.post("/api/status-control/status", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao criar status")
  }

  static async getStatus(
    page = 1,
    limit = 10,
    search = ""
  ): Promise<IStatusListResponse> {
    const response = await api.get("/api/status-control/status", {
      params: { page, limit, search }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return { data: apiResponse.data, pagination: apiResponse.pagination }
    }
    throw new Error(apiResponse.message || "Erro ao buscar status")
  }

  static async getStatusById(id: number): Promise<IStatus> {
    const response = await api.get(`/api/status-control/status/${id}`)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar status")
  }

  static async updateStatus(id: number, payload: IStatusInput): Promise<IStatus> {
    const response = await api.put(`/api/status-control/status/${id}`, payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao atualizar status")
  }

  static async deleteStatus(id: number): Promise<void> {
    const response = await api.delete(`/api/status-control/status/${id}`)
    const apiResponse = response.data

    if (!apiResponse.success) {
      throw new Error(apiResponse.message || "Erro ao deletar status")
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getStatusByTipo(tipoStatusId: number): Promise<IStatus[]> {
    const response = await api.get(
      `/api/status-control/tipos-status/${tipoStatusId}/status`
    )
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar status por tipo")
  }

  static async getStatusSemTipo(): Promise<IStatus[]> {
    const response = await api.get("/api/status-control/status/sem-tipo")
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar status sem tipo")
  }

  static async getTiposStatusComContagem(): Promise<ITipoStatusComContagem[]> {
    const response = await api.get("/api/status-control/tipos-status/com-contagem")
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(
      apiResponse.message || "Erro ao buscar tipos de status com contagem"
    )
  }

  static async buscarStatusPorDesignacao(designacao: string): Promise<IStatus[]> {
    const response = await api.get("/api/status-control/status/buscar", {
      params: { designacao }
    })
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao buscar status por designação")
  }

  static async associarStatusAoTipo(
    payload: IAssociarStatusInput
  ): Promise<IStatus> {
    const response = await api.post("/api/status-control/status/associar", payload)
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao associar status ao tipo")
  }

  static async desassociarStatusDoTipo(statusId: number): Promise<IStatus> {
    const response = await api.post(
      `/api/status-control/status/${statusId}/desassociar`
    )
    const apiResponse = response.data

    if (apiResponse.success) {
      return apiResponse.data
    }
    throw new Error(apiResponse.message || "Erro ao desassociar status do tipo")
  }
}
