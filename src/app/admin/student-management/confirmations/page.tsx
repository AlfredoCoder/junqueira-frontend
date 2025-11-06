"use client";

import React, { useState, useEffect } from 'react';
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
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Trash2,
} from 'lucide-react';

import { useConfirmations, useConfirmationsStatistics, useDeleteConfirmation } from '@/hooks/useConfirmation';
import { ConfirmDeleteConfirmationModal } from '@/components/confirmation/confirm-delete-confirmation-modal';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { toast } from 'react-toastify';

export default function ConfirmationsListPage() {
  const router = useRouter();

  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  
  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Estados para modais
  const [selectedConfirmation, setSelectedConfirmation] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Hooks da API com paginação
  const { confirmations, pagination, loading, error, refetch } = useConfirmations(
    currentPage,
    itemsPerPage,
    debouncedSearchTerm,
    statusFilter === "all" ? null : statusFilter,
    yearFilter === "all" ? null : yearFilter
  );
  
  const { statistics, loading: statsLoading } = useConfirmationsStatistics();
  const { deleteConfirmation, loading: deleteLoading } = useDeleteConfirmation();

  // Handlers para paginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, yearFilter]);

  // Handler para edição
  const handleEdit = (confirmation: any) => {
    console.log('🔧 Editando confirmação:', confirmation.codigo);
    router.push(`/admin/student-management/confirmations/edit/${confirmation.codigo}`);
  };

  // Handler para visualização
  const handleView = (confirmation: any) => {
    console.log('👁️ Visualizando confirmação:', confirmation.codigo);
    router.push(`/admin/student-management/confirmations/view/${confirmation.codigo}`);
  };

  // Handler para exclusão
  const handleDelete = async (confirmation: any) => {
    console.log('🗑️ Excluindo confirmação:', confirmation.codigo);
    setSelectedConfirmation(confirmation);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedConfirmation) return;

    console.log('✅ Confirmando exclusão da confirmação:', selectedConfirmation.codigo);
    
    try {
      await deleteConfirmation(selectedConfirmation.codigo);
      console.log('✅ Confirmação excluída com sucesso');
      toast.success('Confirmação excluída com sucesso!');
      setShowDeleteModal(false);
      setSelectedConfirmation(null);
      refetch();
    } catch (error) {
      console.error('❌ Erro ao excluir confirmação:', error);
      toast.error('Erro ao excluir confirmação');
    }
  };

  // Opções para filtros
  const statusOptions = [
    { value: "all", label: "Todos os Status" },
    { value: "1", label: "Ativo" },
    { value: "0", label: "Inativo" }
  ];

  const yearOptions = [
    { value: "all", label: "Todos os Anos" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" }
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

  const getClassificationBadge = (classification: string) => {
    const colors = {
      'Aprovado': 'bg-green-100 text-green-800 border-green-200',
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Reprovado': 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <Badge variant="outline" className={colors[classification as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {classification}
      </Badge>
    );
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando confirmações...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title="Gestão de Confirmações"
      />

      {/* Cards de Estatísticas */}
      {statistics && !statsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total de Confirmações"
            value={statistics.total || 0}
            icon={Users}
            description="Confirmações cadastradas"
          />
          <StatCard
            title="Confirmações Ativas"
            value={statistics.ativas || 0}
            icon={CheckCircle}
            description="Em andamento"
          />
          <StatCard
            title="Aprovados"
            value={statistics.aprovados || 0}
            icon={GraduationCap}
            description="Alunos aprovados"
          />
          <StatCard
            title="Este Mês"
            value={statistics.esteMes || 0}
            icon={Calendar}
            description="Novas confirmações"
          />
        </div>
      )}

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome do aluno, turma, classificação..."
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
            label: "Ano Letivo",
            value: yearFilter,
            onChange: setYearFilter,
            options: yearOptions,
            width: "w-[150px]"
          }
        ]}
        isSearching={loading}
      />

      {/* Tabela de Confirmações */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Lista de Confirmações</span>
            {pagination && (
              <span className="text-sm text-gray-500">
                ({pagination.totalItems} total)
              </span>
            )}
          </CardTitle>
          <Button 
            onClick={() => router.push('/admin/student-management/confirmations/add')}
            className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Confirmação
          </Button>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <span>Erro ao carregar confirmações: {error}</span>
            </div>
          ) : confirmations && confirmations.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Data Confirmação</TableHead>
                    <TableHead>Classificação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {confirmations.map((confirmation: any) => (
                    <TableRow key={confirmation.codigo}>
                      <TableCell className="font-medium">
                        {confirmation.codigo}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{confirmation.tb_matriculas?.tb_alunos?.nome}</p>
                          <p className="text-sm text-gray-500">
                            {confirmation.tb_matriculas?.tb_alunos?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {confirmation.tb_turmas?.designacao}
                      </TableCell>
                      <TableCell>
                        {new Date(confirmation.data_Confirmacao).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        {getClassificationBadge(confirmation.classificacao)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(confirmation.codigo_Status)}
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
                            <DropdownMenuItem onClick={() => handleView(confirmation)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(confirmation)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDelete(confirmation)}
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
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma confirmação encontrada</p>
              <p className="text-sm">Clique em "Nova Confirmação" para adicionar a primeira confirmação</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      {selectedConfirmation && (
        <ConfirmDeleteConfirmationModal
          open={showDeleteModal}
          onOpenChange={(open) => {
            if (!open) {
              setShowDeleteModal(false);
              setSelectedConfirmation(null);
            }
          }}
          onConfirm={handleConfirmDelete}
          confirmation={{
            codigo: selectedConfirmation.codigo,
            alunoNome: selectedConfirmation.tb_matriculas?.tb_alunos?.nome || 'N/A',
            turmaNome: selectedConfirmation.tb_turmas?.designacao || 'N/A',
            dataConfirmacao: selectedConfirmation.data_Confirmacao,
            isLastConfirmation: false
          }}
          loading={deleteLoading}
          error={null}
          deleteResult={null}
        />
      )}
    </div>
  );
}
