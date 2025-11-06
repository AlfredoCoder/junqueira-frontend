import { useState, useEffect, useCallback } from 'react'
import { IInstitution, IInstitutionInput } from '@/types/institution.types'
import institutionService from '@/services/institution.service'

// Hook para buscar dados institucionais principais
export function useInstitution() {
  const [institution, setInstitution] = useState<IInstitution | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInstitution = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.getInstitutionPrincipal()
      setInstitution(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados institucionais')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInstitution()
  }, [fetchInstitution])

  return {
    institution,
    loading,
    error,
    refetch: fetchInstitution
  }
}

// Hook para buscar dados institucionais por ID
export function useInstitutionById(id: number) {
  const [institution, setInstitution] = useState<IInstitution | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInstitution = useCallback(async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.getInstitutionById(id)
      setInstitution(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados institucionais')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchInstitution()
  }, [fetchInstitution])

  return {
    institution,
    loading,
    error,
    refetch: fetchInstitution
  }
}

// Hook para criar dados institucionais
export function useCreateInstitution() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createInstitution = async (data: IInstitutionInput): Promise<IInstitution | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.createInstitution(data)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar dados institucionais')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    createInstitution,
    loading,
    error
  }
}

// Hook para atualizar dados institucionais
export function useUpdateInstitution() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateInstitution = async (id: number, data: IInstitutionInput): Promise<IInstitution | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.updateInstitution(id, data)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dados institucionais')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateInstitutionData = async (id: number, data: IInstitutionInput): Promise<IInstitution | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.updateInstitution(id, data)
      return response.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar dados institucionais')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    updateInstitution,
    updateInstitutionData,
    loading,
    error
  }
}

// Hook para upload de logo
export function useUploadLogo() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await institutionService.uploadLogo(file)
      return response.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer upload do logo')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    uploadLogo,
    loading,
    error
  }
}
