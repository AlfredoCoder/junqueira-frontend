"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  Briefcase,
  DollarSign,
  Calendar,
  Settings,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useTipoServico } from '@/hooks/useFinancialService';
import { ITipoServico } from '@/types/financialService.types';

export default function ServiceDetails() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  
  const serviceId = parseInt(params.id as string);
  const { tipoServico: service, loading, error } = useTipoServico(serviceId);

  const handleEdit = () => {
    router.push(`/admin/finance-management/services/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push('/admin/finance-management/services');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'ativo': { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      'inativo': { label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
      'suspenso': { label: 'Suspenso', className: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getCategoriaLabel = (categoria: string) => {
    const categorias = {
      'transporte': 'Transporte',
      'alimentacao': 'Alimentação',
      'material': 'Material Escolar',
      'uniforme': 'Uniforme',
      'atividades': 'Atividades Extracurriculares',
      'seguro': 'Seguro Escolar',
      'certificados': 'Certificados e Documentos',
      'outros': 'Outros'
    };
    return categorias[categoria as keyof typeof categorias] || categoria;
  };

  const getTipoCobrancaLabel = (tipo: string) => {
    const tipos = {
      'unico': 'Pagamento Único',
      'mensal': 'Mensal',
      'trimestral': 'Trimestral',
      'anual': 'Anual'
    };
    return tipos[tipo as keyof typeof tipos] || tipo;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do serviço...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar serviço</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Serviços
          </Button>
        </div>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container>
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Serviço não encontrado</h2>
          <p className="text-muted-foreground mb-6">O serviço solicitado não foi encontrado.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Serviços
          </Button>
        </div>
      </Container>
    );
  }

  // Dados mockados para campos não disponíveis na API
  const mockData = {
    estudantes_inscritos: 95,
    total_estudantes: 180,
    receita_total: service.preco * 95, // Estimativa baseada no preço
    aplicavel_classes: ["1", "2", "3", "4", "5", "6"],
    data_inicio: "2024-02-01",
    data_fim: "2024-11-30",
    observacoes: "Configurações adicionais podem ser definidas pelo administrador"
  };

  const taxaAdesao = (mockData.estudantes_inscritos / mockData.total_estudantes) * 100;

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{service.designacao}</h1>
            <p className="text-muted-foreground">{service.tb_categoria_servicos?.designacao || 'Categoria não definida'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preço</p>
                <p className="text-2xl font-bold text-foreground">
                  {service.preco.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estudantes Inscritos</p>
                <p className="text-2xl font-bold text-foreground">{mockData.estudantes_inscritos}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Adesão</p>
                <p className="text-2xl font-bold text-foreground">{taxaAdesao.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Estimada</p>
                <p className="text-2xl font-bold text-foreground">
                  {mockData.receita_total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="students">Estudantes</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Serviço */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Informações do Serviço</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-foreground">{service.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoria</label>
                  <p className="text-foreground">{service.tb_categoria_servicos?.designacao || 'Não definida'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                  <p className="text-foreground">{service.descricao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(service.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Serviço</label>
                  <div className="mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      {service.tipoServico}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configurações Financeiras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Configurações Financeiras</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Preço</label>
                  <p className="text-foreground">
                    {service.preco.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Moeda</label>
                  <p className="text-foreground">{service.tb_moedas?.designacao || 'AOA'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Receita Mensal Estimada</label>
                  <p className="text-foreground">
                    {(service.preco * mockData.estudantes_inscritos).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aplicar Multa</label>
                  <div className="mt-1">
                    <Badge className={service.aplicarMulta ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                      {service.aplicarMulta ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Aplicar Desconto</label>
                  <div className="mt-1">
                    <Badge className={service.aplicarDesconto ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {service.aplicarDesconto ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Classes Aplicáveis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Classes Aplicáveis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mockData.aplicavel_classes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {mockData.aplicavel_classes.map((classe: string) => (
                      <Badge key={classe} className="bg-blue-100 text-blue-800">
                        {classe}ª Classe
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aplicável a todas as classes</p>
                )}
              </CardContent>
            </Card>

            {/* Período de Vigência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Período de Vigência</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Início</label>
                  <p className="text-foreground">
                    {mockData.data_inicio ? new Date(mockData.data_inicio).toLocaleDateString('pt-BR') : 'Não definida'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data de Fim</label>
                  <p className="text-foreground">
                    {mockData.data_fim ? new Date(mockData.data_fim).toLocaleDateString('pt-BR') : 'Não definida'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Observações</label>
                  <p className="text-foreground">{mockData.observacoes}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor da Multa</label>
                  <p className="text-foreground">
                    {service.valorMulta ? service.valorMulta.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' }) : 'Não definido'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Situação dos Estudantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{mockData.estudantes_inscritos}</div>
                  <div className="text-sm font-medium text-blue-800">Estudantes Inscritos</div>
                </div>
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600 mb-2">
                    {mockData.total_estudantes - mockData.estudantes_inscritos}
                  </div>
                  <div className="text-sm font-medium text-gray-800">Não Inscritos</div>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">{mockData.total_estudantes}</div>
                  <div className="text-sm font-medium text-green-800">Total Elegíveis</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Estatísticas do Serviço</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Taxa de Adesão</span>
                    <span className="text-sm font-bold text-foreground">{taxaAdesao.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${taxaAdesao}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receita Total Estimada</label>
                    <p className="text-xl font-bold text-foreground">
                      {mockData.receita_total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Receita Mensal Estimada</label>
                    <p className="text-xl font-bold text-foreground">
                      {(service.preco * mockData.estudantes_inscritos).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Container>
  );
}
