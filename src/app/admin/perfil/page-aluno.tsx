"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  School, 
  Lock, 
  Eye, 
  EyeOff,
  Calendar,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  FileText,
  Award
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';
import { useStatusContencioso } from '@/hooks/useContencioso';

interface Disciplina {
  codigo: number;
  designacao: string;
}

interface NotaDisciplina {
  disciplina: Disciplina;
  trimestre1: {
    mac: number | null;
    pp: number | null;
    pt: number | null;
    media: number | null;
    classificacao: string | null;
  };
  trimestre2: {
    mac: number | null;
    pp: number | null;
    pt: number | null;
    media: number | null;
    classificacao: string | null;
  };
  trimestre3: {
    mac: number | null;
    pp: number | null;
    pt: number | null;
    media: number | null;
    classificacao: string | null;
  };
  mediaFinal: number | null;
  classificacaoFinal: string | null;
}

interface EstadoFinanceiro {
  saldo: number;
  totalPago: number;
  totalDevido: number;
  ultimoPagamento?: {
    data: string;
    valor: number;
    descricao: string;
  };
  mesesPagos?: string[];
  mesesPendentes?: string[];
  dadosAcademicos?: any;
}

interface Aluno {
  codigo: number;
  nome: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  sexo?: string;
  saldo?: number;
}

interface Turma {
  codigo: number;
  designacao: string;
  classe: {
    codigo: number;
    designacao: string;
  };
  curso: {
    codigo: number;
    designacao: string;
  };
}

interface Usuario {
  codigo: number;
  nome: string;
  user: string;
  tipo: string;
}

interface PerfilAlunoData {
  usuario: Usuario;
  aluno: Aluno;
  turma: Turma;
  disciplinas: Disciplina[];
  notas: NotaDisciplina[];
  estadoFinanceiro: EstadoFinanceiro;
}

export default function PerfilAlunoPage() {
  const [perfil, setPerfil] = useState<PerfilAlunoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('informacoes');
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Hook para verificar status de contencioso usando dados do perfil
  const { calcularStatusContencioso } = useStatusContencioso();
  
  // Calcular contencioso baseado nos dados do perfil
  const [statusContenciosoLocal, setStatusContenciosoLocal] = useState<{
    emContencioso: boolean;
    mesesContenciosos: string[];
    diasRestantes: number;
    podeVerNotas: boolean;
  }>({
    emContencioso: false,
    mesesContenciosos: [],
    diasRestantes: 0,
    podeVerNotas: true
  });

  useEffect(() => {
    console.log('🔍 [PERFIL FRONTEND] Perfil carregado:', perfil);
    console.log('💰 [PERFIL FRONTEND] Estado financeiro:', perfil?.estadoFinanceiro);
    console.log('📋 [PERFIL FRONTEND] Meses pendentes:', perfil?.estadoFinanceiro?.mesesPendentes);
    
    if (perfil?.estadoFinanceiro?.mesesPendentes) {
      console.log('⚙️ [PERFIL FRONTEND] Calculando status de contencioso...');
      const status = calcularStatusContencioso(perfil.estadoFinanceiro.mesesPendentes);
      console.log('📊 [PERFIL FRONTEND] Status calculado:', status);
      setStatusContenciosoLocal(status);
    } else {
      console.log('⚠️ [PERFIL FRONTEND] Nenhum mês pendente encontrado');
    }
  }, [perfil?.estadoFinanceiro?.mesesPendentes, calcularStatusContencioso]);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/aluno/perfil');
      
      if (response.data.success) {
        setPerfil(response.data.data);
      } else {
        toast.error('Erro ao carregar perfil');
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.error('Nova senha e confirmação não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setAlterandoSenha(true);
      const response = await api.put('/api/auth/integrated/change-password', {
        senhaAtual,
        novaSenha
      });

      if (response.data.success) {
        toast.success('Senha alterada com sucesso');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
      } else {
        toast.error(response.data.message || 'Erro ao alterar senha');
      }
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      toast.error(error?.response?.data?.message || 'Erro ao alterar senha');
    } finally {
      setAlterandoSenha(false);
    }
  };

  const formatarNota = (nota: number | null): string => {
    return nota !== null ? nota.toFixed(1) : '-';
  };

  const obterCorClassificacao = (classificacao: string | null): string => {
    if (!classificacao) return 'text-gray-500';
    
    switch (classificacao.toLowerCase()) {
      case 'excelente':
        return 'text-green-600 font-semibold';
      case 'muito bom':
        return 'text-blue-600 font-semibold';
      case 'bom':
        return 'text-yellow-600 font-semibold';
      case 'suficiente':
        return 'text-orange-600 font-semibold';
      case 'insuficiente':
        return 'text-red-600 font-semibold';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Perfil não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Perfil - Aluno</h1>
          <p className="text-gray-600">Visualize suas informações acadêmicas e notas</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informacoes">Informações</TabsTrigger>
          <TabsTrigger value="financeiro">Estado Financeiro</TabsTrigger>
          <TabsTrigger value="notas">Visualizar Notas</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informações do Usuário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome Completo</Label>
                  <p className="text-gray-900 font-medium">{perfil.aluno.nome}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome de Usuário</Label>
                  <p className="text-gray-900">{perfil.usuario.user}</p>
                </div>
                {perfil.aluno.email && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-gray-900">{perfil.aluno.email}</p>
                  </div>
                )}
                {perfil.aluno.telefone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                    <p className="text-gray-900">{perfil.aluno.telefone}</p>
                  </div>
                )}
                {perfil.aluno.dataNascimento && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Data de Nascimento</Label>
                    <p className="text-gray-900">
                      {new Date(perfil.aluno.dataNascimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {perfil.aluno.sexo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Sexo</Label>
                    <p className="text-gray-900">{perfil.aluno.sexo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações Acadêmicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Dados Acadêmicos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Turma</Label>
                  <p className="text-gray-900 font-medium">{perfil.turma.designacao}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Classe</Label>
                  <p className="text-gray-900">{perfil.turma.classe.designacao}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Curso</Label>
                  <p className="text-gray-900">{perfil.turma.curso.designacao}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo de Usuário</Label>
                  <Badge variant="outline" className="mt-1">
                    {perfil.usuario.tipo}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financeiro" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Estado Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Meses</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(perfil.estadoFinanceiro.mesesPagos?.length || 0) + (perfil.estadoFinanceiro.mesesPendentes?.length || 0)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Meses Pagos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {perfil.estadoFinanceiro.mesesPagos?.length || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <FileText className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Meses Pendentes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {perfil.estadoFinanceiro.mesesPendentes?.length || 0}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Total Pago</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {perfil.estadoFinanceiro.totalPago.toLocaleString('pt-AO')} Kz
                  </p>
                </div>
              </div>

              {/* Seção de Meses */}
              {((perfil.estadoFinanceiro.mesesPagos?.length || 0) > 0 || (perfil.estadoFinanceiro.mesesPendentes?.length || 0) > 0) && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Meses Pagos */}
                  {(perfil.estadoFinanceiro.mesesPagos?.length || 0) > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-green-800">
                        Meses Pagos ({perfil.estadoFinanceiro.mesesPagos?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {perfil.estadoFinanceiro.mesesPagos?.map((mes: string, index: number) => (
                          <Badge key={index} className="bg-green-100 text-green-800 border-green-300">
                            {mes}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meses Pendentes */}
                  {(perfil.estadoFinanceiro.mesesPendentes?.length || 0) > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-red-800">
                        Meses Pendentes ({perfil.estadoFinanceiro.mesesPendentes?.length || 0})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {perfil.estadoFinanceiro.mesesPendentes?.map((mes: string, index: number) => (
                          <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 border-red-300">
                            {mes}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Status de Contencioso */}
              {statusContenciosoLocal.emContencioso && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">⚠️ SITUAÇÃO: EM CONTENCIOSO</h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-red-700 text-sm">
                      <strong>Meses em atraso:</strong> {statusContenciosoLocal.mesesContenciosos.join(', ')}
                    </p>
                    <p className="text-red-700 text-sm">
                      <strong>Consequências:</strong> Acesso às notas bloqueado até regularização
                    </p>
                  </div>
                </div>
              )}

              {/* Aviso de prazo */}
              {!statusContenciosoLocal.emContencioso && statusContenciosoLocal.diasRestantes > 0 && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">⏰ Atenção: Prazo de Pagamento</h4>
                  </div>
                  <p className="text-yellow-700 text-sm">
                    Você tem {statusContenciosoLocal.diasRestantes} dias restantes para pagar o mês atual 
                    e evitar entrar em contencioso.
                  </p>
                </div>
              )}

              {perfil.estadoFinanceiro.ultimoPagamento && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Último Pagamento</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Data:</span> {' '}
                      {new Date(perfil.estadoFinanceiro.ultimoPagamento.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Valor:</span> {' '}
                      {perfil.estadoFinanceiro.ultimoPagamento.valor.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'AOA' 
                      })}
                    </div>
                    <div>
                      <span className="font-medium">Descrição:</span> {' '}
                      {perfil.estadoFinanceiro.ultimoPagamento.descricao}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Minhas Notas - {perfil.turma.classe.designacao} ({perfil.turma.curso.designacao})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Verificar se aluno está em contencioso */}
              {statusContenciosoLocal.emContencioso ? (
                <div className="space-y-4">
                  {/* Aviso de contencioso */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="w-8 h-8 text-red-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">
                          🚫 Acesso às Notas Bloqueado
                        </h3>
                        <p className="text-red-700">
                          Você está em contencioso financeiro
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-medium mb-2">
                        Meses em atraso ({statusContenciosoLocal.mesesContenciosos.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {statusContenciosoLocal.mesesContenciosos.map((mes: string, index: number) => (
                          <Badge key={index} variant="destructive" className="bg-red-600">
                            {mes}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-red-700">
                      <p><strong>Para ter acesso às suas notas:</strong></p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Quite todos os meses em atraso listados acima</li>
                        <li>Procure a secretaria para regularizar sua situação</li>
                        <li>Após o pagamento, o acesso será liberado automaticamente</li>
                      </ul>
                    </div>
                    
                    <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        <strong>💡 Dica:</strong> Entre em contato com a secretaria pelo telefone 915312187 
                        para mais informações sobre como regularizar sua situação.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Disciplina</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={5}>1º Trimestre</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={5}>2º Trimestre</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={5}>3º Trimestre</th>
                      <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={2}>Final</th>
                    </tr>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2"></th>
                      <th className="border border-gray-300 p-1 text-xs">MAC</th>
                      <th className="border border-gray-300 p-1 text-xs">PP</th>
                      <th className="border border-gray-300 p-1 text-xs">PT</th>
                      <th className="border border-gray-300 p-1 text-xs">Média</th>
                      <th className="border border-gray-300 p-1 text-xs">Class.</th>
                      <th className="border border-gray-300 p-1 text-xs">MAC</th>
                      <th className="border border-gray-300 p-1 text-xs">PP</th>
                      <th className="border border-gray-300 p-1 text-xs">PT</th>
                      <th className="border border-gray-300 p-1 text-xs">Média</th>
                      <th className="border border-gray-300 p-1 text-xs">Class.</th>
                      <th className="border border-gray-300 p-1 text-xs">MAC</th>
                      <th className="border border-gray-300 p-1 text-xs">PP</th>
                      <th className="border border-gray-300 p-1 text-xs">PT</th>
                      <th className="border border-gray-300 p-1 text-xs">Média</th>
                      <th className="border border-gray-300 p-1 text-xs">Class.</th>
                      <th className="border border-gray-300 p-1 text-xs">Média Final</th>
                      <th className="border border-gray-300 p-1 text-xs">Class. Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfil.disciplinas.map((disciplina) => {
                      const notaDisciplina = perfil.notas.find(n => n.disciplina.codigo === disciplina.codigo);
                      
                      return (
                        <tr key={disciplina.codigo} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">{disciplina.designacao}</td>
                          
                          {/* 1º Trimestre */}
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre1.mac || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre1.pp || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre1.pt || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm font-semibold">
                            {formatarNota(notaDisciplina?.trimestre1.media || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            <span className={obterCorClassificacao(notaDisciplina?.trimestre1.classificacao || null)}>
                              {notaDisciplina?.trimestre1.classificacao || '-'}
                            </span>
                          </td>
                          
                          {/* 2º Trimestre */}
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre2.mac || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre2.pp || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre2.pt || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm font-semibold">
                            {formatarNota(notaDisciplina?.trimestre2.media || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            <span className={obterCorClassificacao(notaDisciplina?.trimestre2.classificacao || null)}>
                              {notaDisciplina?.trimestre2.classificacao || '-'}
                            </span>
                          </td>
                          
                          {/* 3º Trimestre */}
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre3.mac || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre3.pp || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm">
                            {formatarNota(notaDisciplina?.trimestre3.pt || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-sm font-semibold">
                            {formatarNota(notaDisciplina?.trimestre3.media || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            <span className={obterCorClassificacao(notaDisciplina?.trimestre3.classificacao || null)}>
                              {notaDisciplina?.trimestre3.classificacao || '-'}
                            </span>
                          </td>
                          
                          {/* Final */}
                          <td className="border border-gray-300 p-2 text-center text-sm font-bold text-blue-600">
                            {formatarNota(notaDisciplina?.mediaFinal || null)}
                          </td>
                          <td className="border border-gray-300 p-2 text-center text-xs">
                            <span className={obterCorClassificacao(notaDisciplina?.classificacaoFinal || null)}>
                              {notaDisciplina?.classificacaoFinal || '-'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
                  <div className="mt-4 text-sm text-gray-600">
                    <p><strong>Legenda:</strong></p>
                    <p>MAC - Média de Avaliação Contínua | PP - Prova Parcial | PT - Prova Trimestral</p>
                    <p>Situação: Aprovado (≥10) | Reprovado (&lt;10)</p>
                    <p>As notas são atualizadas automaticamente quando os professores lançam as avaliações.</p>
                    <p>A média final é calculada como a média das médias dos trimestres.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alterar Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senhaAtual">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="senhaAtual"
                    type={mostrarSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                  >
                    {mostrarSenhaAtual ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="novaSenha">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="novaSenha"
                    type={mostrarNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Digite a nova senha (mín. 6 caracteres)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  >
                    {mostrarNovaSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  >
                    {mostrarConfirmarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={alterarSenha}
                disabled={alterandoSenha || !senhaAtual || !novaSenha || !confirmarSenha}
                className="w-full"
              >
                {alterandoSenha ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
