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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';

export default function PagamentosPage() {
  // Estados principais
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalArrecadado: 0,
    pagamentosPendentes: 0,
    alunosComDebitos: 0,
    faturasEmitidas: 0
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Simular carregamento de dados
      setTimeout(() => {
        setPayments([
          {
            id: 1,
            studentName: 'João Silva',
            invoiceNumber: 'FAT-2024-001',
            amount: 25000,
            date: '2024-01-15',
            status: 'Pago'
          },
          {
            id: 2,
            studentName: 'Maria Santos',
            invoiceNumber: 'FAT-2024-002',
            amount: 30000,
            date: '2024-01-16',
            status: 'Pendente'
          }
        ]);
        
        setStats({
          totalArrecadado: 750000,
          pagamentosPendentes: 15,
          alunosComDebitos: 8,
          faturasEmitidas: 45
        });
        
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      setLoading(false);
    }
  };

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
      'Pago': 'bg-green-100 text-green-800',
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Cancelado': 'bg-red-100 text-red-800'
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
        onClickBtnRight={() => alert('Funcionalidade em desenvolvimento')}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Arrecadado"
          value={formatCurrency(stats.totalArrecadado)}
          icon={DollarSign}
          change="Este mês"
          changeType="up"
          color="text-green-600"
          bgColor="bg-green-50"
          accentColor="border-green-200"
        />
        <StatCard
          title="Pagamentos Pendentes"
          value={stats.pagamentosPendentes.toString()}
          icon={Calendar}
          change="A receber"
          changeType="up"
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          accentColor="border-yellow-200"
        />
        <StatCard
          title="Alunos com Débitos"
          value={stats.alunosComDebitos.toString()}
          icon={Users}
          change="Requer atenção"
          changeType="down"
          color="text-red-600"
          bgColor="bg-red-50"
          accentColor="border-red-200"
        />
        <StatCard
          title="Faturas Emitidas"
          value={stats.faturasEmitidas.toString()}
          icon={FileText}
          change="Este mês"
          changeType="up"
          color="text-blue-600"
          bgColor="bg-blue-50"
          accentColor="border-blue-200"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por aluno, número de fatura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={loadPayments}>
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

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
                  
                  <Badge className={getPaymentStatusBadge(payment.status)}>
                    {payment.status}
                  </Badge>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => alert('Download em desenvolvimento')}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    
                    {payment.status === 'Pago' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => alert('Cancelamento em desenvolvimento')}
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
    </div>
  );
}
