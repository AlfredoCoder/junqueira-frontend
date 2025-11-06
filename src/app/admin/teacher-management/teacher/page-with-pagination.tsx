'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'react-toastify';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users, Plus, MoreHorizontal, Edit, Trash2, Eye,
  GraduationCap, Mail, Phone, Calendar, BookOpen,
  ChevronLeft, ChevronRight, UserCheck, Loader2
} from 'lucide-react';

import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { WelcomeHeader } from '@/components/dashboard';
import { useDocentes } from '@/hooks/useTeacher';

export default function ProfessoresPage() {
  const router = useRouter();
  
  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Hook com paginação
  const { docentes, loading, error, pagination, refetch } = useDocentes(
    currentPage,
    itemsPerPage,
    debouncedSearchTerm
  );

  // Handlers para paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Opções para filtros
  const statusOptions = [
    { value: "all", label: "Todos os Status" },
    { value: "Activo", label: "Ativo" },
    { value: "Inactivo", label: "Inativo" }
  ];

  const getStatusBadge = (status: string) => {
    return status === 'Activo' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <UserCheck className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        Inativo
      </Badge>
    );
  };

  // Filtrar por status no frontend (se necessário)
  const filteredDocentes = docentes?.filter((professor: any) => {
    if (statusFilter !== "all") {
      return professor.status === statusFilter;
    }
    return true;
  }) || [];

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando professores...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title="Gestão de Professores"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total de Professores"
          value={pagination?.totalItems || 0}
          icon={Users}
          description="Professores cadastrados"
        />
        <StatCard
          title="Professores Ativos"
          value={filteredDocentes.filter((p: any) => p.status === 'Activo').length}
          icon={UserCheck}
          description="Em atividade"
        />
        <StatCard
          title="Disciplinas"
          value={filteredDocentes.reduce((acc: number, p: any) => acc + (p.tb_professor_disciplina?.length || 0), 0)}
          icon={BookOpen}
          description="Total de atribuições"
        />
        <StatCard
          title="Turmas"
          value={filteredDocentes.reduce((acc: number, p: any) => acc + (p.tb_professor_turma?.length || 0), 0)}
          icon={GraduationCap}
          description="Turmas atribuídas"
        />
      </div>

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, email, especialidade..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-[180px]"
          }
        ]}
        isSearching={loading}
      />

      {/* Tabela de Professores */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lista de Professores</span>
            {pagination && (
              <span className="text-sm text-gray-500">
                ({pagination.totalItems} total)
              </span>
            )}
          </CardTitle>
          <Button 
            onClick={() => router.push('/admin/teacher-management/teacher/add')}
            className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Professor
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <span>Erro ao carregar professores: {error}</span>
            </div>
          ) : filteredDocentes && filteredDocentes.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Formação</TableHead>
                    <TableHead>Disciplinas</TableHead>
                    <TableHead>Turmas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocentes.map((professor: any) => (
                    <TableRow key={professor.codigo}>
                      <TableCell className="font-medium">
                        {professor.codigo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{professor.nome}</p>
                          <p className="text-sm text-gray-500">
                            {professor.numeroFuncionario && `Nº ${professor.numeroFuncionario}`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {professor.email}
                          </div>
                          {professor.telefone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1 text-gray-400" />
                              {professor.telefone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{professor.formacao}</p>
                          <p className="text-xs text-gray-500">{professor.nivelAcademico}</p>
                          {professor.especialidade && (
                            <p className="text-xs text-blue-600">{professor.especialidade}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {professor.tb_professor_disciplina?.length || 0} disciplinas
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {professor.tb_professor_turma?.length || 0} turmas
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(professor.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/teacher-management/teacher/edit/${professor.codigo}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/teacher-management/discpline-teacher?professor=${professor.codigo}`)}
                            >
                              <BookOpen className="mr-2 h-4 w-4" />
                              Atribuições
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Controles de Paginação */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-700">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de {pagination.totalItems} resultados
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    
                    <span className="text-sm">
                      Página {currentPage} de {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum professor encontrado</p>
              <p className="text-sm">Clique em "Novo Professor" para adicionar o primeiro professor</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
