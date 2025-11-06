"use client"

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  School, 
  MapPin, 
  DollarSign, 
  FileText, 
  Settings, 
  UserCog, 
  Calendar,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/usePermissions'
import useAuth from '@/hooks/useAuth'

interface MenuItem {
  title: string
  icon: React.ComponentType<any>
  href?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin"
  },
  {
    title: "Gestão de Alunos",
    icon: Users,
    children: [
      { title: "Alunos", icon: Users, href: "/admin/student-management/alunos" },
      { title: "Matrículas", icon: FileText, href: "/admin/student-management/matriculas" },
      { title: "Confirmações", icon: FileText, href: "/admin/student-management/confirmacoes" }
    ]
  },
  {
    title: "Gestão Acadêmica",
    icon: BookOpen,
    children: [
      { title: "Cursos", icon: School, href: "/admin/academic-management/course" },
      { title: "Disciplinas", icon: BookOpen, href: "/admin/academic-management/discipline" },
      { title: "Classes", icon: GraduationCap, href: "/admin/academic-management/classes" },
      { title: "Salas", icon: MapPin, href: "/admin/academic-management/salas" },
      { title: "Turmas", icon: School, href: "/admin/academic-management/turmas" },
      { title: "Minhas Turmas", icon: Users, href: "/admin/academic-management/minhas-turmas" },
      { title: "Trimestres", icon: FileText, href: "/admin/academic-management/trimestres" },
      { title: "Lançamento de Notas", icon: FileText, href: "/admin/teacher-management/notas/professor" }
    ]
  },
  {
    title: "Professores",
    icon: GraduationCap,
    href: "/admin/professores"
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    children: [
      { title: "Pagamentos", icon: DollarSign, href: "/admin/financeiro/pagamentos" },
      { title: "Notas de Crédito", icon: FileText, href: "/admin/financeiro/notas-credito" },
      { title: "Serviços", icon: Settings, href: "/admin/financeiro/services" },
      { title: "Relatórios Financeiros", icon: FileText, href: "/admin/financeiro/relatorios-vendas" }
    ]
  },
  {
    title: "Configurações",
    icon: Settings,
    children: [
      { title: "Períodos de Lançamento", icon: Calendar, href: "/admin/settings-management/periodos-lancamento" }
    ]
  },
  {
    title: "Meu Perfil",
    icon: UserCog,
    href: "/admin/perfil"
  }
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onLogout?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse, onLogout }: SidebarProps) {
  const { user, loading } = useAuth()
  const { canAccess, userInfo } = usePermissions()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  // Auto-expandir menu que contém a página ativa
  useEffect(() => {
    const findActiveParent = (items: MenuItem[], currentPath: string): string | null => {
      for (const item of items) {
        if (item.children) {
          for (const child of item.children) {
            if (child.href && currentPath.startsWith(child.href)) {
              return item.title
            }
          }
        }
      }
      return null
    }

    const activeParent = findActiveParent(menuItems, pathname)
    if (activeParent) {
      setExpandedItems(prev => new Set([...prev, activeParent]))
    }
  }, [pathname])

  const isActive = (href: string) => {
    if (pathname === href) return true;
    
    if (href === "/admin") {
      return pathname === "/admin";
    }
    
    return pathname.startsWith(href + "/");
  }

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  // Filtrar itens do menu baseado nas permissões
  const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
    // Se ainda está carregando ou não tem usuário, retornar array vazio para evitar flash
    if (loading || !user) return [];
    
    return items.filter(item => {
      // Dashboard apenas para Administradores, Secretaria e Diretores
      if (item.href === "/admin") {
        const userType = user?.tipo || user?.tipoDesignacao || '';
        return userType === 'Administrador' || userType === 'Secretaria' || userType === 'Diretor';
      }
      
      // Verificar permissões por título do menu
      switch (item.title) {
        case "Gestão de Alunos":
          return canAccess.gestaoAlunos();
        case "Gestão Acadêmica":
          return canAccess.gestaoAcademica() || canAccess.lancamentoNotas() || canAccess.visualizarNotas();
        case "Professores":
          return canAccess.professores();
        case "Financeiro":
          return canAccess.financeiro() || canAccess.pagamentos();
        case "Configurações":
          return canAccess.configuracoes();
        case "Meu Perfil":
          return true; // Todos podem ver o perfil
        default:
          return true;
      }
    }).map(item => {
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          if (!child.href) return true;
          
          // Filtrar sub-itens financeiros
          if (item.title === "Financeiro") {
            if (child.href.includes('/pagamentos')) {
              return canAccess.pagamentos();
            }
            if (child.href.includes('/relatorios-vendas') || child.href.includes('/financial')) {
              return canAccess.relatoriosFinanceiros();
            }
            if (child.href.includes('/services') || child.href.includes('/credit-notes')) {
              return canAccess.financeiro();
            }
          }
          
          // Filtrar sub-itens de gestão acadêmica
          if (item.title === "Gestão Acadêmica") {
            const userType = user?.tipo || user?.tipoDesignacao || '';
            
            if (userType === 'Professor') {
              // Para professores, mostrar apenas "Minhas Turmas" e "Lançamento de Notas"
              if (child.href?.includes('/minhas-turmas')) {
                return true;
              }
              if (child.title === "Lançamento de Notas") {
                return canAccess.lancamentoNotas();
              }
              // Ocultar todos os outros itens para professores
              return false;
            } else {
              // Para outros tipos de usuário (Admin, Secretaria, etc.)
              if (child.href?.includes('/minhas-turmas')) {
                // "Minhas Turmas" apenas para professores
                return false;
              }
              if (child.title === "Lançamento de Notas") {
                // Ocultar "Lançamento de Notas" para administradores
                return !userInfo?.isAdmin && canAccess.lancamentoNotas();
              }
              // Mostrar outros itens baseado em permissões
              return canAccess.menuItem(child.href || '');
            }
          }
          
          // Filtrar sub-itens de configurações
          if (item.title === "Configurações") {
            if (child.href?.includes('/periodos-lancamento')) {
              return canAccess.configuracoes();
            }
          }
          
          return canAccess.menuItem(child.href || '');
        });
        
        // Se não há filhos visíveis, não mostrar o item pai
        if (filteredChildren.length === 0 && item.children.length > 0) {
          return null;
        }
        
        return { ...item, children: filteredChildren };
      }
      
      return item;
    }).filter(Boolean) as MenuItem[];
  };

  const filteredMenuItems = filterMenuItems(menuItems);

  return (
    <div className={`bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">Junqueira</h1>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="p-1"
            >
              {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={`w-full flex items-center justify-between p-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                      isCollapsed ? 'justify-center' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 text-gray-600 ${
                        isCollapsed ? 'mx-auto' : ''
                      }`} />
                      {!isCollapsed && (
                        <span className="text-gray-700 font-medium">{item.title}</span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <div className="text-gray-400">
                        {expandedItems.has(item.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </button>
                  
                  {expandedItems.has(item.title) && !isCollapsed && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link
                            href={child.href || '#'}
                            className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                              isActive(child.href || '') 
                                ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <child.icon className="h-4 w-4" />
                            <span>{child.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href || '#'}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive(item.href || '') 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-600 hover:bg-gray-50'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className={`h-5 w-5 ${
                    isCollapsed ? 'mx-auto' : ''
                  }`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.title}</span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className={`mb-3 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-gray-500">{user.tipoDesignacao || user.tipo}</p>
              </div>
            )}
          </div>
        )}
        
        {onLogout && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className={`w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 ${
              isCollapsed ? 'justify-center px-2' : 'justify-start'
            }`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        )}
      </div>
    </div>
  )
}
