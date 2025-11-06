"use client"

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import icon from "@/assets/images/icon.png"

import { 
  ChevronRight,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  UserCheck,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  School,
  Wallet,
  Sparkles,
  LogOut,
  Building,
  UserCog,
  MapPin,
  TrendingUp,
  Shield,
} from "lucide-react"
import { usePermissions } from "@/hooks/usePermissions"
import useAuth from "@/hooks/useAuth"

export interface MenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: string
  children?: MenuItem[]
}

// Menu original completo - usar sistema de permissões em vez de menus separados
const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin"
  },
  {
    title: "Gestão de Alunos",
    icon: Users,
    children: [
      { title: "Alunos", icon: Users, href: "/admin/student-management/student" },
      { title: "Matrículas", icon: GraduationCap, href: "/admin/student-management/enrolls" },
      { title: "Confirmações", icon: UserCheck, href: "/admin/student-management/confirmations" },
      { title: "Transferências", icon: FileText, href: "/admin/student-management/transfers" }
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
    children: [
      { title: "Professores", icon: GraduationCap, href: "/admin/teacher-management/teacher" },
      { title: "Atribuições de Professores", icon: BookOpen, href: "/admin/teacher-management/discpline-teacher" },
      { title: "Diretores de Turma", icon: UserCheck, href: "/admin/teacher-management/director-turma" }
    ]
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    children: [
      { title: "Pagamentos", icon: Wallet, href: "/admin/financeiro/pagamentos" },
      { title: "Relatórios de Vendas", icon: TrendingUp, href: "/admin/financeiro/relatorios-vendas" },
      { title: "Serviços", icon: FileText, href: "/admin/finance-management/services" },
      { title: "Notas de Crédito", icon: FileText, href: "/admin/financeiro/notas-credito" }
    ]
  },
  {
    title: "Configurações",
    icon: Settings,
    children: [
      { title: "Dados Institucionais", icon: Building, href: "/admin/settings-management/instituicao" },
      { title: "Ano Letivo", icon: Calendar, href: "/admin/settings-management/ano-letivo" },
      { title: "Usuários", icon: UserCog, href: "/admin/settings-management/usuarios" },
      { title: "Períodos de Lançamento", icon: Calendar, href: "/admin/settings-management/periodos-lancamento" }
    ]
  },
  {
    title: "Meu Perfil",
    icon: UserCog,
    href: "/admin/perfil"
  },
  {
    title: "Perfil Professor",
    icon: UserCog,
    href: "/admin/perfil-professor"
  }
];

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onLogout?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse, onLogout }: SidebarProps) {
  const { user } = useAuth()
  const { canAccess, userInfo } = usePermissions()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href + "/");
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  // Filtrar itens do menu baseado em permissões (memoizado para evitar loops)
  const filteredMenuItems = useMemo(() => menuItems.filter(item => {
    const userType = user?.tipo || user?.tipoDesignacao || '';
    
    // Remover Dashboard para alunos e professores
    if (item.title === "Dashboard") {
      return userType === 'Administrador' || userType === 'admin';
    }
    
    // Verificar permissões básicas para cada seção
    switch (item.title) {
      case "Gestão de Alunos":
        return canAccess.gestaoAlunos();
      case "Gestão Acadêmica":
        return canAccess.gestaoAcademica() || canAccess.lancamentoNotas() || canAccess.visualizarNotas();
      case "Professores":
        return canAccess.professores();
      case "Financeiro":
        return canAccess.financeiro();
      case "Relatórios":
        return canAccess.relatoriosFinanceiros() || canAccess.gestaoAlunos() || canAccess.gestaoAcademica();
      case "Configurações":
        return canAccess.configuracoes();
      case "Meu Perfil":
        // Alunos e administradores veem "Meu Perfil"
        return userType === 'Aluno' || userType === 'Administrador' || userType === 'admin';
      case "Perfil Professor":
        // Apenas professores veem "Perfil Professor"
        return userType === 'Professor';
      default:
        return true;
    }
  }).map(item => {
    // Filtrar sub-itens baseado em permissões e tipo de usuário
    if (item.children) {
      const filteredChildren = item.children.filter((child: MenuItem) => {
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
              // Mostrar "Lançamento de Notas" para administradores também
              return canAccess.lancamentoNotas();
            }
            // Mostrar outros itens baseado em permissões
            return canAccess.menuItem(child.href || '');
          }
        }
        
        // Filtrar sub-itens de professores
        if (item.title === "Professores") {
          const userType = user?.tipo || user?.tipoDesignacao || '';
          
          if (userType === 'Professor') {
            // Para professores, ocultar todas as sub-abas (função administrativa)
            return false;
          } else {
            // Para administradores, mostrar todos os itens
            return canAccess.professores();
          }
        }
        
        // Para outros itens, usar verificação padrão
        return canAccess.menuItem(child.href || '');
      });
      
      if (filteredChildren.length === 0) {
        return null;
      }
      
      return { ...item, children: filteredChildren };
    }
    
    return item;
  }).filter(Boolean) as MenuItem[], [canAccess, user]);

  // Auto-expandir menu que contém a página ativa
  useEffect(() => {
    menuItems.forEach((item: MenuItem) => {
      if (item.children) {
        const hasActiveChild = item.children.some((child: MenuItem) => child.href && isActive(child.href));
        if (hasActiveChild) {
          setExpandedItems(prev => new Set([...prev, item.title]));
        }
      }
    });
  }, [pathname]);

  return (
    <TooltipProvider>
      <div className={cn(
        "bg-white border-r border-gray-200 h-full flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed ? (
              <div className="flex items-center space-x-3">
                <Image
                  src={icon}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-800 leading-tight">Complexo Escolar</h1>
                  <p className="text-sm text-gray-600 leading-tight">Privado Abilio Junqueira</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Image
                  src={icon}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {filteredMenuItems.map((item: MenuItem) => (
              <li key={item.title}>
                {item.children ? (
                  <Collapsible
                    open={expandedItems.has(item.title)}
                    onOpenChange={() => toggleExpanded(item.title)}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start text-left font-normal hover:bg-gray-100",
                              isCollapsed ? "px-2" : "px-3"
                            )}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 text-gray-600",
                              isCollapsed ? "mr-0" : "mr-3"
                            )} />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1">{item.title}</span>
                                <ChevronRight className={cn(
                                  "h-4 w-4 text-gray-400 transition-transform",
                                  expandedItems.has(item.title) && "rotate-90"
                                )} />
                              </>
                            )}
                          </Button>
                        </CollapsibleTrigger>
                      </TooltipTrigger>
                      {isCollapsed && (
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>

                    {!isCollapsed && (
                      <CollapsibleContent className="space-y-1">
                        <div className="ml-6 space-y-1">
                          {item.children?.map((child: MenuItem) => (
                            child.href ? (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                                  isActive(child.href)
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:bg-gray-100"
                                )}
                              >
                                <child.icon className="h-4 w-4" />
                                <span>{child.title}</span>
                              </Link>
                            ) : null
                          ))}
                        </div>
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href || "#"}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                          isActive(item.href || "")
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-600 hover:bg-gray-100",
                          isCollapsed ? "justify-center" : ""
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed && user && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">
                  {user.nome?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.nome || user.username}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.tipoDesignacao || user.tipo}
                </p>
              </div>
            </div>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                className={cn(
                  "w-full text-gray-600 hover:text-red-600 hover:bg-red-50",
                  isCollapsed ? "px-2" : "justify-start"
                )}
              >
                <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                {!isCollapsed && "Sair"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                Sair
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
