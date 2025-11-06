import { useState, useEffect, useCallback } from "react"
import TransferService from "@/services/transfer.service"
import { ITransfer, ITransferInput, ITransferListResponse } from "@/types/transfer.types"

// Listar transferências com paginação e busca
export function useTransfers(page = 1, limit = 10, search = "") {
    const [transfers, setTransfers] = useState<ITransfer[]>([])
    const [pagination, setPagination] = useState<ITransferListResponse["pagination"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTransfers = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data, pagination } = await TransferService.getTransfers(page, limit, search)
            console.log(data)
            setTransfers(data)
            setPagination(pagination)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar transferências")
        } finally {
            setLoading(false)
        }
    }, [page, limit, search])

    useEffect(() => {
        fetchTransfers()
    }, [fetchTransfers])

    return { transfers, pagination, loading, error, refetch: fetchTransfers }
}

// Buscar transferência por ID
export function useTransfer(id?: number) {
    const [transfer, setTransfer] = useState<ITransfer | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchTransfer = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await TransferService.getTransferById(id)
            setTransfer(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar transferência")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchTransfer()
    }, [fetchTransfer])

    return { transfer, loading, error, refetch: fetchTransfer }
}

// Criar transferência
export function useCreateTransfer() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createTransfer = useCallback(async (payload: ITransferInput) => {
        try {
            setLoading(true)
            setError(null)
            return await TransferService.createTransfer(payload)
        } catch (err: any) {
            setError(err.message || "Erro ao criar transferência")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { createTransfer, loading, error }
}

// Atualizar transferência
export function useUpdateTransfer(id: number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateTransfer = useCallback(async (payload: ITransferInput) => {
        try {
            setLoading(true)
            setError(null)
            return await TransferService.updateTransfer(id, payload)
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar transferência")
            throw err
        } finally {
            setLoading(false)
        }
    }, [id])

    return { updateTransfer, loading, error }
}

// Deletar transferência
export function useDeleteTransfer() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteTransfer = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await TransferService.deleteTransfer(id)
        } catch (err: any) {
            setError(err.message || "Erro ao deletar transferência")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteTransfer, loading, error }
}
