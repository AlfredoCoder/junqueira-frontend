'use client';

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users, Plus, MoreHorizontal, Edit, Trash2, Eye,
  GraduationCap, Mail, Phone, Calendar, BookOpen,
  ChevronLeft, ChevronRight, UserCheck
} from 'lucide-react';

import StatCard from '@/components/layout/StatCard';
import { WelcomeHeader } from '@/components/dashboard';
import { IProfessor, IProfessorInput } from '@/types/professor.types';


// Opções de especialidades serão geradas dinamicamente

export default function ListTeacherPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [especialidadeFilter, setEspecialidadeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const router = useRouter();

  const { statusOptions } = useFilterOptions();

  // Estados para exclusão
  const [docenteToDelete, setDocenteToDelete] = useState<IDocente | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null>(null);

  const { deleteDocente, loading: deleteLoading, error: deleteError } = useDeleteDocente();

  // Debounce do searchTerm para evitar muitas requisições
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Resetar para primeira página ao buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Usar o hook com busca via API
  const { docentes, loading, pagination } = useDocentes(
    currentPage,
    itemsPerPage,
    debouncedSearch
  );
  const { especialidades } = useEspecialidades();

  // Gerar opções de especialidades dinamicamente
  const especialidadeOptions = [
    { value: "all", label: "Todas as Especialidades" },
    ...especialidades.map(esp => ({
      value: esp.codigo.toString(),
      label: esp.designacao
    }))
  ];

  // Aplicar filtros locais apenas nos dados da página atual (já filtrados pela busca na API)
  const filteredDocentes = useMemo(() => {
    let filtered = docentes;

    // Filtro por status (local)
    if (statusFilter !== "all") {
      filtered = filtered.filter((docente: IDocente) =>
        docente.status.toString() === statusFilter
      );
    }

    // Filtro por especialidade (local)
    if (especialidadeFilter !== "all") {
      filtered = filtered.filter((docente: IDocente) => {
        if (!docente.tb_especialidade) return false;
        return docente.tb_especialidade.codigo.toString() === especialidadeFilter;
      });
    }

    return filtered;
  }, [statusFilter, especialidadeFilter, docentes]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentDocentes = filteredDocentes; // Dados da página atual com filtros locais aplicados
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredDocentes.length;

  const handleEditTeacher = useCallback((teacherId: number) => {
    window.location.href = `/admin/teacher-management/teacher/edit/${teacherId}`;
  }, []);
  // Handler para abrir modal de exclusão
  const handleDeleteClick = useCallback((docente: IDocente) => {
    setDocenteToDelete(docente);
    setDeleteResult(null);
    setDeleteModalOpen(true);
  }, []);
  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!docenteToDelete) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await deleteDocente(docenteToDelete.codigo) as any;
      
      // Se chegou aqui, a exclusão foi bem-sucedida
      toast.success('Docente excluído com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: response?.tipo || 'hard_delete',
        detalhes: response?.detalhes || {},
        info: response?.info || 'Docente excluído com sucesso'
      });

      // Recarregar a lista após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      // O erro já foi tratado e exibido pelo hook
      console.error('Erro ao excluir docente:', error);
    }
  };

  // Handler para fechar modal de exclusão
  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setDocenteToDelete(null);
      setDeleteResult(null);
    }
  }, []);

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Docentes"
        titleBtnRight='Novo Docente'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/teacher-management/teacher/add'}
        description='Gerencie todos os docentes da instituição.'
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Professores"
          value={totalItems.toString()}
          change={`${pagination?.itemsPerPage || 0} por página`}
          changeType="neutral"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Docentes na Página"
          value={currentDocentes.length.toString()}
          change={`de ${itemsPerPage} possíveis`}
          changeType="neutral"
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Com Disciplinas"
          value={currentDocentes.filter((d: IDocente) => {
            const count = d._count?.tb_disciplinas_docente || 0;
            const arrayLength = d.tb_disciplinas_docente?.length || 0;
            return count > 0 || arrayLength > 0;
          }).length.toString()}
          change="na página atual"
          changeType="neutral"
          icon={BookOpen}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages}`}
          change={`${totalItems} total`}
          changeType="neutral"
          icon={GraduationCap}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, email, telefone, documento, especialidade..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-48"
          },
          {
            label: "Especialidade",
            value: especialidadeFilter,
            onChange: setEspecialidadeFilter,
            options: especialidadeOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Professores */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Docentes
            {debouncedSearch && ` - Resultados para "${debouncedSearch}"`}
          </CardTitle>
          <CardDescription>
            Mostrando {startIndex} a {endIndex} de {totalItems} docentes | Página {currentPage} de {totalPages}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Experiência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59] loading-spinner"></div>
                        <span>Carregando página {currentPage}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentDocentes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2 ultra-fast-fade">
                        <Users className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum docente encontrado</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDocentes.map((teacher: IDocente, index: number) => (
                    <TableRow key={teacher.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {teacher.nome.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.nome}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                ID: {teacher.user_id || 'N/A'}
                              </span>
                              <span>Status: {teacher.status === 1 ? 'Ativo' : 'Inativo'}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 ultra-fast-fade">
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{teacher.email}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-2 text-gray-400" />
                            <span className="text-gray-600">{teacher.contacto || 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 ultra-fast-fade">
                          <p className="text-xs text-gray-500">ID Utilizador: {teacher.codigo_Utilizador}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 ultra-fast-fade">
                          <p className="text-sm font-medium">{teacher.tb_especialidade?.designacao || 'N/A'}</p>
                          <p className="text-xs text-gray-500">
                            {teacher._count?.tb_disciplinas_docente || teacher.tb_disciplinas_docente?.length || 0} disciplina(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 ultra-fast-fade">
                          <p className="text-sm font-medium">
                            {teacher._count?.tb_disciplinas_docente || teacher.tb_disciplinas_docente?.length || 0} disciplina(s)
                          </p>
                          <p className="text-xs text-gray-500">
                            {teacher._count?.tb_directores_turmas || teacher.tb_directores_turmas?.length || 0} turma(s) dirigida(s)
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={teacher.status === 1 ? "default" : "secondary"}
                          className={teacher.status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {teacher.status === 1 ? "Ativo" : "Inativo"}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/teacher-management/teacher/details/${teacher.codigo || 0}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTeacher(teacher.codigo || 0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(teacher)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} docentes
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);

                    const pages = [];

                    // Primeira página
                    if (adjustedStartPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={loading}
                        >
                          1
                        </Button>
                      );
                      if (adjustedStartPage > 2) {
                        pages.push(<span key="ellipsis1" className="px-2">...</span>);
                      }
                    }

                    // Páginas do meio
                    for (let i = adjustedStartPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i)}
                          disabled={loading}
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Última página
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loading}
                        >
                          {totalPages}
                        </Button>
                      );
                    }

                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDeleteDocenteModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        docenteItem={docenteToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />
    </div>
  );
}
