import { useState, useEffect, useCallback } from "react"
import EnrollmentService from "@/services/enrollment.service"
import { IEnrollment, IEnrollmentInput, IEnrollmentListResponse } from "@/types/enrollment.types"

// Listagem com paginação
export function useEnrollments(page = 1, limit = 10, search = "") {
  const [enrollments, setEnrollments] = useState<IEnrollment[]>([])
  const [pagination, setPagination] = useState<IEnrollmentListResponse["pagination"] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const { data, pagination } = await EnrollmentService.getEnrollments(page, limit, search)
      setEnrollments(data)
      setPagination(pagination)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrículas")
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchEnrollments()
  }, [fetchEnrollments])

  return { enrollments, pagination, loading, error, refetch: fetchEnrollments }
}

// Uma matrícula por ID
export function useEnrollment(id?: number) {
  const [enrollment, setEnrollment] = useState<IEnrollment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEnrollment = useCallback(async () => {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await EnrollmentService.getEnrollmentById(id)
      setEnrollment(data)
    } catch (err: any) {
      setError(err.message || "Erro ao carregar matrícula")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEnrollment()
  }, [fetchEnrollment])

  return { enrollment, loading, error, refetch: fetchEnrollment }
}

// Criar
export function useCreateEnrollment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEnrollment = useCallback(async (payload: IEnrollmentInput) => {
    try {
      setLoading(true)
      setError(null)
      return await EnrollmentService.createEnrollment(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar matrícula")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createEnrollment, loading, error }
}

// Atualizar
export function useUpdateEnrollment(id: number) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateEnrollment = useCallback(async (payload: IEnrollmentInput) => {
    try {
      setLoading(true)
      setError(null)
      return await EnrollmentService.updateEnrollment(id, payload)
    } catch (err: any) {
      setError(err.message || "Erro ao atualizar matrícula")
      throw err
    } finally {
      setLoading(false)
    }
  }, [id])

  return { updateEnrollment, loading, error }
}

// Deletar
export function useDeleteEnrollment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteEnrollment = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      await EnrollmentService.deleteEnrollment(id)
    } catch (err: any) {
      setError(err.message || "Erro ao deletar matrícula")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { deleteEnrollment, loading, error }
}

// Batch
export function useBatchEnrollment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const batchEnrollment = useCallback(async (payload: IEnrollmentInput[]) => {
    try {
      setLoading(true)
      setError(null)
      return await EnrollmentService.batchEnrollment(payload)
    } catch (err: any) {
      setError(err.message || "Erro ao criar matrículas em lote")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { batchEnrollment, loading, error }
}
