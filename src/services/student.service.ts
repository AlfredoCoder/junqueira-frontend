import api from "@/utils/api.utils";
import {
    Student,
    StudentResponse,
    AlunosStatistics,
    StatisticsResponse,
    IPagination
} from "@/types/student.types";


export default class StudentService {

    static async getAllStudentsComplete(): Promise<{ students: Student[], pagination: IPagination }> {
        // Buscar todos os estudantes sem paginação
        return this.getAllStudents(1, 100);
    }

    static async getAllStudents(
        page: number,
        limit: number,
        search: string = '',
        statusFilter: string | null = null,
        cursoFilter: string | null = null
    ): Promise<{ students: Student[], pagination: IPagination }> {

        // Construir a query string explicitamente para garantir que o backend
        // receba os parâmetros no formato esperado (evita comportamento de
        // serialização de `axios` que pode interferir em includes relacionados).
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (search) {
            params.append('search', search);
        }
        if (statusFilter && statusFilter !== 'all') {
            params.append('status', statusFilter);
        }
        if (cursoFilter && cursoFilter !== 'all') {
            params.append('curso', cursoFilter);
        }

        // Cache buster para evitar respostas cacheadas durante desenvolvimento
        params.append('_t', Date.now().toString());

        const response = await api.get(`/api/student-management/alunos?${params.toString()}`);

        const apiResponse: StudentResponse = response.data;

        return {
            students: apiResponse.data,
            pagination: apiResponse.pagination || {
                currentPage: page,
                totalPages: 1,
                totalItems: apiResponse.data.length,
                itemsPerPage: limit
            }
        };

    }

    static async getStudentById(id: number): Promise<Student> {
        const response = await api.get(`/api/student-management/alunos/${id}`);
        const apiResponse = response.data;
        return apiResponse.data;
    }

    static async createStudent(studentData: Student): Promise<Student> {

        const payload = { ...studentData };

        const response = await api.post("/api/student-management/alunos", payload);
        const apiResponse = response.data;
        return apiResponse.data;
    }

    static async updateStudent(id: number, studentData: Student): Promise<Student> {
        const response = await api.put(`/api/student-management/alunos/${id}`, studentData);
        return response.data.data;
    }

    static async deleteStudent(id: number): Promise<void> {
        await api.delete(`/api/student-management/alunos/${id}`);
    }


    static async getAlunosStatistics(statusFilter: string | null = null, cursoFilter: string | null = null): Promise<AlunosStatistics> {
        const params = new URLSearchParams();

        if (statusFilter && statusFilter !== 'all') {
            params.append('status', statusFilter);
        }

        if (cursoFilter && cursoFilter !== 'all') {
            params.append('curso', cursoFilter);
        }

        // Cache buster para evitar cache
        params.append('_t', Date.now().toString());
        const queryString = params.toString();
        
        const url = `/api/student-management/statistics/alunos${queryString ? `?${queryString}` : ''}`;

        const response = await api.get(url);
        const apiResponse: StatisticsResponse = response.data;

        return apiResponse.data;
    }
}


