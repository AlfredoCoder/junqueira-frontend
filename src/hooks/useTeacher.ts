import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { IDocente, IDocenteInput, IEspecialidade, IDocenteListResponse } from '@/types/teacher.types';
import teacherService from '@/services/teacher.service';

// Hook para buscar TODOS os docentes sem paginação
export function useAllDocentes(search?: string) {
  const [docentes, setDocentes] = useState<IDocente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllDocentes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.getAllDocentes(search)
      setDocentes(response.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar docentes')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchAllDocentes()
  }, [fetchAllDocentes])

  return {
    docentes,
    loading,
    error,
    refetch: fetchAllDocentes
  }
}

// Hook para buscar todos os docentes (com paginação)
export function useDocentes(page: number = 1, limit: number = 10, search?: string) {
  const [docentes, setDocentes] = useState<IDocente[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<IDocenteListResponse['pagination'] | null>(null)

  const fetchDocentes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.getDocentes(page, limit, search)
      setDocentes(response.data)
      setPagination(response.pagination)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar docentes')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search])

  useEffect(() => {
    fetchDocentes()
  }, [fetchDocentes])

  return {
    docentes,
    loading,
    error,
    pagination,
    refetch: fetchDocentes
  }
}

// Hook para buscar docente por ID
export function useDocente(id: number) {
  const [docente, setDocente] = useState<IDocente | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocente = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.getDocenteById(id)
      setDocente(response.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar docente')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDocente()
  }, [fetchDocente])

  return {
    docente,
    loading,
    error,
    refetch: fetchDocente
  }
}

// Hook para criar docente
export function useCreateDocente() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDocente = async (data: IDocenteInput): Promise<IDocente | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.createDocente(data)
      return response.data
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar docente')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createDocente,
    loading,
    error
  }
}

// Hook para atualizar docente
export function useUpdateDocente() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDocente = async (id: number, data: IDocenteInput): Promise<IDocente | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.updateDocente(id, data)
      return response.data
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar docente')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    updateDocente,
    loading,
    error
  }
}

// Hook para excluir docente
export function useDeleteDocente() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDocente = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.deleteDocente(id)
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir docente'
      setError(errorMessage)
      toast.error(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    deleteDocente,
    loading,
    error
  }
}

// Hook para buscar especialidades
export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState<IEspecialidade[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEspecialidades = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await teacherService.getEspecialidades()
      setEspecialidades(response.data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar especialidades')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEspecialidades()
  }, [fetchEspecialidades])

  return {
    especialidades,
    loading,
    error,
    refetch: fetchEspecialidades
  }
}

// Hook principal para listar docentes (alias para useDocentes)
export function useTeacher(page: number = 1, limit: number = 10, search?: string) {
  return useDocentes(page, limit, search)
}

// Export default para compatibilidade
const useTeacherDefault = {
  useDocentes,
  useDocente,
  useCreateDocente,
  useUpdateDocente,
  useDeleteDocente,
  useEspecialidades,
  useTeacher
}

export default useTeacherDefault
