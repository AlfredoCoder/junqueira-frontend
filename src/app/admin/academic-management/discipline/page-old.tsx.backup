"use client";

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  List,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { DisciplineModal } from '@/components/discipline/discipline-modal';
import { ConfirmDeleteDisciplineModal } from '@/components/discipline/confirm-delete-discipline-modal';

import { useDisciplines, useDisciplineStatistics, useDeleteDiscipline } from '@/hooks/useDiscipline';
import { useCourses } from '@/hooks/useCourse';
import { IDiscipline } from '@/types/discipline.types';

import { useFilterOptions } from '@/hooks/useFilterOptions';


export default function ListDisciplinePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tipoFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedDiscipline, setSelectedDiscipline] = useState<IDiscipline | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Estados para exclusão
  const [disciplineToDelete, setDisciplineToDelete] = useState<{
    codigo: number;
    designacao: string;
    status: number;
    tb_cursos?: { designacao: string };
  } | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null>(null);

  const { disciplines, loading, pagination, refetch } = useDisciplines(currentPage, itemsPerPage, searchTerm);
  const { courses } = useCourses(1, 100);
  const { statistics, loading: statsLoading } = useDisciplineStatistics();
  const { deleteDiscipline, loading: deleteLoading, error: deleteError } = useDeleteDiscipline();

  const { statusOptions } = useFilterOptions();

  const [filteredDisciplines, setFilteredDisciplines] = useState<IDiscipline[]>([]);

  // Filtrar disciplinas localmente se necessário
  useEffect(() => {
    let filtered = disciplines;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((discipline: IDiscipline) =>
        discipline.status.toString() === statusFilter
      );
    }

    // Filtro por tipo (cadeira específica)
    if (tipoFilter !== "all") {
      filtered = filtered.filter((discipline: IDiscipline) =>
        (discipline.cadeiraEspecifica || 0).toString() === tipoFilter
      );
    }

    setFilteredDisciplines(filtered);
  }, [statusFilter, tipoFilter, disciplines]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tipoFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentDisciplines = filteredDisciplines; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredDisciplines.length;

  const handleCreateDiscipline = () => {
    setSelectedDiscipline(null);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    refetch();
    setShowModal(false);
    setSelectedDiscipline(null);
  };

  // Handler para abrir modal de exclusão
  const handleDeleteClick = (discipline: IDiscipline) => {
    setDisciplineToDelete({
      codigo: discipline.codigo,
      designacao: discipline.designacao,
      status: discipline.status || 0,
      tb_cursos: discipline.tb_cursos
    });
    setDeleteResult(null);
    setDeleteModalOpen(true);
  };

  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!disciplineToDelete) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await deleteDiscipline(disciplineToDelete.codigo) as any;
      
      // Se chegou aqui, a exclusão foi bem-sucedida
      toast.success('Disciplina excluída com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: response?.tipo || 'hard_delete',
        detalhes: response?.detalhes || {},
        info: response?.info || 'Disciplina excluída com sucesso'
      });

      // Recarregar a lista após 2 segundos
      setTimeout(() => {
        refetch();
        setDeleteModalOpen(false);
        setDisciplineToDelete(null);
        setDeleteResult(null);
      }, 2000);
      
    } catch (error) {
      // O erro já foi tratado e exibido pelo hook
      console.error('Erro ao excluir disciplina:', error);
    }
  };

  // Handler para fechar modal de exclusão
  const handleCloseDeleteModal = () => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setDisciplineToDelete(null);
      setDeleteResult(null);
    }
  };



  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Disciplinas"
        description="Gerencie todas as disciplinas da instituição. Visualize informações detalhadas e mantenha os dados sempre atualizados."
        titleBtnRight='Nova Disciplina'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={handleCreateDiscipline}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Disciplinas"
          value={statsLoading ? "..." : (statistics?.totalDisciplinas || 0).toString()}
          change="+4.2%"
          changeType="up"
          icon={BookOpen}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Disciplinas Ativas"
          value={statsLoading ? "..." : (statistics?.disciplinasAtivas || 0).toString()}
          change="+2.1%"
          changeType="up"
          icon={GraduationCap}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Disciplinas Específicas"
          value={statsLoading ? "..." : (statistics?.disciplinasEspecificas || 0).toString()}
          change="+1.2%"
          changeType="up"
          icon={BookOpen}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <StatCard
          title="Disciplinas Inativas"
          value={statsLoading ? "..." : (statistics?.disciplinasInativas || 0).toString()}
          change="-0.8%"
          changeType="down"
          icon={Clock}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome da disciplina..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Disciplinas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Disciplinas da Página {currentPage} ({filteredDisciplines.length} de {itemsPerPage})
              </CardTitle>
              <CardDescription>
                Página {currentPage} de {totalPages} - Total: {totalItems} disciplinas
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4 mr-2" />
                Tabela
              </Button>
              <Button
                variant={viewMode === 'cards' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Cards
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                          <span>Carregando página {currentPage}...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : currentDisciplines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <BookOpen className="h-12 w-12 text-gray-400" />
                          <p className="text-gray-500">Nenhuma disciplina encontrada</p>
                          <p className="text-sm text-gray-400">
                            Tente ajustar os filtros de busca
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentDisciplines.map((discipline, index) => (
                      <TableRow key={discipline.codigo || index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {startIndex + index}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold text-xs">
                              {discipline.designacao.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">{discipline.designacao}</p>
                              <p className="text-sm text-gray-500">ID: {discipline.codigo}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {discipline.codigo}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-sm">
                                {discipline.tb_cursos?.designacao && discipline.tb_cursos.designacao.trim()
                                  ? discipline.tb_cursos.designacao
                                  : `Curso ID ${discipline.codigo_Curso}`}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">Código: {discipline.codigo_Curso}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={discipline.cadeiraEspecifica === 1 ? "default" : "secondary"}
                            className={discipline.cadeiraEspecifica === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                          >
                            {discipline.cadeiraEspecifica === 1 ? "Específica" : "Geral"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={discipline.status === 1 ? "default" : "secondary"}
                            className={discipline.status === 1 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}
                          >
                            {discipline.status === 1 ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {discipline.tb_grade_curricular && discipline.tb_grade_curricular.length > 0 ? (
                            <Badge
                              variant="default"
                              className="bg-orange-100 text-orange-800 text-xs"
                            >
                              Na Grade ({discipline.tb_grade_curricular.length})
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 text-xs"
                            >
                              Livre
                            </Badge>
                          )}
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => { setSelectedDiscipline(discipline); setShowModal(true) }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteClick(discipline)}
                                className="text-red-600 focus:text-red-600"
                              >
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
          ) : (
            // Visualização em Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                // Loading skeleton para cards
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg border p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : currentDisciplines.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">Nenhuma disciplina encontrada</p>
                    <p className="text-sm text-gray-400">
                      Tente ajustar os filtros de busca
                    </p>
                  </div>
                </div>
              ) : (
                currentDisciplines.map((discipline, index) => (
                  <Card key={discipline.codigo || index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold text-xs">
                            {discipline.designacao.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 text-sm truncate">{discipline.designacao}</p>
                            <p className="text-xs text-gray-500">ID: {discipline.codigo}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => { setSelectedDiscipline(discipline); setShowModal(true) }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(discipline)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Curso:</span>
                          <span className="text-xs font-medium">
                            {discipline.tb_cursos?.designacao && discipline.tb_cursos.designacao.trim()
                              ? discipline.tb_cursos.designacao
                              : `Curso ID ${discipline.codigo_Curso}`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Tipo:</span>
                          <Badge
                            variant={discipline.cadeiraEspecifica === 1 ? "default" : "secondary"}
                            className={`text-xs ${discipline.cadeiraEspecifica === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {discipline.cadeiraEspecifica === 1 ? "Específica" : "Geral"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Status:</span>
                          <Badge
                            variant={discipline.status === 1 ? "default" : "secondary"}
                            className={`text-xs ${discipline.status === 1 ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                          >
                            {discipline.status === 1 ? "Ativa" : "Inativa"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Grade:</span>
                          {discipline.tb_grade_curricular && discipline.tb_grade_curricular.length > 0 ? (
                            <Badge
                              variant="default"
                              className="bg-orange-100 text-orange-800 text-xs"
                            >
                              Na Grade ({discipline.tb_grade_curricular.length})
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600 text-xs"
                            >
                              Livre
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} disciplinas
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

      {/* Modal de Disciplina */}
      <DisciplineModal
        open={showModal}
        onOpenChange={setShowModal}
        discipline={selectedDiscipline}
        courses={courses}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteDisciplineModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        discipline={disciplineToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />
    </Container>
  );
}
