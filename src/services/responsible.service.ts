import api from "@/utils/api.utils";
import {
    IResponsible,
    IResponsibleCreate,
    IResponsibleUpdate,
    IResponsibleResponse,
    IResponsibleListResponse,
} from "@/types/responsible.types";

export default class ResponsibleService {
    // Criar responsável
    static async createResponsible(data: IResponsibleCreate): Promise<IResponsible> {
        const response = await api.post<IResponsibleResponse>("/api/student-management/encarregados", data);
        if (response.data.success) return response.data.data;
        throw new Error(response.data.message || "Erro ao criar responsável");
    }

    // Listar responsáveis
    static async getResponsibles(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<IResponsibleListResponse> {
        const response = await api.get<IResponsibleListResponse>("/api/student-management/encarregados", { params });
        if (response.data.success) return response.data;
        throw new Error(response.data.message || "Erro ao buscar responsáveis");
    }

    // Obter por ID
    static async getResponsibleById(id: number): Promise<IResponsible> {
        const response = await api.get<IResponsibleResponse>(`/api/student-management/encarregados/${id}`);
        if (response.data.success) return response.data.data;
        throw new Error(response.data.message || "Erro ao buscar responsável");
    }

    // Atualizar
    static async updateResponsible(id: number, data: IResponsibleUpdate): Promise<IResponsible> {
        const response = await api.put<IResponsibleResponse>(`/api/student-management/encarregados/${id}`, data);
        if (response.data.success) return response.data.data;
        throw new Error(response.data.message || "Erro ao atualizar responsável");
    }

    // Deletar
    static async deleteResponsible(id: number): Promise<void> {
        const response = await api.delete(`/api/student-management/encarregados/${id}`);
        if (!response.data.success) throw new Error(response.data.message || "Erro ao deletar responsável");
    }
}
