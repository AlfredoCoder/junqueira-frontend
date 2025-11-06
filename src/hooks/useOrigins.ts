import { useState, useCallback } from "react";
import OriginsStudentService from "@/services/origins-studant.service";
import { Origin, OriginPayload, Pagination } from "@/types/origins.types";

export function useOriginsService() {
    const [origins, setOrigins] = useState<Origin[]>([]);
    const [origin, setOrigin] = useState<Origin | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar todas
    const fetchOrigins = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const { data, pagination } = await OriginsStudentService.getOrigins(params);
            setOrigins(data);
            if (pagination) setPagination(pagination);
        } catch (err: any) {
            setError(err.message || "Erro ao buscar proveniências");
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar por ID
    const fetchOriginById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await OriginsStudentService.getOriginById(id);
            setOrigin(data);
        } catch (err: any) {
            setError(err.message || "Erro ao buscar proveniência");
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar
    const createOrigin = useCallback(async (originData: OriginPayload) => {
        try {
            const newOrigin = await OriginsStudentService.createOrigin(originData);
            setOrigins((prev) => [...prev, newOrigin]);
            return newOrigin;
        } catch (err: any) {
            throw new Error(err.message || "Erro ao criar proveniência");
        }
    }, []);

    // Atualizar
    const updateOrigin = useCallback(async (id: number, originData: OriginPayload) => {
        try {
            const updated = await OriginsStudentService.updateOrigin(id, originData);
            setOrigins((prev) => prev.map((o) => (o.codigo === id ? updated : o)));
            return updated;
        } catch (err: any) {
            throw new Error(err.message || "Erro ao atualizar proveniência");
        }
    }, []);

    // Deletar
    const deleteOrigin = useCallback(async (id: number) => {
        try {
            await OriginsStudentService.deleteOrigin(id);
            setOrigins((prev) => prev.filter((o) => o.codigo !== id));
        } catch (err: any) {
            throw new Error(err.message || "Erro ao deletar proveniência");
        }
    }, []);

    return {
        origins,
        origin,
        pagination,
        loading,
        error,
        fetchOrigins,
        fetchOriginById,
        createOrigin,
        updateOrigin,
        deleteOrigin,
    };
}
