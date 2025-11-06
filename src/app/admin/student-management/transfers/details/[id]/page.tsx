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
  ArrowRightLeft,
  ArrowLeft,
  Edit,
  User,
  Calendar,
  BookOpen,
  Building,
  CheckCircle,
  Clock,
  Download,
  Printer,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  FileText,
} from 'lucide-react';

// Dados mockados da transferência para detalhes
const mockTransferDetails = {
  codigo: 1,
  codigoAluno: 1,
  dataTransferencia: "2024-02-20",
  escolaDestino: "Escola Secundária do Cazenga",
  motivoTransferencia: "Mudança de residência",
  obs: "Transferência por motivos familiares. A família mudou-se para o Cazenga e solicitou transferência para escola mais próxima da nova residência.",
  status: "Aprovada",
  dataActualizacao: "2024-02-21",
  tb_alunos: {
    codigo: 1,
    nome: "Ana Silva Santos",
    pai: "João Santos",
    mae: "Maria Silva",
    email: "ana.santos@email.com",
    telefone: "923456789",
    dataNascimento: "2005-03-15",
    sexo: "F",
    n_documento_identificacao: "123456789LA041",
    morada: "Rua das Flores, 123, Luanda",
    tb_encarregados: {
      codigo: 1,
      nome: "João Santos",
      telefone: "912345678",
      email: "joao.santos@email.com",
      local_Trabalho: "Empresa ABC Lda",
      tb_profissao: {
        codigo: 1,
        designacao: "Engenheiro Civil"
      }
    },
    tb_tipo_documento: {
      codigo: 1,
      designacao: "Bilhete de Identidade"
    },
    tb_matriculas: {
      codigo: 1,
      data_Matricula: "2024-02-01",
      tb_cursos: {
        codigo: 1,
        designacao: "Informática de Gestão",
        duracao: "3 anos",
        descricao: "Curso técnico profissional de Informática de Gestão"
      }
    }
  }
};

export default function TransferDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const transferId = params.id;
  const transfer = mockTransferDetails;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
            <div className="space-y-3 ultra-fast-fade">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <ArrowRightLeft className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Detalhes da Transferência
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">{transfer.tb_alunos.nome}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Visualize todas as informações detalhadas da transferência, incluindo dados do aluno,
                escola destino e motivo da transferência.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </Button>

              <Button
                variant="outline"
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Printer className="w-5 h-5 mr-2" />
                Imprimir
              </Button>

              <Button
                onClick={() => router.push(`/admin/student-management/transfers/edit/${transferId}`)}
                className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                <Edit className="w-5 h-5 mr-2" />
                Editar Transferência
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D2B48C]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              {formatDate(transfer.dataTransferencia)}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Data Transferência</p>
            <p className="text-2xl font-bold text-gray-900">{formatDate(transfer.dataTransferencia)}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <Badge 
              variant={
                transfer.status === "Aprovada" ? "default" : 
                transfer.status === "Pendente" ? "secondary" : 
                "destructive"
              }
              className={
                transfer.status === "Aprovada" ? "text-xs bg-emerald-100 text-emerald-800" :
                transfer.status === "Pendente" ? "text-xs bg-yellow-100 text-yellow-800" :
                "text-xs bg-red-100 text-red-800"
              }
            >
              {transfer.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-emerald-600">Status</p>
            <p className="text-2xl font-bold text-gray-900">{transfer.status}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#F5DEB3] shadow-sm">
              <Building className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              Destino
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Escola Destino</p>
            <p className="text-lg font-bold text-gray-900">{transfer.escolaDestino}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <Badge variant="outline" className="text-xs">
              Curso Atual
            </Badge>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Curso</p>
            <p className="text-lg font-bold text-gray-900">{transfer.tb_alunos.tb_matriculas.tb_cursos.designacao}</p>
          </div>
        </div>
      </div>

      {/* Tabs Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="student">Dados do Aluno</TabsTrigger>
          <TabsTrigger value="transfer">Transferência</TabsTrigger>
          <TabsTrigger value="enrollment">Matrícula</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações da Transferência */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  <span>Informações da Transferência</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Código da Transferência</label>
                    <p className="text-sm font-semibold text-gray-900">#{transfer.codigo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Transferência</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(transfer.dataTransferencia)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Escola Destino</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.escolaDestino}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <Badge 
                      variant={
                        transfer.status === "Aprovada" ? "default" : 
                        transfer.status === "Pendente" ? "secondary" : 
                        "destructive"
                      }
                      className={
                        transfer.status === "Aprovada" ? "bg-emerald-100 text-emerald-800" :
                        transfer.status === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }
                    >
                      {transfer.status}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Última Atualização</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(transfer.dataActualizacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo do Aluno */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Resumo do Aluno</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{transfer.tb_alunos.nome}</h3>
                    <p className="text-sm text-gray-500">
                      {calculateAge(transfer.tb_alunos.dataNascimento)} anos • {transfer.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3 ultra-fast-fade">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{transfer.tb_alunos.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{transfer.tb_alunos.telefone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{transfer.tb_alunos.morada}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Dados Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexo</label>
                    <p className="text-sm font-semibold text-gray-900">
                      {transfer.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data de Nascimento</label>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(transfer.tb_alunos.dataNascimento)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Idade</label>
                    <p className="text-sm font-semibold text-gray-900">{calculateAge(transfer.tb_alunos.dataNascimento)} anos</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome do Pai</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.pai}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome da Mãe</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.mae}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Encarregado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Encarregado de Educação</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.tb_encarregados.nome}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Profissão</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.tb_encarregados.tb_profissao.designacao}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Local de Trabalho</label>
                    <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.tb_encarregados.local_Trabalho}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="space-y-3 ultra-fast-fade">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{transfer.tb_alunos.tb_encarregados.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{transfer.tb_alunos.tb_encarregados.telefone}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transfer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Detalhes da Transferência</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Escola Destino</label>
                  <p className="text-lg font-semibold text-gray-900">{transfer.escolaDestino}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data da Transferência</label>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(transfer.dataTransferencia)}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Motivo da Transferência</label>
                  <p className="text-sm font-semibold text-gray-900">{transfer.motivoTransferencia}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Observações</label>
                  <p className="text-sm text-gray-600">{transfer.obs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Informações da Matrícula</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Código da Matrícula</label>
                  <p className="text-sm font-semibold text-gray-900">#{transfer.tb_alunos.tb_matriculas.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Data de Matrícula</label>
                  <p className="text-sm font-semibold text-gray-900">{formatDate(transfer.tb_alunos.tb_matriculas.data_Matricula)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Curso</label>
                  <p className="text-lg font-semibold text-gray-900">{transfer.tb_alunos.tb_matriculas.tb_cursos.designacao}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duração do Curso</label>
                  <p className="text-sm font-semibold text-gray-900">{transfer.tb_alunos.tb_matriculas.tb_cursos.duracao}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">Descrição do Curso</label>
                  <p className="text-sm text-gray-600">{transfer.tb_alunos.tb_matriculas.tb_cursos.descricao}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
