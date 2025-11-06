"use client";

import React, { useCallback, useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  ArrowLeft,
  Edit,
  UserCheck,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Award,
  Target,
  BarChart3,
} from 'lucide-react';

interface DirectorTurma {
  id: number;
  professor: string;
  email: string;
  telefone: string;
  classe: string;
  turma: string;
  curso: string;
  sala: string;
  periodo: string;
  totalAlunos: number;
  capacidade: number;
  status: string;
  dataAtribuicao: string;
  experiencia: number;
  formacao: string;
  especialidade: string;
}

interface Aluno {
  id: number;
  nome: string;
  numero: string;
  idade: number;
  genero: string;
  situacao: string;
  media: number;
  faltas: number;
}

interface Disciplina {
  id: number;
  nome: string;
  codigo: string;
  professor: string;
  cargaHoraria: number;
  media: number;
  aprovacao: number;
}

export default function DirectorTurmaDetails() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [directorTurma, setDirectorTurma] = useState<DirectorTurma | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Dados mockados do diretor
  const directorTurmasData: DirectorTurma[] = [
    {
      id: 1,
      professor: "Prof. Maria Silva Santos",
      email: "maria.santos@Complexo Abilio Junqueira.edu.ao",
      telefone: "+244 923 456 789",
      classe: "10ª Classe",
      turma: "IG-10A-2024",
      curso: "Informática de Gestão",
      sala: "A1",
      periodo: "Manhã",
      totalAlunos: 35,
      capacidade: 40,
      status: "Ativo",
      dataAtribuicao: "2024-02-15",
      experiencia: 8,
      formacao: "Licenciatura em Informática",
      especialidade: "Gestão de Sistemas"
    },
    {
      id: 2,
      professor: "Prof. João Manuel Costa",
      email: "joao.costa@Complexo Abilio Junqueira.edu.ao",
      telefone: "+244 924 567 890",
      classe: "11ª Classe",
      turma: "CG-11B-2024",
      curso: "Contabilidade e Gestão",
      sala: "B2",
      periodo: "Tarde",
      totalAlunos: 32,
      capacidade: 35,
      status: "Ativo",
      dataAtribuicao: "2024-01-20",
      experiencia: 12,
      formacao: "Licenciatura em Contabilidade",
      especialidade: "Gestão Financeira"
    }
  ];

  // Dados mockados dos alunos da turma
  const alunosData: Aluno[] = [
    { id: 1, nome: "Ana Paula Francisco", numero: "2024001", idade: 16, genero: "F", situacao: "Aprovado", media: 16.5, faltas: 2 },
    { id: 2, nome: "Carlos Alberto Neto", numero: "2024002", idade: 17, genero: "M", situacao: "Aprovado", media: 15.8, faltas: 1 },
    { id: 3, nome: "Beatriz Santos Silva", numero: "2024003", idade: 16, genero: "F", situacao: "Aprovado", media: 17.2, faltas: 0 },
    { id: 4, nome: "Daniel Costa Pereira", numero: "2024004", idade: 17, genero: "M", situacao: "Recuperação", media: 12.5, faltas: 8 },
    { id: 5, nome: "Esperança Manuel", numero: "2024005", idade: 16, genero: "F", situacao: "Aprovado", media: 14.8, faltas: 3 }
  ];

  // Dados mockados das disciplinas da turma
  const disciplinasData: Disciplina[] = [
    { id: 1, nome: "Matemática", codigo: "MAT", professor: "Prof. António Silva", cargaHoraria: 6, media: 14.2, aprovacao: 85 },
    { id: 2, nome: "Português", codigo: "PORT", professor: "Prof. Maria Costa", cargaHoraria: 5, media: 15.1, aprovacao: 90 },
    { id: 3, nome: "Informática", codigo: "INFO", professor: "Prof. João Santos", cargaHoraria: 4, media: 16.8, aprovacao: 95 },
    { id: 4, nome: "Inglês", codigo: "ING", professor: "Prof. Ana Pereira", cargaHoraria: 3, media: 13.5, aprovacao: 78 },
    { id: 5, nome: "Física", codigo: "FIS", professor: "Prof. Carlos Neto", cargaHoraria: 4, media: 12.8, aprovacao: 72 }
  ];

  useEffect(() => {
    const loadDirector = async () => {
      setIsLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const directorTurmaId = parseInt(params.id as string);
      const foundDirector = directorTurmasData.find(d => d.id === directorTurmaId);
      
      if (foundDirector) {
        setDirectorTurma(foundDirector);
      }
      
      setIsLoading(false);
    };

    loadDirector();
  }, [params.id]);

  const handleEdit = useCallback(() => {
    router.push(`/admin/teacher-management/director-turma/edit/${params.id}`);
  }, []);
  const handleBack = useCallback(() => {
    router.back();
  }, []);
  if (isLoading) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4 loading-spinner"></div>
            <p className="text-gray-600">Carregando detalhes do diretor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!directorTurma) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diretor não encontrado</h2>
          <p className="text-gray-600 mb-6">O diretor de turma solicitado não foi encontrado.</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const ocupacao = Math.round((directorTurma.totalAlunos / directorTurma.capacidade) * 100);
  const mediaGeral = alunosData.reduce((sum, aluno) => sum + aluno.media, 0) / alunosData.length;
  const aprovados = alunosData.filter(aluno => aluno.situacao === "Aprovado").length;
  const taxaAprovacao = Math.round((aprovados / alunosData.length) * 100);

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 -mx-6 px-6 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Detalhes do Diretor de Turma
              </h1>
              <p className="text-sm text-gray-600">
                Informações completas e gestão da turma
              </p>
            </div>
          </div>
          <Button onClick={handleEdit} className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900">{directorTurma.totalAlunos}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Ocupação</p>
                <p className="text-2xl font-bold text-gray-900">{ocupacao}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold text-gray-900">{mediaGeral.toFixed(1)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">{taxaAprovacao}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="professor">Professor</TabsTrigger>
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Turma */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <School className="h-5 w-5 text-[#F9CD1D]" />
                  <span>Informações da Turma</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Designação</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.turma}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Classe</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.classe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Curso</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.curso}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sala</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.sala}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Período</p>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {directorTurma.periodo}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <Badge 
                      variant={directorTurma.status === "Ativo" ? "default" : "secondary"}
                      className={directorTurma.status === "Ativo" ? "bg-emerald-100 text-emerald-800" : ""}
                    >
                      {directorTurma.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas Acadêmicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-[#F9CD1D]" />
                  <span>Estatísticas Acadêmicas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 ultra-fast-fade">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Ocupação da Turma</span>
                    <span className="text-sm font-bold text-gray-900">{ocupacao}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${ocupacao}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3 ultra-fast-fade">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Taxa de Aprovação</span>
                    <span className="text-sm font-bold text-gray-900">{taxaAprovacao}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${taxaAprovacao}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{mediaGeral.toFixed(1)}</p>
                    <p className="text-xs text-gray-600">Média Geral</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{disciplinasData.length}</p>
                    <p className="text-xs text-gray-600">Disciplinas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="professor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-[#F9CD1D]" />
                <span>Informações do Professor</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 ultra-fast-fade">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome Completo</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.professor}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Formação</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.formacao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Especialidade</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.especialidade}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Experiência</p>
                    <p className="text-lg font-semibold text-gray-900">{directorTurma.experiencia} anos</p>
                  </div>
                </div>

                <div className="space-y-4 ultra-fast-fade">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{directorTurma.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Telefone</p>
                      <p className="text-lg font-semibold text-gray-900">{directorTurma.telefone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-600">Data de Atribuição</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {new Date(directorTurma.dataAtribuicao).toLocaleDateString('pt-AO')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alunos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-[#F9CD1D]" />
                <span>Lista de Alunos da Turma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>Idade</TableHead>
                      <TableHead>Gênero</TableHead>
                      <TableHead>Média</TableHead>
                      <TableHead>Faltas</TableHead>
                      <TableHead>Situação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunosData.map((aluno) => (
                      <TableRow key={aluno.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{aluno.nome}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{aluno.numero}</span>
                        </TableCell>
                        <TableCell>{aluno.idade} anos</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {aluno.genero}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${
                            aluno.media >= 16 ? 'text-green-600' :
                            aluno.media >= 14 ? 'text-blue-600' :
                            aluno.media >= 10 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {aluno.media.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`font-medium ${
                            aluno.faltas <= 3 ? 'text-green-600' :
                            aluno.faltas <= 6 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {aluno.faltas}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={aluno.situacao === "Aprovado" ? "default" : "secondary"}
                            className={
                              aluno.situacao === "Aprovado" ? "bg-emerald-100 text-emerald-800" :
                              aluno.situacao === "Recuperação" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }
                          >
                            {aluno.situacao}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disciplinas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-[#F9CD1D]" />
                <span>Disciplinas da Turma</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Carga Horária</TableHead>
                      <TableHead>Média da Turma</TableHead>
                      <TableHead>Taxa de Aprovação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {disciplinasData.map((disciplina) => (
                      <TableRow key={disciplina.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">{disciplina.nome}</p>
                            <p className="text-sm text-gray-500">{disciplina.codigo}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">{disciplina.professor}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{disciplina.cargaHoraria}h/semana</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold ${
                            disciplina.media >= 16 ? 'text-green-600' :
                            disciplina.media >= 14 ? 'text-blue-600' :
                            disciplina.media >= 10 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {disciplina.media.toFixed(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${
                              disciplina.aprovacao >= 85 ? 'text-green-600' :
                              disciplina.aprovacao >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {disciplina.aprovacao}%
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  disciplina.aprovacao >= 85 ? 'bg-green-600' :
                                  disciplina.aprovacao >= 70 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${disciplina.aprovacao}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
