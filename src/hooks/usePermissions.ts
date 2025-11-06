import { useState, useEffect, useMemo } from 'react';
import useAuth from './useAuth';
import authService from '@/services/auth.service';

// Definição das permissões baseada no sistema integrado
export interface IntegratedPermissions {
  dashboard: string[];
  gestaoAcademica: string[];
  gestaoAlunos: string[];
  professores: string[];
  financeiro: string[];
  configuracoes: string[];
  usuarios: string[];
  perfil?: string[]; // ✅ Campo perfil opcional
  periodosLancamento?: string[]; // ✅ Períodos de lançamento opcional
}

export function usePermissions() {
  const { user, isAuthenticated } = useAuth();
  const [permissions, setPermissions] = useState<IntegratedPermissions | null>(null);
  const [loading, setLoading] = useState(false);

  // Buscar permissões do servidor
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!isAuthenticated || !user) {
        setPermissions(null);
        return;
      }

      try {
        setLoading(true);
        const response = await authService.integratedGetPermissions();
        
        if (response.success && response.data) {
          setPermissions(response.data.permissoes);
        }
      } catch (error) {
        console.error('Erro ao buscar permissões:', error);
        setPermissions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [isAuthenticated, user]);

  // Informações do usuário (precisa vir antes de canAccess)
  const userInfo = useMemo(() => {
    if (!user) return null;
    
    const tipoStr = String(user.tipo || user.tipoDesignacao || '');
    
    return {
      tipo: tipoStr,
      isAdmin: tipoStr === 'Administrador',
      isProfessor: tipoStr === 'Professor',
      isAluno: tipoStr === 'Aluno',
      isSecretaria: tipoStr === 'Secretaria',
      isDiretor: tipoStr === 'Diretor',
      hasFullAccess: tipoStr === 'Administrador'
    };
  }, [user]);

  // Funções de verificação de permissão
  const hasPermission = useMemo(() => {
    return (modulo: keyof IntegratedPermissions, acao: string): boolean => {
      if (!permissions || !permissions[modulo]) return false;
      return permissions[modulo].includes(acao);
    };
  }, [permissions]);

  const canAccess = useMemo(() => ({
    // Verificação de rota (compatibilidade com código existente)
    route: (path: string): boolean => {
      if (!permissions || !userInfo) return false;
      
      // Mapeamento de rotas para permissões
      if (path.includes('/admin/dashboard')) {
        // Dashboard apenas para administradores
        return userInfo.isAdmin;
      }
      if (path.includes('/admin/student-management')) {
        return hasPermission('gestaoAlunos', 'view');
      }
      if (path.includes('/admin/teacher-management')) {
        if (path.includes('/notas')) {
          return hasPermission('gestaoAcademica', 'lancamentoNotas') || hasPermission('gestaoAcademica', 'visualizarNotas');
        }
        return hasPermission('professores', 'view') || hasPermission('gestaoAcademica', 'view');
      }
      if (path.includes('/admin/academic-management')) {
        if (path.includes('/minhas-turmas')) {
          // "Minhas Turmas" apenas para professores
          return userInfo.isProfessor;
        }
        return hasPermission('gestaoAcademica', 'view');
      }
      if (path.includes('/admin/financeiro')) {
        return hasPermission('financeiro', 'view') || hasPermission('financeiro', 'pagamentos');
      }
      if (path.includes('/admin/configuracoes')) {
        return hasPermission('configuracoes', 'view');
      }
      if (path.includes('/admin/perfil-professor')) {
        // Perfil professor apenas para professores
        return userInfo.isProfessor;
      }
      if (path.includes('/admin/perfil')) {
        // Perfil geral para alunos e administradores (NÃO professores)
        return (userInfo.isAluno || userInfo.isAdmin) && !userInfo.isProfessor;
      }
      if (path.includes('/admin/settings-management/periodos-lancamento') || path.includes('periodos-lancamento')) {
        return hasPermission('periodosLancamento', 'view') || hasPermission('configuracoes', 'view');
      }
      
      // Para administradores, permitir acesso a todas as rotas admin
      if (userInfo.isAdmin) {
        return true;
      }
      
      // Rota padrão admin - redirecionar baseado no tipo de usuário
      if (path === '/admin' || path === '/admin/') {
        // Administradores podem acessar o dashboard
        if (userInfo.isAdmin) {
          return true;
        }
        
        // Professores e alunos não devem acessar /admin diretamente
        // Eles devem ser redirecionados para suas páginas específicas
        return false;
      }
      
      return false;
    },
    
    // Verificação de menu (compatibilidade)
    menuItem: (menuPath: string): boolean => {
      // Implementação direta para evitar referência circular
      if (!permissions || !userInfo) return false;
      
      // Usar a mesma lógica da função route
      if (menuPath.includes('/admin/dashboard')) {
        return hasPermission('dashboard', 'view');
      }
      if (menuPath.includes('/admin/student-management')) {
        return hasPermission('gestaoAlunos', 'view');
      }
      if (menuPath.includes('/admin/teacher-management')) {
        if (menuPath.includes('/notas')) {
          return hasPermission('gestaoAcademica', 'lancamentoNotas') || hasPermission('gestaoAcademica', 'visualizarNotas');
        }
        return hasPermission('professores', 'view') || hasPermission('gestaoAcademica', 'view');
      }
      if (menuPath.includes('/admin/academic-management')) {
        if (menuPath.includes('/minhas-turmas')) {
          // "Minhas Turmas" apenas para professores
          return userInfo.isProfessor;
        }
        return hasPermission('gestaoAcademica', 'view');
      }
      if (menuPath.includes('/admin/financeiro')) {
        return hasPermission('financeiro', 'view') || hasPermission('financeiro', 'pagamentos');
      }
      if (menuPath.includes('/admin/configuracoes')) {
        return hasPermission('configuracoes', 'view');
      }
      if (menuPath.includes('/admin/perfil')) {
        return hasPermission('perfil', 'view');
      }
      if (menuPath.includes('/admin/settings-management/periodos-lancamento') || menuPath.includes('periodos-lancamento')) {
        return hasPermission('periodosLancamento', 'view') || hasPermission('configuracoes', 'view');
      }
      
      if (userInfo.isAdmin) {
        return true;
      }
      
      return false;
    },
    
    // Dashboard
    dashboard: () => hasPermission('dashboard', 'view'),
    
    // Gestão Acadêmica
    gestaoAcademica: () => hasPermission('gestaoAcademica', 'view'),
    lancamentoNotas: () => hasPermission('gestaoAcademica', 'lancamentoNotas'),
    visualizarNotas: () => hasPermission('gestaoAcademica', 'visualizarNotas'),
    
    // Gestão de Alunos
    gestaoAlunos: () => hasPermission('gestaoAlunos', 'view'),
    criarAluno: () => hasPermission('gestaoAlunos', 'create'),
    editarAluno: () => hasPermission('gestaoAlunos', 'edit'),
    
    // Professores
    professores: () => hasPermission('professores', 'view'),
    criarProfessor: () => hasPermission('professores', 'create'),
    
    // Financeiro
    financeiro: () => hasPermission('financeiro', 'view'),
    pagamentos: () => hasPermission('financeiro', 'pagamentos'),
    relatoriosFinanceiros: () => hasPermission('financeiro', 'relatorios'),
    configuracoes: () => hasPermission('configuracoes', 'view'),
    usuarios: () => hasPermission('usuarios', 'view'),
    perfil: () => hasPermission('perfil', 'view'),
    periodosLancamento: () => hasPermission('periodosLancamento', 'view'),
  }), [hasPermission, permissions, userInfo]);

  return {
    permissions,
    loading,
    canAccess,
    userInfo,
    user,
    // Compatibilidade com código antigo
    userType: userInfo?.tipo ? String(userInfo.tipo).toLowerCase() : 'unknown',
    isAdmin: userInfo?.isAdmin || false,
    hasFullAccess: userInfo?.hasFullAccess || false,
  };
}
