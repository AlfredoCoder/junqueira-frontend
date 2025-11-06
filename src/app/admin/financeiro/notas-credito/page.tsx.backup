'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search,
  Calendar,
  DollarSign,
  User,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Container from '@/components/layout/Container';
import WelcomeHeader from '@/components/layout/WelcomeHeader';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { useDebounce } from '@/hooks/useDebounce';
import { useCreditNotes } from '@/hooks/useCreditNotes';
import useAuth from '@/hooks/useAuth';

interface CreditNote {
  codigo: number;
  designacao: string;
  fatura: string;
  descricao: string;
  valor: string;
  codigo_aluno: number;
  documento: string;
  next: string;
  dataOperacao: string;
  codigoPagamentoi?: number;
  codigo_utilizador?: number;
  tb_alunos?: {
    codigo: number;
    nome: string;
    n_documento_identificacao: string;
  };
  tb_utilizadores?: {
    codigo: number;
    nome: string;
    user: string;
  };
}

const NotasCreditoPage = () => {
  // Hook para gerenciar notas de crédito
  const { creditNotes, loading, error, pagination, fetchCreditNotes } = useCreditNotes();
  
  // Hook para obter usuário logado
  const { user } = useAuth();
  
  // Estados principais
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Estados de filtros e paginação
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce da busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Carregar notas de crédito quando a página carrega ou filtros mudam
  useEffect(() => {
    // Reset página quando filtros mudam (mas não quando é mudança de página)
    if (currentPage !== 1 && debouncedSearchTerm) {
      setCurrentPage(1);
      return;
    }
    
    fetchCreditNotes(currentPage, 10, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm, fetchCreditNotes]);

  // Handlers
  const handleViewDetails = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCreditNote(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(numValue || 0);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '00-00-0000') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <Container>
      {/* Header */}
      <WelcomeHeader
        title="Notas de Crédito"
        description="Visualize e gerencie todas as notas de crédito emitidas para anulação de faturas e reversão de pagamentos."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Notas"
          value={pagination.totalItems.toString()}
          change="Notas de crédito emitidas"
          changeType="neutral"
          icon={FileText}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Valor Total Anulado"
          value={creditNotes.reduce((sum, note) => sum + (parseFloat(note.valor) || 0), 0).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}
          change="Valor total revertido"
          changeType="neutral"
          icon={DollarSign}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Notas Este Mês"
          value={creditNotes.filter(note => {
            const noteDate = new Date(note.dataOperacao);
            const currentDate = new Date();
            return noteDate.getMonth() === currentDate.getMonth() && 
                   noteDate.getFullYear() === currentDate.getFullYear();
          }).length.toString()}
          change="Emitidas este mês"
          changeType="neutral"
          icon={Calendar}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />

        <StatCard
          title="Alunos Afetados"
          value={new Set(creditNotes.map(note => note.codigo_aluno)).size.toString()}
          change="Alunos únicos"
          changeType="neutral"
          icon={User}
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-50 via-white to-green-50/50"
          accentColor="bg-gradient-to-br from-green-500 to-green-600"
        />
      </div>

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Busca de Notas de Crédito"
        searchPlaceholder="Buscar por número da nota, aluno, fatura..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Lista de Notas de Crédito */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Notas de Crédito ({creditNotes.length} na página)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {loading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                  <span>Carregando página {currentPage}...</span>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-12 w-12 text-red-400" />
                  <p className="text-red-500">Erro ao carregar notas de crédito: {error}</p>
                  <p className="text-sm text-gray-400">
                    Verifique se o backend está rodando ou se há dados na tabela tb_nota_credito
                  </p>
                </div>
              </div>
            ) : creditNotes.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">Nenhuma nota de crédito encontrada</p>
                  {debouncedSearchTerm && (
                    <p className="text-sm text-gray-400">Tente ajustar os filtros de busca</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Aluno</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Fatura Original</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Motivo</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditNotes.map((creditNote) => (
                      <tr key={creditNote.codigo} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <p className="font-medium text-blue-600">{creditNote.next}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{creditNote.tb_alunos?.nome || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{creditNote.tb_alunos?.n_documento_identificacao || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{creditNote.fatura}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-red-600">{formatCurrency(creditNote.valor)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{formatDate(creditNote.dataOperacao)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={creditNote.designacao}>
                            {creditNote.designacao}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            onClick={() => handleViewDetails(creditNote)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Paginação */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                {pagination.totalItems} notas de crédito
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1 || loading}
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm bg-[#182F59] text-white rounded">
                  {pagination.currentPage} de {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages || loading}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog open={showDetailsModal} onOpenChange={handleCloseDetailsModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Detalhes da Nota de Crédito</span>
            </DialogTitle>
            <DialogDescription>
              Informações completas da nota de crédito {selectedCreditNote?.next}
            </DialogDescription>
          </DialogHeader>

          {selectedCreditNote && (
            <div className="space-y-6">
              {/* Informações Principais */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-3">Informações da Nota de Crédito</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">Número:</span>
                    <p className="text-blue-900">{selectedCreditNote.next}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Data de Emissão:</span>
                    <p className="text-blue-900">{formatDate(selectedCreditNote.dataOperacao)}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Fatura Original:</span>
                    <p className="text-blue-900">{selectedCreditNote.fatura}</p>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Valor Anulado:</span>
                    <p className="text-blue-900 font-medium">{formatCurrency(selectedCreditNote.valor)}</p>
                  </div>
                </div>
              </div>

              {/* Informações do Aluno */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">Informações do Aluno</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium">Nome:</span>
                    <p className="text-gray-900">{selectedCreditNote.tb_alunos?.nome || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Documento:</span>
                    <p className="text-gray-900">{selectedCreditNote.tb_alunos?.n_documento_identificacao || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Código do Aluno:</span>
                    <p className="text-gray-900">{selectedCreditNote.codigo_aluno}</p>
                  </div>
                  {selectedCreditNote.codigoPagamentoi && (
                    <div>
                      <span className="text-gray-600 font-medium">Código do Pagamento:</span>
                      <p className="text-gray-900">{selectedCreditNote.codigoPagamentoi}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Motivo e Descrição */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-900 mb-3">Motivo da Anulação</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-yellow-700 font-medium">Designação:</span>
                    <p className="text-yellow-900">{selectedCreditNote.designacao}</p>
                  </div>
                  <div>
                    <span className="text-yellow-700 font-medium">Descrição Detalhada:</span>
                    <p className="text-yellow-900">{selectedCreditNote.descricao}</p>
                  </div>
                </div>
              </div>

              {/* Informações do Funcionário */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 mb-3">Funcionário Responsável</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700 font-medium">Nome:</span>
                    <p className="text-green-900">{user?.nome || 'Usuário Logado'}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Usuário:</span>
                    <p className="text-green-900">{user?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Código:</span>
                    <p className="text-green-900">{user?.id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Tipo:</span>
                    <p className="text-green-900">{user?.tipo || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleCloseDetailsModal}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default NotasCreditoPage;
