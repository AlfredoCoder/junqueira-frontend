import api from "@/utils/api.utils";
import { toast } from "react-toastify";
import { Origin, OriginPayload, ApiResponse } from "@/types/origins.types";

export default class OriginsStudentService {
    // Criar proveniência
    static async createOrigin(data: OriginPayload): Promise<Origin> {
        try {
            const response = await api.post("/api/student-management/proveniencias", data);
            const apiResponse: ApiResponse<Origin> = response.data;

            if (apiResponse.success) {
                toast.success(apiResponse.message || "Proveniência criada com sucesso!");
                return apiResponse.data;
            }
            toast.error(apiResponse.message || "Erro ao criar proveniência");
            throw new Error(apiResponse.message || "Erro ao criar proveniência");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar proveniência";
            toast.error(errorMessage);
            console.error("Erro ao criar proveniência:", error);
            throw error;
        }
    }

    // Listar proveniências com paginação e busca
    static async getOrigins(params?: { page?: number; limit?: number; search?: string }): Promise<{
        data: Origin[];
        pagination?: any;
    }> {
        try {
            const response = await api.get("/api/student-management/proveniencias", { params });
            const apiResponse: ApiResponse<Origin[]> = response.data;

            if (apiResponse.success) {
                return { data: apiResponse.data, pagination: apiResponse.pagination };
            }
            throw new Error(apiResponse.message || "Erro ao buscar proveniências");
        } catch (error: any) {
            console.error("Erro ao buscar proveniências:", error);
            throw error;
        }
    }

    // Buscar proveniência por ID
    static async getOriginById(id: number): Promise<Origin> {
        try {
            const response = await api.get(`/api/student-management/proveniencias/${id}`);
            const apiResponse: ApiResponse<Origin> = response.data;

            if (apiResponse.success) return apiResponse.data;
            throw new Error(apiResponse.message || "Erro ao buscar proveniência");
        } catch (error: any) {
            console.error("Erro ao buscar proveniência:", error);
            throw error;
        }
    }

    // Atualizar proveniência
    static async updateOrigin(id: number, data: OriginPayload): Promise<Origin> {
        try {
            const response = await api.put(`/api/student-management/proveniencias/${id}`, data);
            const apiResponse: ApiResponse<Origin> = response.data;

            if (apiResponse.success) {
                toast.success(apiResponse.message || "Proveniência atualizada com sucesso!");
                return apiResponse.data;
            }
            toast.error(apiResponse.message || "Erro ao atualizar proveniência");
            throw new Error(apiResponse.message || "Erro ao atualizar proveniência");
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar proveniência";
            toast.error(errorMessage);
            console.error("Erro ao atualizar proveniência:", error);
            throw error;
        }
    }

    // Deletar proveniência
    static async deleteOrigin(id: number): Promise<void> {
        try {
            const response = await api.delete(`/api/student-management/proveniencias/${id}`);
            const apiResponse: ApiResponse<null> = response.data;

            if (apiResponse.success) {
                toast.success(apiResponse.message || "Proveniência deletada com sucesso!");
            } else {
                toast.error(apiResponse.message || "Erro ao deletar proveniência");
                throw new Error(apiResponse.message || "Erro ao deletar proveniência");
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "Erro ao deletar proveniência";
            toast.error(errorMessage);
            console.error("Erro ao deletar proveniência:", error);
            throw error;
        }
    }
}
