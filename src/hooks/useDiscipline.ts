import { useState, useEffect, useCallback } from "react"
import DisciplineService from "@/services/discipline.service"
import { toast } from "react-toastify"
import { getErrorMessage } from "@/utils/getErrorMessage.utils"
import { IDiscipline, IDisciplineInput, IDisciplineListResponse, IDisciplineStatistics } from "@/types/discipline.types"

// Listar disciplinas
export function useDisciplines(page = 1, limit = 10, search = "") {
    const [disciplines, setDisciplines] = useState<IDiscipline[]>([])
    const [pagination, setPagination] = useState<IDisciplineListResponse["pagination"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDisciplines = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await DisciplineService.getDisciplines(page, limit, search)
            if (!result) {
                // service returned undefined — set sensible defaults
                setDisciplines([])
                setPagination(null)
                return
            }
            const { data, pagination } = result
            setDisciplines(data)
            setPagination(pagination)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao carregar disciplinas");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => {
        fetchDisciplines()
    }, [fetchDisciplines])

    return { disciplines, pagination, loading, error, refetch: fetchDisciplines }
}

// Buscar disciplina por ID
export function useDiscipline(id?: number) {
    const [discipline, setDiscipline] = useState<IDiscipline | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDiscipline = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await DisciplineService.getDisciplineById(id)
            setDiscipline(data)
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Erro ao carregar disciplina"))
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchDiscipline()
    }, [fetchDiscipline])

    return { discipline, loading, error, refetch: fetchDiscipline }
}

// Criar disciplina
export function useCreateDiscipline() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createDiscipline = useCallback(async (payload: IDisciplineInput) => {
        try {
            setLoading(true)
            setError(null)
            return await DisciplineService.createDiscipline(payload)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao criar disciplina");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [])

    return { createDiscipline, loading, error }
}

// Atualizar disciplina
export function useUpdateDiscipline(id: number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateDiscipline = useCallback(async (payload: IDisciplineInput) => {
        try {
            setLoading(true)
            setError(null)
            return await DisciplineService.updateDiscipline(id, payload)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao atualizar disciplina");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [id])

    return { updateDiscipline, loading, error }
}

// Deletar disciplina
export function useDeleteDiscipline() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteDiscipline = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            const response = await DisciplineService.deleteDiscipline(id)
            return response
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao deletar disciplina");
            setError(errorMessage);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteDiscipline, loading, error }
}

// Estatísticas de disciplinas
export function useDisciplineStatistics() {
    const [statistics, setStatistics] = useState<IDisciplineStatistics | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await DisciplineService.getDisciplineStatistics()
            if (data) {
                setStatistics(data)
            }
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao carregar estatísticas")
            setError(errorMessage)
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStatistics()
    }, [fetchStatistics])

    return { statistics, loading, error, refetch: fetchStatistics }
}
