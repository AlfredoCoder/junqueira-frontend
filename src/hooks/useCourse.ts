import { toast } from "react-toastify"
import { getErrorMessage } from "@/utils/getErrorMessage.utils"
import { useState, useEffect, useCallback, useRef } from "react"
import CourseService from "@/services/course.service"
import { ICourse, ICourseInput, ICourseListResponse } from "@/types/course.types"

// Cache helper
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface CacheData<T> {
  data: T;
  timestamp: number;
}

function getCachedData<T>(key: string): T | null {
  try {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp }: CacheData<T> = JSON.parse(cached);
    const now = Date.now();

    if (now - timestamp < CACHE_TTL) {
      console.log(`✅ Cache hit para ${key}`);
      return data;
    }

    sessionStorage.removeItem(key);
    return null;
  } catch {
    return null;
  }
}

function setCachedData<T>(key: string, data: T): void {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn(`Erro ao salvar cache para ${key}:`, error);
  }
}

// Listar TODOS os cursos sem paginação
export function useAllCourses(search = "", includeArchived = false) {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const isMountedRef = useRef(true)
    const fetchingRef = useRef(false)

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const fetchAllCourses = useCallback(async () => {
        if (fetchingRef.current) return;

        const cacheKey = `all-courses-${search}-${includeArchived}`;
        console.log('🔍 Buscando todos os cursos...', { search, includeArchived });
        
        // Verificar cache primeiro
        const cached = getCachedData<ICourse[]>(cacheKey);
        if (cached) {
            console.log('✅ Cursos encontrados no cache:', cached.length);
            setCourses(cached);
            setLoading(false);
            return;
        }

        fetchingRef.current = true;
        try {
            setLoading(true)
            setError(null)
            console.log('📡 Fazendo requisição para API...');
            const { data } = await CourseService.getAllCourses(search, includeArchived)
            console.log('📊 Cursos recebidos da API:', data.length);
            if (isMountedRef.current) {
                setCourses(data)
                setCachedData(cacheKey, data);
            }
        } catch (err: unknown) {
            console.error('❌ Erro ao carregar cursos:', err);
            if (isMountedRef.current) {
                const errorMessage = getErrorMessage(err, "Erro ao carregar cursos");
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false)
            }
            fetchingRef.current = false;
        }
    }, [])

    useEffect(() => {
        fetchAllCourses()
    }, [])

    return { courses, loading, error, refetch: fetchAllCourses }
}

// Hook para obter estatísticas dos cursos (total, ativos, inativos)
export function useCourseStats() {
    const [stats, setStats] = useState<{ total: number; active: number; inactive: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await CourseService.getCourseStats()
            if (data) setStats(data)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao carregar estatísticas de cursos");
            toast.error(errorMessage);
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return { stats, loading, error, refetch: fetchStats }
}

// Listar cursos com paginação e busca
export function useCourses(page = 1, limit = 10, search = "", includeArchived = false) {
    const [courses, setCourses] = useState<ICourse[]>([])
    const [pagination, setPagination] = useState<ICourseListResponse["pagination"] | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data, pagination } = await CourseService.getCourses(page, limit, search, includeArchived)
            setCourses(data)
            setPagination(pagination)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao carregar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [page, limit, search, includeArchived])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    return { courses, pagination, loading, error, refetch: fetchCourses }
}

// Buscar curso por ID
export function useCourse(id?: number) {
    const [course, setCourse] = useState<ICourse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchCourse = useCallback(async () => {
        if (!id) return
        try {
            setLoading(true)
            setError(null)
            const data = await CourseService.getCourseById(id)
            setCourse(data)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao carregar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchCourse()
    }, [fetchCourse])

    return { course, loading, error, refetch: fetchCourse }
}

// Criar curso
export function useCreateCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createCourse = useCallback(async (payload: ICourseInput) => {
        try {
            setLoading(true)
            setError(null)
            return await CourseService.createCourse(payload)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao criar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [])

    return { createCourse, loading, error }
}

// Atualizar curso
export function useUpdateCourse(id: number) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateCourse = useCallback(async (payload: ICourseInput) => {
        try {
            setLoading(true)
            setError(null)
            return await CourseService.updateCourse(id, payload)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao atualizar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [id])

    return { updateCourse, loading, error }
}

// Arquivar curso
export function useArchiveCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const archiveCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await CourseService.archiveCourse(id)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao criar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [])

    return { archiveCourse, loading, error }
}

// Restaurar curso
export function useUnarchiveCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const unarchiveCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            await CourseService.unarchiveCourse(id)
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao restaurar curso");
            toast.error(errorMessage);
        } finally {
            setLoading(false)
        }
    }, [])

    return { unarchiveCourse, loading, error }
}

// Deletar curso (apenas para admin)
export function useDeleteCourse() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const deleteCourse = useCallback(async (id: number) => {
        try {
            setLoading(true)
            setError(null)
            const response = await CourseService.deleteCourse(id)
            return response
        } catch (err: unknown) {
            const errorMessage = getErrorMessage(err, "Erro ao deletar curso");
            setError(errorMessage)
            toast.error(errorMessage);
            throw new Error(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [])

    return { deleteCourse, loading, error }
}
