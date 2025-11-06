"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

  // Estados para modais
  const [selectedMatricula, setSelectedMatricula] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hooks da API com paginação
  const { matriculas, pagination, loading, error, refetch } = useMatriculas(
    currentPage, 
    itemsPerPage, 
    debouncedSearchTerm,
    statusFilter === "all" ? null : statusFilter,
    courseFilter === "all" ? null : courseFilter
  );
  
  const { statistics, loading: statsLoading } = useMatriculasStatistics();
  const { deleteMatricula, loading: deleteLoading } = useDeleteMatricula();

  // Handlers para paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, courseFilter]);

  // Handler para exclusão
  const handleDelete = async (matricula: any) => {
    setSelectedMatricula(matricula);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMatricula) return;

    try {
      await deleteMatricula(selectedMatricula.codigo);
      toast.success('Matrícula excluída com sucesso!');
      setShowDeleteModal(false);
      setSelectedMatricula(null);
      refetch();
    } catch (error) {
      toast.error('Erro ao excluir matrícula');
    }
  };

  // Opções para filtros
  const statusOptions = [
    { value: "all", label: "Todos os Status" },
    { value: "1", label: "Ativo" },
    { value: "0", label: "Inativo" }
  ];

  const courseOptions = [
    { value: "all", label: "Todos os Cursos" },
    { value: "1", label: "Informática" },
    { value: "2", label: "Contabilidade" },
    { value: "3", label: "Administração" }
  ];

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <Clock className="h-3 w-3 mr-1" />
        Inativo
      </Badge>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando matrículas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title="Gestão de Matrículas"
      />

      {/* Cards de Estatísticas */}
      {statistics && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total de Matrículas"
            value={statistics.total || 0}
            icon={Users}
            description="Matrículas cadastradas"
          />
          <StatCard
            title="Matrículas Ativas"
            value={statistics.ativas || 0}
            icon={CheckCircle}
            description="Em andamento"
          />
          <StatCard
            title="Matrículas Inativas"
            value={statistics.inativas || 0}
            icon={Clock}
            description="Suspensas ou canceladas"
          />
          <StatCard
            title="Este Mês"
            value={statistics.esteMes || 0}
            icon={Calendar}
            description="Novas matrículas"
          />
        </div>
      )}

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome do aluno, curso..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-[180px]"
          },
          {
            label: "Curso",
            value: courseFilter,
            onChange: setCourseFilter,
            options: courseOptions,
            width: "w-[200px]"
          }
        ]}
        isSearching={loading}
      />

      {/* Tabela de Matrículas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Lista de Matrículas</span>
            {pagination && (
              <span className="text-sm text-gray-500">
                ({pagination.totalItems} total)
              </span>
            )}
          </CardTitle>
          <Button 
            onClick={() => router.push('/admin/student-management/enrolls/add')}
            className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Matrícula
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Erro ao carregar matrículas: {error}</span>
            </div>
          ) : matriculas && matriculas.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data Matrícula</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {matriculas.map((matricula: any) => (
                    <TableRow key={matricula.codigo}>
                      <TableCell className="font-medium">
                        {matricula.codigo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{matricula.tb_alunos?.nome}</p>
                          <p className="text-sm text-gray-500">
                            {matricula.tb_alunos?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {matricula.tb_cursos?.designacao}
                      </TableCell>
                      <TableCell>
                        {new Date(matricula.data_Matricula).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(matricula.codigoStatus)}
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
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/student-management/enrolls/edit/${matricula.codigo}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(matricula)}
                            >
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
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma matrícula encontrada</p>
              <p className="text-sm">Clique em "Nova Matrícula" para adicionar a primeira matrícula</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      {selectedMatricula && (
        <ConfirmDeleteEnrollmentModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedMatricula(null);
          }}
          onConfirm={handleConfirmDelete}
          enrollment={{
            codigo: selectedMatricula.codigo,
            alunoNome: selectedMatricula.tb_alunos?.nome || 'N/A',
            cursoNome: selectedMatricula.tb_cursos?.designacao || 'N/A',
            dataMatricula: new Date(selectedMatricula.data_Matricula).toLocaleDateString('pt-BR'),
            isLastEnrollment: false
          }}
          isDeleting={deleteLoading}
        />
      )}
    </div>
  );
}
