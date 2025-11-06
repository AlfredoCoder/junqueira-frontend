"use client";

import React, { useCallback, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
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
  // Calendar,
  // ArrowRightLeft,
  // CheckCircle,
  // Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
// import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { ConfirmDeleteTransferModal } from '@/components/transfer/confirm-delete-transfer-modal';

import { useTransfers, useDeleteTransfer } from '@/hooks/useTransfer';
import { useStatus } from '@/hooks/useStatusControl';
import { ITransfer } from '@/types/transfer.types';
import { toast } from 'react-toastify';


// Mapeamento dos motivos de transferência
const TRANSFER_MOTIVOS = [
  { codigo: 1, designacao: "Mudança de residência" },
  { codigo: 2, designacao: "Mudança de curso" },
  { codigo: 3, designacao: "Problemas disciplinares" },
  { codigo: 4, designacao: "Motivos familiares" },
  { codigo: 5, designacao: "Transferência administrativa" },
  { codigo: 6, designacao: "Transferência por trabalho dos pais" },
  { codigo: 7, designacao: "Problemas de saúde" },
  { codigo: 8, designacao: "Outros motivos" },
];

// Mapeamento das escolas de destino
const ESCOLAS_DESTINO = [
  { codigo: 1, nome: "Escola Secundária do Cazenga", provincia: "Luanda" },
  { codigo: 2, nome: "Instituto Médio Politécnico de Luanda", provincia: "Luanda" },
  { codigo: 3, nome: "Colégio São José", provincia: "Luanda" },
  { codigo: 4, nome: "Escola Secundária da Maianga", provincia: "Luanda" },
  { codigo: 5, nome: "Instituto Médio Industrial de Luanda", provincia: "Luanda" },
  { codigo: 6, nome: "Escola Secundária de Viana", provincia: "Luanda" },
  { codigo: 7, nome: "Instituto Médio de Economia", provincia: "Luanda" },
  { codigo: 8, nome: "Escola Secundária do Sambizanga", provincia: "Luanda" },
];


export default function TransfersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const { status } = useStatus(1, 100, "");

  const statusOptions = useMemo(() => {
    const options = [{ value: "all", label: "Todos os Status" }];
    if (status && status.length > 0) {
      status.forEach((s) => {
        options.push({
          value: s.codigo.toString(),
          label: s.designacao
        });
      });
    }
    return options;
  }, [status]);

  // Hooks da API
  const { transfers, pagination, loading, error, refetch } = useTransfers(currentPage, itemsPerPage, searchTerm);

  // Hook para exclusão de transferência
  const { deleteTransfer, loading: deleteLoading, error: deleteError } = useDeleteTransfer();

  // Estados do modal de exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transferToDelete, setTransferToDelete] = useState<{
    codigo: number;
    alunoNome: string;
    escolaDestino: string;
    motivo: string;
    dataTransferencia?: string;
    isRecent: boolean;
    diasDesdeTransferencia?: number;
  } | null>(null);
  const [deleteResult, setDeleteResult] = useState<{
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null>(null);



  const calculateAge = (birthDate: string | object | null) => {
    if (!birthDate || typeof birthDate === 'object') {
      return 'N/A';
    }
    try {
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return 'N/A';
    }
  }, []);

  const getMotivoDesignacao = (transfer: ITransfer) => {
    // Usar mapeamento estático (tabela não existe no banco)
    const motivo = TRANSFER_MOTIVOS.find(m => m.codigo === transfer.codigoMotivo);
    return motivo?.designacao || `Motivo ${transfer.codigoMotivo}`;
  }, []);

  const getEscolaNome = (transfer: ITransfer) => {
    // Usar mapeamento estático (tabela não existe no banco)
    const escola = ESCOLAS_DESTINO.find(e => e.codigo === transfer.codigoEscola);
    return escola?.nome || `Escola ${transfer.codigoEscola}`;
  }, []);

  const getEscolaInfo = (transfer: ITransfer) => {
    // Retornar informações completas da escola do mapeamento estático
    const escola = ESCOLAS_DESTINO.find(e => e.codigo === transfer.codigoEscola);
    if (escola) {
      return {
        nome: escola.nome,
        provincia: escola.provincia
      };
    }
    return null;
  }, []);

  // const getTransferStatus = (dataTransferencia: string | object) => {
  //   if (!dataTransferencia || typeof dataTransferencia === 'object') {
  //     return { status: 'Pendente', color: 'bg-amber-100 text-amber-800' };
  //   }
  //   try {
  //     const date = new Date(dataTransferencia);
  //     if (isNaN(date.getTime())) {
  //       return { status: 'Erro', color: 'bg-red-100 text-red-800' };
  //     }
  //     const today = new Date();
  //     if (date <= today) {
  //       return { status: 'Concluída', color: 'bg-green-100 text-green-800' };
  //     } else {
  //       return { status: 'Agendada', color: 'bg-blue-100 text-blue-800' };
  //     }
  //   } catch {
  //     return { status: 'Erro', color: 'bg-red-100 text-red-800' };
  //   }
  // };

  // Handler para abrir modal de exclusão
  const handleDeleteClick = useCallback((transfer: ITransfer) => {
    // Calcular dias desde a transferência
    const hoje = new Date();
    let dataTransf: Date | null = null;
    let diasDesde = 0;
    
    if (transfer.dataTransferencia && typeof transfer.dataTransferencia === 'string') {
      try {
        dataTransf = new Date(transfer.dataTransferencia);
        diasDesde = Math.floor((hoje.getTime() - dataTransf.getTime()) / (1000 * 60 * 60 * 24));
      } catch {
        diasDesde = 0;
      }
    }
    
    const isRecent = diasDesde <= 7; // Considera recente se foi há menos de 7 dias
    
    setTransferToDelete({
      codigo: transfer.codigo,
      alunoNome: transfer.tb_alunos.nome,
      escolaDestino: getEscolaNome(transfer),
      motivo: getMotivoDesignacao(transfer),
      dataTransferencia: typeof transfer.dataTransferencia === 'string' ? transfer.dataTransferencia : undefined,
      isRecent,
      diasDesdeTransferencia: diasDesde
    });
    setDeleteResult(null);
    setDeleteModalOpen(true);
  }, []);

  // Handler para confirmar exclusão
  const handleConfirmDelete = async () => {
    if (!transferToDelete) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await deleteTransfer(transferToDelete.codigo) as any;
      
      toast.success('Transferência excluída com sucesso!');
      
      // Definir resultado para exibir detalhes
      setDeleteResult({
        tipo: 'hard_delete',
        detalhes: response?.detalhes || {},
        info: response?.info || 'Transferência excluída com sucesso'
      });

      // Recarregar a lista após 2 segundos
      setTimeout(() => {
        refetch();
        setDeleteModalOpen(false);
        setTransferToDelete(null);
        setDeleteResult(null);
      }, 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir transferência';
      console.error('Erro ao excluir transferência:', error);
      toast.error(errorMessage);
    }
  }, []);

  // Handler para fechar modal de exclusão
  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setTransferToDelete(null);
      setDeleteResult(null);
    }
  }, []);



  return (
    <div className="space-y-6 ultra-fast-fade">


      <WelcomeHeader
        title="Gestão de Transferências de Alunos"
        description="Gerencie todas as transferências de alunos. Visualize informações detalhadas, acompanhe status e mantenha os registros sempre atualizados."
        titleBtnRight='Nova Transferência'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/student-management/transfers/add'}
      />

      {/* Stats Cards seguindo padrão do Dashboard */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total de Transferências"
          value={(pagination?.totalItems || 0).toString()}
          change="Total"
          changeType="up"
          icon={ArrowRightLeft}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Pendentes"
          value={transfers.filter(t => getTransferStatus(t.dataTransferencia).status === 'Pendente').length.toString()}
          change="Pendentes"
          changeType="neutral"
          icon={Clock}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />

        <StatCard
          title="Concluídas"
          value={transfers.filter(t => getTransferStatus(t.dataTransferencia).status === 'Concluída').length.toString()}
          change="Concluídas"
          changeType="up"
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Agendadas"
          value={transfers.filter(t => getTransferStatus(t.dataTransferencia).status === 'Agendada').length.toString()}
          change="Agendadas"
          changeType="neutral"
          icon={Calendar}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
      </div> */}

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por aluno, escola destino ou motivo..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: searchTerm,
            onChange: setSearchTerm,
            options: statusOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Transferências</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin loading-spinner" />
              <span className="ml-2">Carregando transferências...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : transfers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma transferência encontrada.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Escola Destino</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transfer.tb_alunos.nome}</p>
                            <p className="text-sm text-gray-500">
                              {calculateAge(transfer.tb_alunos.dataNascimento)} anos • {transfer.tb_alunos.sexo}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{getEscolaNome(transfer)}</p>
                          {(() => {
                            const escolaInfo = getEscolaInfo(transfer);
                            return escolaInfo?.provincia ? (
                              <p className="text-xs text-gray-500">{escolaInfo.provincia}</p>
                            ) : (
                              <p className="text-sm text-gray-500">Código: {transfer.codigoEscola}</p>
                            );
                          })()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{getMotivoDesignacao(transfer)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate" title={transfer.obs || ''}>
                          {transfer.obs || 'Sem observações'}
                        </p>
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
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/student-management/transfers/edit/${transfer.codigo}`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(transfer)}
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
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
            </div>
          )}

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de {pagination.totalItems} transferências
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
                    const totalPages = pagination.totalPages;
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
                          className={currentPage === i ? "bg-[#F9CD1D] hover:bg-[#F9CD1D]" : ""}
                          disabled={loading}
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
      <ConfirmDeleteTransferModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        transfer={transferToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />

    </div>
  );
}
