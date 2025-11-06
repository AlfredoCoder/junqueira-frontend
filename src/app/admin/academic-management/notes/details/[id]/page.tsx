"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  FileText,
  ArrowLeft,
  Edit,
  Award,
  BookOpen,
  Users,
  Calendar,
  User,
  TrendingUp,
  Download,
  Printer,
  Activity,
  BarChart3,
} from 'lucide-react';

// Dados mockados da nota
const mockNotaDetails = {
  id: 1,
  aluno: {
    nome: "Ana Silva Santos",
    numeroEstudante: "2024001",
    idade: 16,
    email: "ana.silva@email.com",
    telefone: "+244 923 111 111",
    responsavel: "Maria Silva Santos",
    telefoneResponsavel: "+244 923 222 222"
  },
  disciplina: {
    nome: "Matemática",
    codigo: "MAT",
    cargaHoraria: 5,
    professor: "Prof. João Silva Santos",
    descricao: "Disciplina fundamental que aborda álgebra, geometria e cálculo básico."
  },
  turma: {
    designacao: "IG-10A-2024",
    classe: "10ª Classe",
    curso: "Informática de Gestão",
    totalAlunos: 28,
    periodo: "Manhã"
  },
  avaliacao: {
    trimestre: "1º Trimestre",
    tipoAvaliacao: "Prova",
    nota: 16.5,
    notaMaxima: 20,
    percentual: 82.5,
    situacao: "Aprovado",
    dataAvaliacao: "2024-03-15",
    dataLancamento: "2024-03-16"
  },
  status: "Ativo",
  observacoes: "Excelente desempenho na resolução de problemas algébricos. Demonstra boa compreensão dos conceitos matemáticos e aplicação prática.",
  // Estatísticas do aluno na disciplina
  estatisticas: {
    mediaGeral: 15.8,
    melhorNota: 18.0,
    piorNota: 14.5,
    totalAvaliacoes: 4,
    posicaoTurma: 3,
    frequencia: 95.2
  }
};

// Dados mockados de histórico de notas do aluno na disciplina
const mockHistoricoNotas = [
  {
    id: 1,
    trimestre: "1º Trimestre",
    tipoAvaliacao: "Teste",
    nota: 14.5,
    data: "2024-02-20",
    observacoes: "Bom desempenho inicial"
  },
  {
    id: 2,
    trimestre: "1º Trimestre",
    tipoAvaliacao: "Trabalho",
    nota: 17.0,
    data: "2024-03-05",
    observacoes: "Excelente apresentação"
  },
  {
    id: 3,
    trimestre: "1º Trimestre",
    tipoAvaliacao: "Prova",
    nota: 16.5,
    data: "2024-03-15",
    observacoes: "Excelente desempenho na resolução de problemas"
  },
  {
    id: 4,
    trimestre: "2º Trimestre",
    tipoAvaliacao: "Teste",
    nota: 15.5,
    data: "2024-04-10",
    observacoes: "Mantém bom nível"
  }
];

// Dados mockados de comparação com a turma
const mockComparacaoTurma = {
  mediaTurma: 14.2,
  medianaTurma: 14.0,
  melhorNotaTurma: 18.5,
  piorNotaTurma: 8.5,
  totalAlunosAvaliados: 26,
  distribuicaoNotas: [
    { faixa: "18-20", quantidade: 3, percentual: 11.5 },
    { faixa: "16-17.9", quantidade: 8, percentual: 30.8 },
    { faixa: "14-15.9", quantidade: 10, percentual: 38.5 },
    { faixa: "12-13.9", quantidade: 4, percentual: 15.4 },
    { faixa: "10-11.9", quantidade: 1, percentual: 3.8 },
    { faixa: "0-9.9", quantidade: 0, percentual: 0 }
  ]
};

export default function NotaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const notaId = params.id;
  const notaData = mockNotaDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      case 'Revisão':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Reprovado':
        return 'bg-red-100 text-red-800';
      case 'Recuperação':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className= gpu-accelerated instant-hover"relative overflow-hidden rounded-2xl bg-card border p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
            <div className="space-y-3 ultra-fast-fade">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-border bg-background text-foreground hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <FileText className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {notaData.disciplina.nome}
                  </h1>
                  <Badge className={getSituacaoColor(notaData.avaliacao.situacao)}>
                    {notaData.avaliacao.situacao}
                  </Badge>
                  <Badge className={getStatusColor(notaData.status)}>
                    {notaData.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {notaData.aluno.nome} • {notaData.turma.designacao}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {notaData.avaliacao.tipoAvaliacao} • {notaData.avaliacao.trimestre} • Nota: {notaData.avaliacao.nota}/{notaData.avaliacao.notaMaxima}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button
                onClick={() => router.push(`/admin/academic-management/notes/edit/${notaId}`)}
                className="bg-[#3B6C4D] hover:bg-[#8B4513]"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Nota Obtida</p>
                <p className="text-2xl font-bold text-foreground">{notaData.avaliacao.nota}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Percentual</p>
                <p className="text-2xl font-bold text-foreground">{notaData.avaliacao.percentual}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                <p className="text-2xl font-bold text-foreground">{notaData.estatisticas.mediaGeral}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Posição na Turma</p>
                <p className="text-2xl font-bold text-foreground">{notaData.estatisticas.posicaoTurma}º</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="aluno">Aluno</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Informações da Avaliação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Disciplina</p>
                    <p className="text-foreground">{notaData.disciplina.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código</p>
                    <p className="text-foreground">{notaData.disciplina.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Trimestre</p>
                    <p className="text-foreground">{notaData.avaliacao.trimestre}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <p className="text-foreground">{notaData.avaliacao.tipoAvaliacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data da Avaliação</p>
                    <p className="text-foreground">{formatDate(notaData.avaliacao.dataAvaliacao)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Lançamento</p>
                    <p className="text-foreground">{formatDate(notaData.avaliacao.dataLancamento)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Informações da Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Designação</p>
                    <p className="text-foreground">{notaData.turma.designacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classe</p>
                    <p className="text-foreground">{notaData.turma.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Curso</p>
                    <p className="text-foreground">{notaData.turma.curso}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                    <p className="text-foreground">{notaData.turma.totalAlunos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Desempenho do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média Geral</p>
                    <p className="text-foreground">{notaData.estatisticas.mediaGeral}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Melhor Nota</p>
                    <p className="text-foreground">{notaData.estatisticas.melhorNota}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pior Nota</p>
                    <p className="text-foreground">{notaData.estatisticas.piorNota}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Avaliações</p>
                    <p className="text-foreground">{notaData.estatisticas.totalAvaliacoes}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Posição na Turma</p>
                    <p className="text-foreground">{notaData.estatisticas.posicaoTurma}º lugar</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Frequência</p>
                    <p className="text-foreground">{notaData.estatisticas.frequencia}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Professor Responsável
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {notaData.disciplina.professor}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {notaData.disciplina.nome} • {notaData.disciplina.cargaHoraria}h/semana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {notaData.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {notaData.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="aluno" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Informações do Aluno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {notaData.aluno.nome}
                  </h3>
                  <p className="text-muted-foreground">
                    Nº {notaData.aluno.numeroEstudante} • {notaData.aluno.idade} anos
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{notaData.aluno.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{notaData.aluno.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Responsável</p>
                      <p className="text-foreground">{notaData.aluno.responsavel}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Tel. Responsável</p>
                      <p className="text-foreground">{notaData.aluno.telefoneResponsavel}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Histórico de Notas na Disciplina
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 ultra-fast-fade">
                {mockHistoricoNotas.map((nota) => (
                  <div key={nota.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {nota.tipoAvaliacao} - {nota.trimestre}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(nota.data)}
                        </p>
                        {nota.observacoes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {nota.observacoes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{nota.nota}</p>
                        <p className="text-sm text-muted-foreground">/{notaData.avaliacao.notaMaxima}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Comparação com a Turma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Nota do Aluno</p>
                  <p className="text-2xl font-bold text-foreground">{notaData.avaliacao.nota}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Média da Turma</p>
                  <p className="text-2xl font-bold text-foreground">{mockComparacaoTurma.mediaTurma}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Melhor Nota</p>
                  <p className="text-2xl font-bold text-foreground">{mockComparacaoTurma.melhorNotaTurma}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">Pior Nota</p>
                  <p className="text-2xl font-bold text-foreground">{mockComparacaoTurma.piorNotaTurma}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-4">Distribuição de Notas na Turma</h4>
                <div className="space-y-3 ultra-fast-fade">
                  {mockComparacaoTurma.distribuicaoNotas.map((faixa, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-foreground w-16">{faixa.faixa}</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#3B6C4D] h-2 rounded-full" 
                            style={{ width: `${faixa.percentual}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">
                          {faixa.quantidade} alunos ({faixa.percentual}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
