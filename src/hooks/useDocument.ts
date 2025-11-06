import { useState, useEffect, useCallback } from "react"
import DocumentService from "@/services/document.service"
import { IDocumentType, IDocumentNumbering } from "@/types/document.types"

// -----------------------------
// HOOKS PARA TIPOS DE DOCUMENTO
// -----------------------------
export function useDocumentTypes() {
    const [documentTypes, setDocumentTypes] = useState<IDocumentType[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDocumentTypes = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentService.getAllDocumentTypes()
            setDocumentTypes(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar tipos de documento")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDocumentTypes()
    }, [fetchDocumentTypes])

    return { documentTypes, loading, error, refetch: fetchDocumentTypes }
}

export function useDocumentType(id?: number) {
    const [documentType, setDocumentType] = useState<IDocumentType | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchDocumentType = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentService.getDocumentTypeById(id)
            setDocumentType(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar tipo de documento")
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchDocumentType()
    }, [fetchDocumentType])

    return { documentType, loading, error, refetch: fetchDocumentType }
}

// -----------------------------
// HOOKS PARA NUMERAÇÃO DOCUMENTOS
// -----------------------------

// Listar todas as numerações
export function useDocumentNumberings() {
    const [numberings, setNumberings] = useState<IDocumentNumbering[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNumberings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentService.getDocumentNumbering()
            setNumberings(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar numerações")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchNumberings()
    }, [fetchNumberings])

    return { numberings, loading, error, refetch: fetchNumberings }
}

// Buscar/atualizar uma numeração por ID
export function useDocumentNumbering(id?: number) {
    const [numbering, setNumbering] = useState<IDocumentNumbering | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchNumbering = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentService.getDocumentNumberingById(id)
            setNumbering(data)
        } catch (err: any) {
            setError(err.message || "Erro ao carregar numeração")
        } finally {
            setLoading(false)
        }
    }, [id])

    const updateNumbering = useCallback(
        async (numberingData: IDocumentNumbering) => {
            if (!id) return
            try {
                setLoading(true)
                setError(null)
                const data = await DocumentService.updateDocumentNumbering(id, numberingData)
                setNumbering(data)
                return data
            } catch (err: any) {
                setError(err.message || "Erro ao atualizar numeração")
                throw err
            } finally {
                setLoading(false)
            }
        },
        [id]
    )

    useEffect(() => {
        fetchNumbering()
    }, [fetchNumbering])

    return { numbering, loading, error, refetch: fetchNumbering, updateNumbering }
}

// Criar numeração
export function useCreateDocumentNumbering() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createNumbering = useCallback(async (numberingData: IDocumentNumbering) => {
        try {
            setLoading(true)
            setError(null)
            const data = await DocumentService.createDocumentNumbering(numberingData)
            return data
        } catch (err: any) {
            setError(err.message || "Erro ao criar numeração")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { createNumbering, loading, error }
}

// Deletar numeração
export function useDeleteDocumentNumbering() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteNumbering = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await DocumentService.deleteDocumentNumbering(id)
        } catch (err: any) {
            setError(err.message || "Erro ao deletar numeração")
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteNumbering, loading, error }
}
