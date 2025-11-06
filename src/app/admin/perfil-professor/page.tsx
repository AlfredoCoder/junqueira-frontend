'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  GraduationCap, 
  Lock, 
  Eye, 
  EyeOff,
  Mail,
  Phone,
  Award,
  BookOpen,
  School,
  Users,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';
import useAuth from '@/hooks/useAuth';

interface PerfilProfessor {
  usuario: {
    codigo: number;
    nome: string;
    username: string;
    tipo: string;
  };
  professor: {
    codigo: number;
    nome: string;
    email?: string;
    telefone?: string;
    formacao?: string;
    nivelAcademico?: string;
    numeroFuncionario?: string;
    status?: string;
    especialidade?: string;
  };
  turmas?: Array<{
    codigo: number;
    nome: string;
    classe: string;
    curso: string;
    sala?: string;
    totalAlunos?: number;
  }>;
  disciplinas?: Array<{
    codigo: number;
    nome: string;
    curso: string;
  }>;
}

export default function PerfilProfessorPage() {
  const { user } = useAuth();
  const [perfil, setPerfil] = useState<PerfilProfessor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('informacoes');
  
  // Estados para alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      console.log('🔍 [PERFIL PROFESSOR] Carregando perfil do professor...');
      
      const response = await api.get('/api/professor/perfil');
      
      if (response.data.success) {
        console.log('✅ [PERFIL PROFESSOR] Perfil carregado:', response.data.data);
        setPerfil(response.data.data);
      } else {
        toast.error(response.data.message || 'Erro ao carregar perfil');
      }
    } catch (error: any) {
      console.error('❌ [PERFIL PROFESSOR] Erro ao carregar perfil:', error);
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
      toast.error('As senhas não coincidem');
      return;
    }

    if (novaSenha.length < 6) {
      toast.error('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      setAlterandoSenha(true);
      
      const response = await api.post('/api/auth/integrated/change-password', {
        senhaAtual,
        novaSenha
      });

      if (response.data.success) {
        toast.success('Senha alterada com sucesso!');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        setActiveTab('informacoes');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          Meu Perfil - Professor
        </h1>
        <p className="text-gray-600 mt-2">
          Gerencie suas informações pessoais e configurações de conta
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informacoes" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Aba Informações */}
        <TabsContent value="informacoes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
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
                  <p className="text-gray-900 font-medium">{perfil.professor?.nome || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nome de Usuário</Label>
                  <p className="text-gray-900">{perfil.usuario.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipo de Usuário</Label>
                  <Badge variant="outline">Professor</Badge>
                </div>
                {perfil.professor?.email && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {perfil.professor.email}
                    </p>
                  </div>
                )}
                {perfil.professor?.telefone && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Telefone</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {perfil.professor.telefone}
                    </p>
                  </div>
                )}
                {perfil.professor?.numeroFuncionario && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Número de Funcionário</Label>
                    <p className="text-gray-900">{perfil.professor.numeroFuncionario}</p>
                  </div>
                )}
                {perfil.professor?.status && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Status</Label>
                    <Badge variant={perfil.professor.status === 'Activo' ? 'default' : 'secondary'}>
                      {perfil.professor.status}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dados Profissionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Dados Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {perfil.professor?.formacao && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Formação</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      {perfil.professor.formacao}
                    </p>
                  </div>
                )}
                {perfil.professor?.nivelAcademico && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Nível Acadêmico</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      {perfil.professor.nivelAcademico}
                    </p>
                  </div>
                )}
                {perfil.professor?.especialidade && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Especialidade</Label>
                    <p className="text-gray-900 flex items-center gap-2">
                      <School className="h-4 w-4 text-gray-500" />
                      {perfil.professor.especialidade}
                    </p>
                  </div>
                )}
                {perfil.turmas && perfil.turmas.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Turmas Atribuídas</Label>
                    <p className="text-blue-600 font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {perfil.turmas.length} turma(s)
                    </p>
                  </div>
                )}
                {perfil.disciplinas && perfil.disciplinas.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Disciplinas</Label>
                    <p className="text-blue-600 font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {perfil.disciplinas.length} disciplina(s)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Turmas e Disciplinas */}
          {((perfil.turmas && perfil.turmas.length > 0) || (perfil.disciplinas && perfil.disciplinas.length > 0)) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Turmas */}
              {perfil.turmas && perfil.turmas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Minhas Turmas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {perfil.turmas.map((turma, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                          <p className="font-medium text-gray-900">{turma.nome}</p>
                          <p className="text-sm text-gray-600">{turma.classe} - {turma.curso}</p>
                          {turma.sala && (
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              Sala: {turma.sala}
                            </p>
                          )}
                          {turma.totalAlunos && (
                            <p className="text-sm text-blue-600 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {turma.totalAlunos} alunos
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Disciplinas */}
              {perfil.disciplinas && perfil.disciplinas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Minhas Disciplinas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {perfil.disciplinas.map((disciplina, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                          <p className="font-medium text-gray-900">{disciplina.nome}</p>
                          <p className="text-sm text-gray-600">{disciplina.curso}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Aba Segurança */}
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
                    {mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    placeholder="Digite sua nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                  >
                    {mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                    placeholder="Confirme sua nova senha"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                  >
                    {mostrarConfirmarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={alterarSenha} 
                disabled={alterandoSenha}
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
