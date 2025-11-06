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
  Clock,
  ArrowLeft,
  Edit,
  Calendar,
  BookOpen,
  Users,
  MapPin,
  User,
  School,
  Download,
  Printer,
  Activity,
  TrendingUp,
} from 'lucide-react';

// Dados mockados do horário
const mockHorarioDetails = {
  id: 1,
  disciplina: {
    nome: "Matemática",
    codigo: "MAT",
    cargaHoraria: 5,
    descricao: "Disciplina fundamental que aborda álgebra, geometria e cálculo básico."
  },
  professor: {
    nome: "Prof. João Silva Santos",
    email: "joao.silva@Complexo Abilio Junqueira.ao",
    telefone: "+244 923 456 789",
    especialidade: "Matemática",
    experiencia: 8
  },
  turma: {
    designacao: "IG-10A-2024",
    classe: "10ª Classe",
    curso: "Informática de Gestão",
    totalAlunos: 28,
    periodo: "Manhã"
  },
  sala: {
    nome: "Sala A1",
    capacidade: 30,
    localizacao: "Bloco A",
    recursos: ["Projetor", "Quadro Interativo", "Ar Condicionado"]
  },
  horario: {
    diaSemana: "Segunda-feira",
    horaInicio: "08:00",
    horaFim: "09:30",
    duracao: "1h 30min",
    periodo: "Manhã"
  },
  status: "Ativo",
  dataCriacao: "2024-01-15",
  observacoes: "Aula com foco em resolução de problemas práticos. Utilização de recursos audiovisuais para melhor compreensão dos conceitos matemáticos.",
  // Estatísticas
  frequenciaMedia: 92.5,
  notaMediaTurma: 15.2,
  aulasMinistradas: 35,
  totalAulasPrevistas: 40
};

// Dados mockados de presença recente
const mockPresencaRecente = [
  { data: "2024-03-18", presentes: 26, ausentes: 2, percentual: 92.9 },
  { data: "2024-03-11", presentes: 25, ausentes: 3, percentual: 89.3 },
  { data: "2024-03-04", presentes: 27, ausentes: 1, percentual: 96.4 },
  { data: "2024-02-26", presentes: 24, ausentes: 4, percentual: 85.7 },
  { data: "2024-02-19", presentes: 28, ausentes: 0, percentual: 100.0 },
];

// Dados mockados de conteúdo programático
const mockConteudoProgramatico = [
  {
    unidade: 1,
    titulo: "Álgebra Básica",
    topicos: ["Equações do 1º grau", "Sistemas lineares", "Inequações"],
    status: "Concluído",
    progresso: 100
  },
  {
    unidade: 2,
    titulo: "Geometria Plana",
    topicos: ["Triângulos", "Quadriláteros", "Círculos"],
    status: "Em andamento",
    progresso: 75
  },
  {
    unidade: 3,
    titulo: "Funções",
    topicos: ["Função do 1º grau", "Função do 2º grau", "Função exponencial"],
    status: "Planejado",
    progresso: 0
  },
];

export default function HorarioDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const horarioId = params.id;
  const horarioData = mockHorarioDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Inativo':
        return 'bg-red-100 text-red-800';
      case 'Suspenso':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progresso: number) => {
    if (progresso === 100) return 'bg-green-500';
    if (progresso >= 50) return 'bg-yellow-500';
    return 'bg-gray-300';
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
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {horarioData.disciplina.nome}
                  </h1>
                  <Badge className={getStatusColor(horarioData.status)}>
                    {horarioData.status}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  {horarioData.turma.designacao} • {horarioData.horario.diaSemana}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {horarioData.horario.horaInicio} - {horarioData.horario.horaFim} • {horarioData.sala.nome} • {horarioData.professor.nome}
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
                onClick={() => router.push(`/admin/academic-management/hours/edit/${horarioId}`)}
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
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Frequência Média</p>
                <p className="text-2xl font-bold text-foreground">{horarioData.frequenciaMedia}%</p>
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
                <p className="text-sm font-medium text-muted-foreground">Nota Média</p>
                <p className="text-2xl font-bold text-foreground">{horarioData.notaMediaTurma}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Aulas Ministradas</p>
                <p className="text-2xl font-bold text-foreground">{horarioData.aulasMinistradas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                <p className="text-2xl font-bold text-foreground">{horarioData.turma.totalAlunos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="professor">Professor</TabsTrigger>
          <TabsTrigger value="presenca">Presença</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Informações do Horário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Disciplina</p>
                    <p className="text-foreground">{horarioData.disciplina.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Código</p>
                    <p className="text-foreground">{horarioData.disciplina.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dia da Semana</p>
                    <p className="text-foreground">{horarioData.horario.diaSemana}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Horário</p>
                    <p className="text-foreground">{horarioData.horario.horaInicio} - {horarioData.horario.horaFim}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Duração</p>
                    <p className="text-foreground">{horarioData.horario.duracao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(horarioData.status)}>
                      {horarioData.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <School className="h-5 w-5 mr-2" />
                  Informações da Turma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Designação</p>
                    <p className="text-foreground">{horarioData.turma.designacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Classe</p>
                    <p className="text-foreground">{horarioData.turma.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Curso</p>
                    <p className="text-foreground">{horarioData.turma.curso}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Alunos</p>
                    <p className="text-foreground">{horarioData.turma.totalAlunos}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Informações da Sala
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sala</p>
                    <p className="text-foreground">{horarioData.sala.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Localização</p>
                    <p className="text-foreground">{horarioData.sala.localizacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Capacidade</p>
                    <p className="text-foreground">{horarioData.sala.capacidade} alunos</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Recursos Disponíveis</p>
                  <div className="flex flex-wrap gap-2">
                    {horarioData.sala.recursos.map((recurso, index) => (
                      <Badge key={index} variant="outline">
                        {recurso}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Sobre a Disciplina
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {horarioData.disciplina.descricao}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Carga Horária</p>
                    <p className="text-foreground">{horarioData.disciplina.cargaHoraria}h/semana</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
                    <p className="text-foreground">{formatDate(horarioData.dataCriacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {horarioData.observacoes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">
                  {horarioData.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="professor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Professor Responsável
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-[#3B6C4D] rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {horarioData.professor.nome}
                  </h3>
                  <p className="text-muted-foreground">
                    Especialidade: {horarioData.professor.especialidade}
                  </p>
                  <p className="text-muted-foreground">
                    Experiência: {horarioData.professor.experiencia} anos
                  </p>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="text-foreground">{horarioData.professor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                      <p className="text-foreground">{horarioData.professor.telefone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="presenca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Presença Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 ultra-fast-fade">
                {mockPresencaRecente.map((presenca, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {formatDate(presenca.data)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Presentes: {presenca.presentes} • Ausentes: {presenca.ausentes}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{presenca.percentual}%</p>
                        <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${presenca.percentual}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Conteúdo Programático
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 ultra-fast-fade">
                {mockConteudoProgramatico.map((unidade) => (
                  <div key={unidade.unidade} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          Unidade {unidade.unidade}: {unidade.titulo}
                        </h4>
                        <Badge variant="outline" className={
                          unidade.status === 'Concluído' ? 'border-green-500 text-green-700' :
                          unidade.status === 'Em andamento' ? 'border-yellow-500 text-yellow-700' :
                          'border-gray-500 text-gray-700'
                        }>
                          {unidade.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">Progresso</p>
                        <p className="text-lg font-semibold text-foreground">{unidade.progresso}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(unidade.progresso)}`}
                        style={{ width: `${unidade.progresso}%` }}
                      ></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Tópicos:</p>
                      <div className="flex flex-wrap gap-2">
                        {unidade.topicos.map((topico, index) => (
                          <Badge key={index} variant="outline">
                            {topico}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
