'use client';

import React, { useCallback, useState, useEffect } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import StudentFinancialModal from './components/StudentFinancialModal';
import NovoPaymentModal from './components/NovoPaymentModal';
import CreditNoteModal from './components/CreditNoteModal';

import { useAlunosSearch } from '@/hooks/usePaymentData';
import { usePaymentsList } from '@/hooks/usePayments';

export default function PagamentosPage() {
  // Estados principais
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showFinancialModal, setShowFinancialModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreditNoteModal, setShowCreditNoteModal] = useState(false);
  const [selectedPaymentForCancellation, setSelectedPaymentForCancellation] = useState<any>(null);
  const [downloadingPaymentId, setDownloadingPaymentId] = useState<number | null>(null);

  // Hooks customizados
  const {
    students,
    payments,
    stats,
    loading,
    error,
    fetchStudents,
    fetchPayments,
    generatePDF
  } = usePayments();

  const {
    financialData,
    financialLoading,
    fetchFinancialData,
    clearFinancialData
  } = usePaymentData();

  // Carregar dados iniciais
  useEffect(() => {
    fetchStudents();
    fetchPayments(currentPage);
  }, [currentPage, fetchStudents, fetchPayments]);

  // Handlers otimizados
  const handleStudentClick = useCallback((student: any) => {
    setSelectedStudent(student);
    setShowFinancialModal(true);
    
    // Carregar dados financeiros de forma assíncrona
    fetchFinancialData(student.codigo);
  }, [fetchFinancialData]);

  const handleCloseFinancialModal = useCallback(() => {
    setShowFinancialModal(false);
    setSelectedStudent(null);
    clearFinancialData();
  }, [clearFinancialData]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleDownloadInvoice = useCallback(async (paymentId: number) => {
    try {
      setDownloadingPaymentId(paymentId);
      await generatePDF(paymentId);
    } catch (error) {
      console.error('Erro ao baixar fatura:', error);
    } finally {
      setDownloadingPaymentId(null);
    }
  }, [generatePDF]);

  const handleCancelPayment = useCallback((payment: any) => {
    setSelectedPaymentForCancellation(payment);
    setShowCreditNoteModal(true);
  }, []);

  const handleCloseCreditNoteModal = useCallback(() => {
    setShowCreditNoteModal(false);
    setSelectedPaymentForCancellation(null);
  }, []);

  // Funções utilitárias
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusMap = {
      'Pago': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'Pendente': { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      'Cancelado': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap['Pendente'];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando pagamentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <WelcomeHeader
        title="Gestão de Pagamentos"
        description="Gerencie todos os pagamentos, propinas e serviços dos alunos. Visualize histórico financeiro e gere relatórios."
        titleBtnRight="Novo Pagamento"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => setShowPaymentModal(true)}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Arrecadado"
          value={formatCurrency(stats?.totalArrecadado || 0)}
          icon={DollarSign}
          change="Este mês"
          changeType="up"
          color="text-green-600"
          bgColor="bg-green-50"
          accentColor="border-green-200"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={stats?.pagamentosPendentes?.toString() || '0'}
          icon={Calendar}
          change="A receber"
          changeType="up"
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          accentColor="border-yellow-200"
        />
        <StatCard
          title="Alunos com Débitos"
          value={stats?.alunosComDebitos?.toString() || '0'}
          icon={Users}
          change="Requer atenção"
          changeType="down"
          color="text-red-600"
          bgColor="bg-red-50"
          accentColor="border-red-200"
        />
        <StatCard
          title="Faturas Emitidas"
          value={stats?.faturasEmitidas?.toString() || '0'}
          icon={FileText}
          change="Este mês"
          changeType="up"
          color="text-blue-600"
          bgColor="bg-blue-50"
          accentColor="border-blue-200"
        />
      </div>

      {/* Filtros */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Buscar por aluno, número de fatura..."
      />

      {/* Lista de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{payment.studentName}</p>
                    <p className="text-sm text-gray-500">Fatura #{payment.invoiceNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                  </div>
                  
                  <Badge className={getPaymentStatusBadge(payment.status).color}>
                    {payment.status}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(payment.id)}
                      disabled={downloadingPaymentId === payment.id}
                    >
                      {downloadingPaymentId === payment.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {payment.status === 'Pago' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelPayment(payment)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modais */}
      <StudentFinancialModal
        open={showFinancialModal}
        onOpenChange={handleCloseFinancialModal}
        student={selectedStudent}
        financialData={financialData}
        loading={financialLoading}
      />

      <NovoPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchPayments(currentPage);
        }}
      />

      <CreditNoteModal
        open={showCreditNoteModal}
        onOpenChange={handleCloseCreditNoteModal}
        payment={selectedPaymentForCancellation}
        onSuccess={() => {
          setShowCreditNoteModal(false);
          fetchPayments(currentPage);
        }}
      />
    </div>
  );
}
