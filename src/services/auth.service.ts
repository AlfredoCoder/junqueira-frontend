import api from "@/utils/api.utils";
import { toast } from "react-toastify";
import {
    LegacyLoginCredentials,
    LegacyRegisterData,
    ModernLoginCredentials,
    ModernRegisterData,
    AuthResponse,
    LoginResponse,
    LegacyUser,
    ModernUser,
    UserType
} from "@/types/auth.types";

export default class authService {

    static async login(credentials: LegacyLoginCredentials): Promise<AuthResponse<LoginResponse>> {
        try {
            const response = await api.post("/api/auth/legacy/login", credentials);
            
            // Salvar token e dados do usuário no localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                toast.success(response.data.message || 'Login realizado com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer login';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async logout(): Promise<AuthResponse> {
        try {
            const response = await api.post("/api/auth/legacy/logout");
            
            // Limpar dados do localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer logout';
            toast.error(errorMessage);
            // Mesmo se der erro no servidor, limpar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            throw error;
        }
    }

    static async getCurrentUser(): Promise<AuthResponse<LegacyUser>> {
        try {
            const response = await api.get("/api/auth/legacy/me");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async register(userData: LegacyRegisterData): Promise<AuthResponse<LegacyUser>> {
        try {
            const response = await api.post("/api/auth/legacy/register", userData);
            
            if (response.data.success) {
                toast.success(response.data.message || 'Usuário registrado com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao registrar usuário';
            toast.error(errorMessage);
            throw error;
        }
    }

    // Método adicional para verificar se o usuário está autenticado
    static async isAuthenticated(): Promise<boolean> {
        try {
            await this.getCurrentUser();
            return true;
        } catch (error) {
            return false;
        }
    }

    // Método para obter tipos de usuário
    static async getUserTypes(): Promise<AuthResponse<UserType[]>> {
        try {
            const response = await api.get("/api/auth/user-types");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // ===============================
    // MÉTODOS PARA SISTEMA MODERNO
    // ===============================

    static async modernLogin(credentials: ModernLoginCredentials): Promise<AuthResponse<LoginResponse>> {
        try {
            const response = await api.post("/api/auth/login", credentials);
            
            // Salvar token e dados do usuário no localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
                toast.success(response.data.message || 'Login realizado com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer login';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async modernRegister(userData: ModernRegisterData): Promise<AuthResponse<ModernUser>> {
        try {
            const response = await api.post("/api/auth/register", userData);
            
            if (response.data.success) {
                toast.success(response.data.message || 'Usuário registrado com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao registrar usuário';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async modernGetCurrentUser(): Promise<AuthResponse<ModernUser>> {
        try {
            const response = await api.get("/api/auth/me");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // ===============================
    // MÉTODOS PARA SISTEMA INTEGRADO
    // ===============================

    static async integratedLogin(credentials: { username: string; password: string }): Promise<AuthResponse<any>> {
        try {
            const response = await api.post("/api/auth/integrated/login", credentials);
            
            // Salvar token e dados do usuário no localStorage
            if (response.data.success && response.data.data.token) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.usuario));
                localStorage.setItem('userType', response.data.data.dadosEspecificos.tipo);
                localStorage.setItem('specificData', JSON.stringify(response.data.data.dadosEspecificos.dados));
                toast.success(response.data.message || 'Login realizado com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer login';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async integratedLogout(): Promise<AuthResponse> {
        try {
            const user = this.getStoredUser();
            const response = await api.post("/api/auth/integrated/logout", {
                codigo: user?.codigo || user?.id
            });
            
            // Limpar dados do localStorage
            this.clearSession();
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao fazer logout';
            toast.error(errorMessage);
            // Mesmo se der erro no servidor, limpar localStorage
            this.clearSession();
            
            throw error;
        }
    }

    static async integratedVerifySession(): Promise<AuthResponse> {
        try {
            const response = await api.get("/api/auth/integrated/verify");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    static async integratedChangePassword(data: { codigo: number; senhaAtual: string; novaSenha: string }): Promise<AuthResponse> {
        try {
            const response = await api.post("/api/auth/integrated/change-password", data);
            
            if (response.data.success) {
                toast.success(response.data.message || 'Senha alterada com sucesso!');
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao alterar senha';
            toast.error(errorMessage);
            throw error;
        }
    }

    static async integratedGetPermissions(): Promise<AuthResponse<any>> {
        try {
            const response = await api.get("/api/auth/integrated/permissions");
            return response.data;
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao obter permissões';
            console.error('Erro ao obter permissões:', errorMessage);
            throw error;
        }
    }

    // ===============================
    // MÉTODOS UTILITÁRIOS
    // ===============================

    // Obter token do localStorage
    static getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    // Obter dados do usuário do localStorage
    static getStoredUser(): LegacyUser | ModernUser | null {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            return userData ? JSON.parse(userData) : null;
        }
        return null;
    }

    // Verificar se há token válido
    static hasValidToken(): boolean {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            // Verificar se o token não está expirado
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp > currentTime;
        } catch (error) {
            // Se não conseguir decodificar, considerar inválido
            return false;
        }
    }

    // Limpar sessão completamente
    static clearSession(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userType');
            localStorage.removeItem('specificData');
        }
    }

}