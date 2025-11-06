"use client";

import React, { useCallback, useState, useEffect } from 'react';
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
  GraduationCap,
  Plus,
  MoreHorizontal,
  Edit,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
// import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { CourseModal } from '@/components/course/course-modal';
import { ConfirmDeleteCourseModal } from '@/components/course/confirm-delete-course-modal';
import { useFilterOptions } from "@/hooks/useFilterOptions"

import { useCourses, useDeleteCourse, useCreateCourse, useUpdateCourse, /*useCourseStats*/ } from '@/hooks/useCourse';
import { ICourse } from '@/types/course.types';
import { toast } from 'react-toastify';

export default function ListCoursePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hooks para gerenciamento de cursos
  const { courses = [], pagination, loading, refetch } = useCourses(currentPage, itemsPerPage, searchTerm);
  // const { stats } = useCourseStats();

  // Hook para exclusão de curso
  const { deleteCourse, loading: deleteLoading, error: deleteError } = useDeleteCourse();
  
  // Estados do modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  
  // Hooks para criação e edição
  const { createCourse, loading: createLoading } = useCreateCourse();
  const { updateCourse, loading: updateLoading } = useUpdateCourse(selectedCourse?.codigo || 0);

  const { statusOptions } = useFilterOptions();
  
  // Estados do modal de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<{
    codigo: number;
    designacao: string;
    status: number;
  } | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null>(null);
  
  // Filtros locais (aplicados nos dados já paginados da API)
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

  // Aplicar filtros locais nos dados da página atual
  useEffect(() => {
    let filtered = courses;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter((course: ICourse) => 
        course.codigo_Status?.toString() === statusFilter
      );
    }

    setFilteredCourses(filtered);
  }, [courses, statusFilter]);

  // Paginação usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredCourses.length;

  // Handlers do modal
  const handleAddCourse = useCallback(() => {
    setSelectedCourse(null);
    setCourseModalOpen(true);
  }, []);
  const handleEditCourse = useCallback((course: ICourse) => {
    setSelectedCourse(course);
    setCourseModalOpen(true);
  }, []);
  // Handler para submissão do modal (criar/editar)
  const handleCourseSubmit = useCallback(async (data: { designacao: string; codigo_Status: number }) => {
    try {
      if (selectedCourse) {
        // Editar curso existente
        await updateCourse(data);
        toast.success('Curso atualizado com sucesso!');
      } else {
        // Criar novo curso
        await createCourse(data);
        toast.success('Curso criado com sucesso!');
      }
      
      // Fechar modal e recarregar dados
      setCourseModalOpen(false);
      setSelectedCourse(null);
      refetch();
    } catch (error) {
      // Erro já tratado pelos hooks
      console.error('Erro ao salvar curso:', error);
    }
  }, [selectedCourse, updateCourse, createCourse, refetch]);
  // Handler para abrir modal de exclusão
  const handleDeleteClick = useCallback((course: ICourse) => {
    setCourseToDelete({
      codigo: course.codigo,
      designacao: course.designacao,
      status: course.codigo_Status || 0
    });
    setDeleteResult(null);
    setDeleteModalOpen(true);
  }, []);
  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await deleteCourse(courseToDelete.codigo) as any;
      
      // Se chegou aqui, a exclusão foi bem-sucedida
      toast.success('Curso excluído com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: response?.tipo || 'hard_delete',
        detalhes: response?.detalhes || {},
        info: response?.info || 'Curso excluído com sucesso'
      });

      // Recarregar a lista após 2 segundos
      setTimeout(() => {
        refetch();
        setDeleteModalOpen(false);
        setCourseToDelete(null);
        setDeleteResult(null);
      }, 2000);
      
    } catch (error) {
      // O erro já foi tratado e exibido pelo hook
      // Apenas garantir que o modal não feche
      console.error('Erro ao excluir curso:', error);
    }
  };

  // Handler para fechar modal de exclusão
  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setCourseToDelete(null);
      setDeleteResult(null);
    }
  }, []);
  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Cursos"
        description="Gerencie todos os cursos oferecidos pela instituição. Adicione, edite e organize cursos de forma eficiente."
        titleBtnRight='Novo Curso'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={handleAddCourse}
      />

      {/* Stats Cards usando componente StatCard */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Cursos"
          value={(stats ? stats.total : totalItems).toString()}
          change="+5.2%"
          changeType="up"
          icon={GraduationCap}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Cursos Ativos"
          value={(stats ? stats.active : courses.filter((c: ICourse) => c.codigo_Status === 1).length).toString()}
          change="+2.1%"
          changeType="up"
          icon={BookOpen}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Cursos Inativos"
          value={(stats ? stats.inactive : courses.filter((c: ICourse) => c.codigo_Status === 0).length).toString()}
          change="+1.2%"
          changeType="up"
          icon={Users}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages}`}
          change="Paginação"
          changeType="neutral"
          icon={Activity}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div> */}

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome do curso..."
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

      {/* Tabela de Cursos */}
      <Card>
        <CardHeader>
          <CardTitle>
            Cursos da Página {currentPage} ({filteredCourses.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - Total: {totalItems} cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59] loading-spinner"></div>
                        <span>Carregando cursos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2 ultra-fast-fade">
                        <GraduationCap className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhum curso encontrado</p>
                        <p className="text-sm text-gray-400">
                          {searchTerm ? 'Tente buscar por outro termo' : 'Comece adicionando um novo curso'}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course: ICourse, index: number) => (
                    <TableRow key={course.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {course.designacao.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{course.designacao}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {course.codigo || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={course.codigo_Status === 1 ? "default" : "secondary"}
                          className={course.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {course.codigo_Status === 1 ? "Ativo" : "Inativo"}
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(course)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} cursos
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

      {/* Modal para adicionar/editar curso */}
      <CourseModal
        open={courseModalOpen}
        onOpenChange={setCourseModalOpen}
        course={selectedCourse}
        onSubmit={handleCourseSubmit}
        loading={createLoading || updateLoading}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteCourseModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        course={courseToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />

    </div>
  );
}
