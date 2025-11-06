"use client"

import React, { useState, useEffect } from "react"
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
    title: "Relatórios",
    icon: BarChart3,
    children: [
      { title: "Relatórios de Alunos", icon: Users, href: "/admin/reports-management/students" },
      { title: "Relatórios Financeiros", icon: DollarSign, href: "/admin/reports-management/financial" },
      { title: "Relatórios Acadêmicos", icon: BookOpen, href: "/admin/reports-management/academic" }
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
  }
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onLogout?: () => void
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse, onLogout }) {
  const { user, loading, isInitialized } = useAuth()
  const { canAccess, userInfo } = usePermissions()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [sidebarReady, setSidebarReady] = useState(false)
  const { canAccess, loading, userInfo } = usePermissions()
  const { user } = useAuth()

  // Auto-expandir menu que contém a página ativa
  useEffect(() => {
{{ ... }}
    const isActive = (href: string) => {
      
      if (pathname === href) return true;
      
      // Para evitar conflitos, verificamos se o pathname começa com href + "/"
      // mas não é apenas uma substring de uma rota maior
      if (href === "/admin") {
        return pathname === "/admin";
      }
      
      return pathname.startsWith(href + "/");
    }

    const newExpanded = new Set<string>()
    const currentVisibleItems = filterMenuItems(menuItems)
    
    currentVisibleItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.href && isActive(child.href)
        )
        if (hasActiveChild) {
          newExpanded.add(item.title)
        }
      }
    })
    
    setExpandedItems(newExpanded)
  }, [pathname])

  // Função isActive para uso no render
  const isActive = (href: string) => {
    
    if (pathname === href) return true;
    
    // Para evitar conflitos, verificamos se o pathname começa com href + "/"
    // mas não é apenas uma substring de uma rota maior
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
      
      // Verificar permissões por título do menu usando o novo sistema
      switch (item.title) {
        case "Gestão de Alunos":
          return canAccess.gestaoAlunos();
        case "Gestão Acadêmica":
          return canAccess.gestaoAcademica() || canAccess.lancamentoNotas() || canAccess.visualizarNotas();
        case "Professores":
          return canAccess.professores();
        case "Financeiro":
          return canAccess.financeiro() || canAccess.pagamentos();
        case "Relatórios":
          return canAccess.relatoriosFinanceiros();
        case "Configurações":
          return canAccess.configuracoes();
        case "Meu Perfil":
          return canAccess.perfil();
        default:
          return true;
      }
    }).map(item => {
      // Se o item tem filhos, filtrar os filhos também
      if (item.children) {
        const filteredChildren = item.children.filter(child => {
          if (!child.href) return true;
          
          // Filtrar sub-itens financeiros especificamente
          if (item.title === "Financeiro") {
            if (child.href.includes('/pagamentos')) {
              return canAccess.pagamentos();
            }
            if (child.href.includes('/relatorios-vendas') || child.href.includes('/financial')) {
              return canAccess.relatoriosFinanceiros();
            }
            if (child.href.includes('/services') || child.href.includes('/credit-notes')) {
              return canAccess.financeiro(); // Configurações financeiras
            }
          }
          
          // Filtrar sub-itens de gestão acadêmica
          if (item.title === "Gestão Acadêmica") {
            const userType = user?.tipo || user?.tipoDesignacao || '';
            
            if (userType === 'Professor') {
              // Para professores, mostrar apenas "Minhas Turmas" e "Lançamento de Notas"
              if (child.href.includes('/minhas-turmas')) {
                return true;
              }
              if (child.title === "Lançamento de Notas") {
                return canAccess.lancamentoNotas();
              }
              // Ocultar todos os outros itens para professores
              return false;
            } else {
              // Para outros tipos de usuário (Admin, Secretaria, etc.)
              if (child.href.includes('/minhas-turmas')) {
                // "Minhas Turmas" apenas para professores
                return false;
              }
              if (child.title === "Lançamento de Notas") {
                // Ocultar "Lançamento de Notas" para administradores
                return !userInfo?.isAdmin && canAccess.lancamentoNotas();
              }
              // Mostrar outros itens baseado em permissões
              return canAccess.menuItem(child.href);
            }
          }
          
          // Filtrar sub-itens de configurações
          if (item.title === "Configurações") {
            if (child.href.includes('/periodos-lancamento')) {
              return canAccess.configuracoes();
            }
          }
          
          return canAccess.menuItem(child.href);
        });
        
        // Se não há filhos visíveis, não mostrar o item pai
        if (filteredChildren.length === 0 && item.children.length > 0) {
          return null;
        }
        
        return { ...item, children: filteredChildren };
      }
      
      return item;
    }).filter(Boolean) as MenuItem[];
  }

  const visibleMenuItems = filterMenuItems(menuItems);

  const SidebarContent = () => (
    <div className={cn(
      "flex h-full flex-col bg-white shadow-lg transition-all duration-300 border-r border-gray-200",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header com logo */}
      <div className="flex h-20 items-center px-4 bg-white border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-12 w-12 border-1 rounded-2xl flex items-center justify-center">
                <Image
                  src={icon}
                  alt="Complexo Abilio Junqueira Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">Complexo Abilio Junqueira</span>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-[#D2B48C] font-semibold">Sistema Escolar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1">
            {visibleMenuItems.map((item) => {
              if (!item.children) {
                // Item simples
                return (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={item.href || "#"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-11 rounded-lg transition-all duration-200",
                            isCollapsed ? "justify-center px-2" : "px-3",
                            item.href && isActive(item.href) 
                              ? "bg-gray-100 text-gray-900" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            !isCollapsed && "mr-3",
                            item.href && isActive(item.href) 
                              ? "text-gray-900" 
                              : "text-gray-500"
                          )} />
                          {!isCollapsed && (
                            <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              }

              // Item com submenu
              const isExpanded = expandedItems.has(item.title)
              const shouldShowParentActive = false // Pai nunca fica ativo quando há filhos ativos

              return (
                <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-11 rounded-lg transition-all duration-200",
                            isCollapsed ? "justify-center px-2" : "px-3",
                            shouldShowParentActive 
                              ? "bg-gray-100 text-gray-900 border border-[#D2B48C]" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            !isCollapsed && "mr-3",
                            shouldShowParentActive 
                              ? "text-[#D2B48C]" 
                              : "text-gray-500"
                          )} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                              <div className={cn(
                                "ml-2 transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )}>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {!isCollapsed && (
                    <CollapsibleContent className="space-y-1 overflow-hidden">
                      <div className="ml-6 space-y-1 relative">
                        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200"></div>
                        {item.children?.map((child) => (
                          child.href ? (
                          <Link
                            key={child.href}
                            href={child.href}
                            prefetch={true}
                            className={cn(
                              "flex items-center space-x-3 px-4 py-2 text-sm rounded-lg transition-all duration-200 hover:bg-gray-100 hover:text-gray-900",
                              pathname === child.href
                                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                                : "text-gray-600"
                            )}
                          >
                            <div className={cn(
                              "absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-200",
                              child.href && isActive(child.href) 
                                ? "bg-[#D2B48C]" 
                                : "bg-gray-300"
                            )}></div>
                            <child.icon className={cn(
                              "h-4 w-4 mr-3 ml-2 transition-colors duration-200",
                              child.href && isActive(child.href) 
                                ? "text-[#D2B48C]" 
                                : "text-gray-500"
                            )} />
                            <span className="flex-1 text-left text-xs">{child.title}</span>
                          </Link>
                          ) : null
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )
            })}
          </div>
        </TooltipProvider>
      </nav>

      {/* Footer com informações do sistema e logout */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-4 bg-white">
          {/* Version and Copyright */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#D2B48C]" />
              <span className="text-sm font-bold text-[#D2B48C]">v2.1.0 Pro</span>
            </div>
            <div className="text-xs text-gray-500">
              © 2025 Complexo Abilio Junqueira - Gestão Escolar
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full border-gray-300 bg-white text-gray-600 hover:bg-red-200 hover:text-white hover:border-red-200 transition-all duration-200"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Terminar Sessão
          </Button>
        </div>
      )}

      {/* Collapsed Footer */}
      {isCollapsed && (
        <div className="border-t border-gray-200 px-2 py-4 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full h-10 border-gray-300 bg-white text-gray-600 hover:bg-red-200 hover:text-white hover:border-red-200 p-0"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Terminar Sessão
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )

  return <SidebarContent />
}