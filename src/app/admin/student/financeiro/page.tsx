'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  CreditCard,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';

interface PagamentoAluno {
  codigo: number;
  data: string;
  descricao: string;
  valor: number;
  status: string;
  mes?: string;
  ano?: string;
  tipoServico?: string;
}

interface DadosFinanceiros {
  aluno: {
    nome: string;
    turma?: string;
    classe?: string;
    curso?: string;
  };
  pagamentos: PagamentoAluno[];
  resumo: {
    totalPago: number;
    totalPendente: number;
    mesesPagos: string[];
    mesesPendentes: string[];
  };
  estatisticas: {
    pagamentosRealizados: number;
    pagamentosPendentes: number;
    ultimoPagamento?: string;
  };
}

export default function EstadoFinanceiroPage() {
  const [dados, setDados] = useState<DadosFinanceiros | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDadosFinanceiros();
  }, []);

  const carregarDadosFinanceiros = async () => {
    try {
      setLoading(true);
      console.log('🔍 [FINANCEIRO ALUNO] Carregando dados financeiros...');
      
      const response = await api.get('/api/aluno/financeiro');
      
      if (response.data.success) {
        console.log('✅ [FINANCEIRO ALUNO] Dados carregados:', response.data.data);
        setDados(response.data.data);
      } else {
        toast.error(response.data.message || 'Erro ao carregar dados financeiros');
      }
    } catch (error: any) {
      console.error('❌ [FINANCEIRO ALUNO] Erro ao carregar dados:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pago':
        return <Badge variant="default" className="bg-green-500">Pago</Badge>;
      case 'pendente':
        return <Badge variant="destructive">Pendente</Badge>;
      case 'atrasado':
        return <Badge variant="destructive" className="bg-red-600">Atrasado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'AOA' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhum dado financeiro encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          Estado Financeiro
        </h1>
        <p className="text-gray-600 mt-2">
          Acompanhe seus pagamentos e situação financeira
        </p>
      </div>

      {/* Informações do Aluno */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Label className="text-sm text-gray-600">Aluno</Label>
              <p className="font-bold text-gray-900">{dados.aluno.nome}</p>
            </div>
          </CardContent>
        </Card>
        
        {dados.aluno.turma && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Turma</Label>
                <p className="font-medium text-gray-900">{dados.aluno.turma}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {dados.aluno.classe && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Classe</Label>
                <p className="font-medium text-gray-900">{dados.aluno.classe}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {dados.aluno.curso && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Curso</Label>
                <p className="font-medium text-gray-900">{dados.aluno.curso}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(dados.resumo.totalPago)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pendente</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(dados.resumo.totalPendente)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagamentos Realizados</p>
                <p className="text-2xl font-bold text-blue-600">{dados.estatisticas.pagamentosRealizados}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagamentos Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{dados.estatisticas.pagamentosPendentes}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meses Pagos e Pendentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Meses Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dados.resumo.mesesPagos.map((mes, index) => (
                <Badge key={index} variant="default" className="bg-green-500">
                  {mes}
                </Badge>
              ))}
              {dados.resumo.mesesPagos.length === 0 && (
                <p className="text-gray-500">Nenhum mês pago ainda</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Meses Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dados.resumo.mesesPendentes.map((mes, index) => (
                <Badge key={index} variant="destructive">
                  {mes}
                </Badge>
              ))}
              {dados.resumo.mesesPendentes.length === 0 && (
                <p className="text-gray-500">Nenhum mês pendente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Histórico de Pagamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dados.pagamentos.map((pagamento, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{pagamento.descricao}</h3>
                    {getStatusBadge(pagamento.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(pagamento.data).toLocaleDateString('pt-BR')}
                    </span>
                    {pagamento.mes && (
                      <span>Mês: {pagamento.mes}</span>
                    )}
                    {pagamento.tipoServico && (
                      <span>Tipo: {pagamento.tipoServico}</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(pagamento.valor)}
                  </p>
                </div>
              </div>
            ))}
            
            {dados.pagamentos.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum pagamento encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
