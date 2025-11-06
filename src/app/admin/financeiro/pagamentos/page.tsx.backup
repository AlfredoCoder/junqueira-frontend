'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  DollarSign,
  Calendar,
  FileText,
  Eye,
  Download,
  X
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStudentsConfirmed, useStudentFinancialData, usePaymentsList, useGenerateInvoicePDF } from '@/hooks/usePayments';
import { useDebounce } from '@/hooks/useDebounce';
import { useAllTurmas } from '@/hooks/useTurma';
import { useAllCourses } from '@/hooks/useCourse';
import Container from '@/components/layout/Container';
import WelcomeHeader from '@/components/layout/WelcomeHeader';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import NovoPaymentModal from './components/NovoPaymentModal';
import StudentFinancialModal from './components/StudentFinancialModal';
import CreditNoteModal from './components/CreditNoteModal';

const PagamentosPage = () => {
  // Estados principais
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    codigo: number;
    nome: string;
    n_documento_identificacao: string;
  } | null>(null);
  const [selectedPaymentForCancellation, setSelectedPaymentForCancellation] = useState<any>(null);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTurma, setSelectedTurma] = useState<string>('all');
  const [selectedCurso, setSelectedCurso] = useState<string>('all');
  
  // Estados para lista de pagamentos
  const [paymentsSearchTerm, setPaymentsSearchTerm] = useState('');
  const [paymentsCurrentPage, setPaymentsCurrentPage] = useState(1);
  const [selectedTipoServico, setSelectedTipoServico] = useState<string>('all');
  const [downloadingPaymentId, setDownloadingPaymentId] = useState<number | null>(null);
  
  // Debounce para busca (otimizado)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedPaymentsSearch = useDebounce(paymentsSearchTerm, 500);

  // Hooks
  const { 
    students, 
    loading: studentsLoading, 
    error: studentsError, 
    pagination, 
    fetchStudents 
  } = useStudentsConfirmed();

  const {
    data: financialData,
    loading: financialLoading,
    fetchFinancialData,
    clearData: clearFinancialData
  } = useStudentFinancialData();

  const {
    payments,
    loading: paymentsLoading,
    error: paymentsError,
    pagination: paymentsPagination,
    fetchPayments
  } = usePaymentsList();


  const { generatePDF } = useGenerateInvoicePDF();

  // Hooks para filtros
  const { turmas } = useAllTurmas();
  const { courses } = useAllCourses();

  // Carregar alunos quando a página carrega ou filtros mudam
  useEffect(() => {
    if (showStudentsModal) {
      // Reset página quando filtros mudam (mas não quando é mudança de página)
      if (currentPage !== 1 && (debouncedSearchTerm || selectedTurma !== 'all' || selectedCurso !== 'all')) {
        setCurrentPage(1);
        return;
      }
      
      const turmaId = selectedTurma !== 'all' ? parseInt(selectedTurma) : undefined;
      const cursoId = selectedCurso !== 'all' ? parseInt(selectedCurso) : undefined;
      fetchStudents(currentPage, 100, debouncedSearchTerm, turmaId, cursoId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showStudentsModal, currentPage, debouncedSearchTerm, selectedTurma, selectedCurso]);

  // Carregar pagamentos quando a página carrega ou filtros mudam
  useEffect(() => {
    // Reset página quando filtros mudam (mas não quando é mudança de página)
    if (paymentsCurrentPage !== 1 && (debouncedPaymentsSearch || selectedTipoServico !== 'all')) {
      setPaymentsCurrentPage(1);
      return;
    }
    
    const tipoServico = selectedTipoServico !== 'all' ? selectedTipoServico : undefined;
    fetchPayments(paymentsCurrentPage, 10, debouncedPaymentsSearch, tipoServico);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentsCurrentPage, debouncedPaymentsSearch, selectedTipoServico]);

  // Handlers
  const handleViewStudent = async (student: { codigo: number; nome: string; n_documento_identificacao: string }) => {
    setSelectedStudent(student);
    setShowFinancialModal(true);
    
    // Carregar dados financeiros de forma assíncrona (não bloqueante)
    fetchFinancialData(student.codigo);
  };

  const handleCloseFinancialModal = () => {
    setShowFinancialModal(false);
    setSelectedStudent(null);
    clearFinancialData();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleDownloadInvoice = async (paymentId: number) => {
    try {
      setDownloadingPaymentId(paymentId);
      await generatePDF(paymentId);
    } catch (error) {
      console.error('Erro ao baixar fatura:', error);
    } finally {
      setDownloadingPaymentId(null);
    }
  };

  const handleCancelPayment = (payment: any) => {
    setSelectedPaymentForCancellation(payment);
    setShowCreditNoteModal(true);
  };

  const handleCloseCreditNoteModal = () => {
    setShowCreditNoteModal(false);
    setSelectedPaymentForCancellation(null);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Pagamentos"
        description="Gerencie pagamentos de propinas e outros serviços financeiros da instituição. Registre transações, acompanhe pagamentos e mantenha os dados sempre atualizados."
        titleBtnLeft='Ver Estado dos Alunos'
        iconBtnLeft={<Users className="w-5 h-5 mr-2" />}
        onClickBtnLeft={() => setShowStudentsModal(true)}
        titleBtnRight='Novo Pagamento'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => setShowNewPaymentModal(true)}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pagamentos"
          value="1,234"
          change="+20.1% vs mês anterior"
          changeType="up"
          icon={FileText}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Valor Total"
          value="45.231.000 Kz"
          change="+15.3% vs mês anterior"
          changeType="up"
          icon={DollarSign}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Pagamentos Hoje"
          value="23"
          change="+5 vs ontem"
          changeType="up"
          icon={Calendar}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />

        <StatCard
          title="Alunos Ativos"
          value="573"
          change="Alunos confirmados"
          changeType="neutral"
          icon={Users}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />
      </div>

      {/* Filtros e Busca */}
      <FilterSearchCard
        title="Filtros e Busca de Pagamentos"
        searchPlaceholder="Buscar por nome do aluno, documento, fatura..."
        searchValue={paymentsSearchTerm}
        onSearchChange={setPaymentsSearchTerm}
        filters={[
          {
            label: "Tipo de Serviço",
            value: selectedTipoServico,
            onChange: setSelectedTipoServico,
            options: [
              { value: "all", label: "Todos os Serviços" },
              { value: "propina", label: "Propinas" },
              { value: "outros", label: "Outros Serviços" }
            ],
            width: "w-48"
          }
        ]}
      />

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Pagamentos ({payments.length} na página)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {paymentsLoading ? (
              <div className="text-center py-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                  <span>Carregando página {paymentsCurrentPage}...</span>
                </div>
              </div>
            ) : paymentsError ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-12 w-12 text-red-400" />
                  <p className="text-red-500">Erro ao carregar pagamentos: {paymentsError}</p>
                </div>
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">Nenhum pagamento encontrado</p>
                  {(debouncedPaymentsSearch || selectedTipoServico !== 'all') && (
                    <p className="text-sm text-gray-400">Tente ajustar os filtros de busca</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Aluno</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Serviço</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Mês/Ano</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Fatura</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.codigo} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.aluno?.nome}</p>
                            <p className="text-sm text-gray-500">{payment.aluno?.n_documento_identificacao}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{payment.tipoServico?.designacao}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{payment.mes}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-green-600">{formatCurrency(payment.preco)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{formatDate(payment.data)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">{payment.fatura}</p>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              onClick={() => handleDownloadInvoice(payment.codigo)}
                              variant="outline"
                              size="sm"
                              disabled={downloadingPaymentId === payment.codigo}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {downloadingPaymentId === payment.codigo ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-1"></div>
                                  Gerando...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  Fatura
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleCancelPayment(payment)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Anular
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* Paginação */}
          {paymentsPagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((paymentsPagination.currentPage - 1) * paymentsPagination.itemsPerPage) + 1} a{' '}
                {Math.min(paymentsPagination.currentPage * paymentsPagination.itemsPerPage, paymentsPagination.totalItems)} de{' '}
                {paymentsPagination.totalItems} pagamentos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaymentsCurrentPage(paymentsPagination.currentPage - 1)}
                  disabled={paymentsPagination.currentPage === 1 || paymentsLoading}
                >
                  Anterior
                </Button>
                <span className="px-3 py-1 text-sm bg-[#182F59] text-white rounded">
                  {paymentsPagination.currentPage} de {paymentsPagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPaymentsCurrentPage(paymentsPagination.currentPage + 1)}
                  disabled={paymentsPagination.currentPage === paymentsPagination.totalPages || paymentsLoading}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Novo Pagamento */}
      <NovoPaymentModal
        open={showNewPaymentModal}
        onClose={() => setShowNewPaymentModal(false)}
      />

      {/* Modal Lista de Alunos */}
      <Dialog open={showStudentsModal} onOpenChange={setShowStudentsModal}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Estado dos Alunos
            </DialogTitle>
            <DialogDescription className="text-sm">
              Lista de alunos confirmados em turmas com opções de filtro
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por nome do aluno..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-48">
                    <SelectValue placeholder="Filtrar por turma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as turmas</SelectItem>
                    {turmas.map((turma) => (
                      <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                        {turma.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedCurso} onValueChange={setSelectedCurso}>
                  <SelectTrigger className="w-full sm:w-40 lg:w-48">
                    <SelectValue placeholder="Filtrar por curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os cursos</SelectItem>
                    {courses.map((curso) => (
                      <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                        {curso.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Alunos */}
            <div className="border rounded-lg overflow-hidden max-h-96 overflow-y-auto">
              {studentsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando alunos...</p>
                </div>
              ) : studentsError ? (
                <div className="p-8 text-center text-red-600">
                  <p>Erro: {studentsError}</p>
                </div>
              ) : students.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum aluno encontrado</p>
                </div>
              ) : (
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Aluno</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900 hidden sm:table-cell">Documento</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900 hidden md:table-cell">Curso</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Turma</th>
                      <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.codigo} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900 text-sm truncate max-w-[120px] sm:max-w-none">{student.nome}</div>
                            <div className="text-xs text-gray-500 sm:hidden">{student.n_documento_identificacao}</div>
                            <div className="text-xs text-gray-500 md:hidden">{student.tb_matriculas?.tb_cursos?.designacao || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">
                          {student.n_documento_identificacao}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {student.tb_matriculas?.tb_cursos?.designacao || 'N/A'}
                        </td>
                        <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900">
                          {student.tb_matriculas?.tb_confirmacoes?.[0]?.tb_turmas?.designacao || 'N/A'}
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <Button
                            onClick={() => handleViewStudent(student)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800 px-2 sm:px-3 text-xs sm:text-sm"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Visualizar</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Paginação */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                  {pagination.totalItems} alunos
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Anterior</span>
                    <span className="sm:hidden">Ant</span>
                  </Button>
                  <Button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <span className="sm:hidden">Prox</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Dados Financeiros do Aluno */}
      <StudentFinancialModal
        open={showFinancialModal}
        onClose={handleCloseFinancialModal}
        student={selectedStudent}
        financialData={financialData}
        loading={financialLoading}
      />

      {/* Modal Nota de Crédito */}
      <CreditNoteModal
        open={showCreditNoteModal}
        onClose={handleCloseCreditNoteModal}
        payment={selectedPaymentForCancellation}
        onSuccess={() => {
          // Recarregar lista de pagamentos após sucesso
          const tipoServico = selectedTipoServico !== 'all' ? selectedTipoServico : undefined;
          fetchPayments(paymentsCurrentPage, 10, debouncedPaymentsSearch, tipoServico);
        }}
      />
    </Container>
  );
};

export default PagamentosPage;
