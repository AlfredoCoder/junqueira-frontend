"use client";

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
  Plus,
  MoreHorizontal,
  Edit,
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import { useMatriculas, useMatriculasStatistics, useDeleteMatricula } from '@/hooks/useMatricula';
import { ConfirmDeleteEnrollmentModal } from '@/components/enrollment/confirm-delete-enrollment-modal';

import { useRouter } from 'next/navigation';
import StatCard from '@/components/layout/StatCard';
import { WelcomeHeader } from '@/components/dashboard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { calculateAge } from '@/utils/calculateAge.utils';
import { useFilterOptions } from '@/hooks/useFilterOptions';
import { toast } from 'react-toastify';

export default function EnrollmentsListPage() {
  const router = useRouter();

  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  
  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Passar filtros para o hook - agora a filtragem é feita no backend
  const { matriculas, pagination, loading, error, refetch } = useMatriculas(
    currentPage, 
    itemsPerPage, 
    debouncedSearchTerm,
    statusFilter,
    courseFilter
  );

  // Hook para estatísticas - também filtra no backend
  const { statistics, loading: statsLoading } = useMatriculasStatistics(statusFilter, courseFilter);

  const router = useRouter();
  const { statusOptions, courseOptions } = useFilterOptions();

  // Hook para exclusão de matrícula
  const { deleteMatricula, loading: deleteLoading, error: deleteError } = useDeleteMatricula();

  // Estados do modal de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<{
    codigo: number;
    alunoNome: string;
    cursoNome: string;
    dataMatricula: string;
    hasConfirmacoes: boolean;
  } | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean>;
    info?: string;
  } | null>(null);

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset para primeira página quando buscar
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, courseFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  // Handler para abrir modal de exclusão
  const handleDeleteClick = useCallback((enrollment: typeof matriculas[0]) => {
    setEnrollmentToDelete({
      codigo: enrollment.codigo,
      alunoNome: enrollment.tb_alunos.nome,
      cursoNome: enrollment.tb_cursos.designacao,
      dataMatricula: enrollment.data_Matricula,
      hasConfirmacoes: !!(enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0)
    });
    setDeleteResult(null);
    setDeleteModalOpen(true);
  }, []);
  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!enrollmentToDelete) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await deleteMatricula(enrollmentToDelete.codigo) as any;
      
      toast.success('Matrícula excluída com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: 'cascade_delete',
        detalhes: response?.detalhes || {},
        info: response?.info || 'Matrícula excluída com sucesso'
      });

      // Recarregar a lista após 2 segundos
      setTimeout(() => {
        refetch();
        setDeleteModalOpen(false);
        setEnrollmentToDelete(null);
        setDeleteResult(null);
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir matrícula';
      console.error('Erro ao excluir matrícula:', error);
      toast.error(errorMessage);
    }
  };

  // Handler para fechar modal
  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setEnrollmentToDelete(null);
      setDeleteResult(null);
    }
  }, []);
  return (
    <div className="space-y-6 ultra-fast-fade">

      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Matrículas"
        description="erencie todas as matrículas dos alunos. Visualize informações detalhadas, acompanhe confirmações e mantenha os registros sempre atualizados."
        titleBtnRight=' Nova Matrícula'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/student-management/enrolls/add'}
      />

      {/* Stats Cards seguindo padrão do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {/* Card Total de Matrículas */}

        <StatCard
          title="Total de Matrículas"
          value={statsLoading ? "..." : (statistics?.total || pagination?.totalItems || 0).toString()}
          change="Total"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Matrículas Ativas"
          value={statsLoading ? "..." : (statistics?.ativas || 0).toString()}
          change="Ativos"
          changeType="up"
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Matrículas Com Confirmação"
          value={statsLoading ? "..." : (statistics?.comConfirmacao || 0).toString()}
          change="Confirmação"
          changeType="up"
          icon={BookOpen}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />

        <StatCard
          title="Matrículas Sem Confirmação"
          value={statsLoading ? "..." : (statistics?.semConfirmacao || 0).toString()}
          change="Atenção"
          changeType="up"
          icon={Clock}
          color="text-[#FF4D4D]"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600 "
        />
      </div>

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por aluno ou curso..."
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
            label: "Curso",
            value: courseFilter,
            onChange: setCourseFilter,
            options: courseOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Matrículas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Matrículas</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Data Matrícula</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confirmação</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F9CD1D] loading-spinner" />
                      <p className="mt-2 text-gray-600">Carregando matrículas...</p>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={() => refetch()} variant="outline">
                        Tentar novamente
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : matriculas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2 ultra-fast-fade">
                        <AlertCircle className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-600">
                          {searchTerm || statusFilter !== "all" || courseFilter !== "all"
                            ? "Nenhuma matrícula encontrada com os filtros aplicados."
                            : "Nenhuma matrícula encontrada."}
                        </p>
                        {(searchTerm || statusFilter !== "all" || courseFilter !== "all") && (
                          <p className="text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  matriculas.map((enrollment) => (
                    <TableRow key={enrollment.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{enrollment.tb_alunos.nome}</p>
                            <p className="text-sm text-gray-500">
                              {enrollment.tb_alunos.dataNascimento ? calculateAge(enrollment.tb_alunos.dataNascimento) : 'N/A'} anos • {enrollment.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.tb_cursos.designacao}</p>
                          <p className="text-sm text-gray-500">{enrollment.tb_cursos.duracao}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{formatDate(enrollment.data_Matricula)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={enrollment.codigoStatus === 1 ? "default" : "secondary"}
                          className={enrollment.codigoStatus === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {enrollment.codigoStatus === 1 ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 ? (
                          <Badge variant="default" className="bg-blue-100 text-blue-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirmada
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pendente
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 ? (
                          <div>
                            <p className="text-sm font-medium">{enrollment.tb_confirmacoes[0].tb_turmas.designacao}</p>
                            <p className="text-xs text-gray-500">{enrollment.tb_confirmacoes[0].tb_turmas.tb_classes.designacao}</p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Não atribuída</span>
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
                            <DropdownMenuItem onClick={() => router.push(`/admin/student-management/enrolls/edit/${enrollment.codigo}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(enrollment)}
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
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} matrículas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
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
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }

                    // Última página
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={pagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(pagination.totalPages)}
                        >
                          {pagination.totalPages}
                        </Button>
                      );
                    }

                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages || loading}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteEnrollmentModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        enrollment={enrollmentToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />

    </div>
  );
}
