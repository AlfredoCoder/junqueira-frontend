'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  Eye, 
  GraduationCap,
  School,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WelcomeHeader from '@/components/layout/WelcomeHeader';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api.utils';
import { useRouter } from 'next/navigation';

interface Turma {
  codigo: number;
  nome: string;
  classe: string;
  curso: string;
  disciplina: {
    codigo: number;
    nome: string;
  };
}

interface Professor {
  codigo: number;
  nome: string;
  formacao: string;
  nivelAcademico: string;
  numeroFuncionario: string;
  status: string;
}

interface PerfilProfessor {
  usuario: {
    codigo: number;
    nome: string;
    username: string;
    tipo: string;
  };
  professor: Professor;
  turmas: Turma[];
  disciplinas: Array<{
    codigo: number;
    nome: string;
  }>;
}

export default function MinhasTurmasPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilProfessor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se é professor
    if (user && user.tipo !== 'Professor') {
      router.push('/admin');
      return;
    }

    carregarPerfil();
  }, [user, router]);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/api/professor/perfil');
      
      if (response.data.success) {
        setPerfil(response.data.data);
      } else {
        setError('Erro ao carregar dados do professor');
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setError('Erro ao carregar dados do professor');
    } finally {
      setLoading(false);
    }
  };

  const visualizarAlunos = (turmaId: number, turmaNome: string, disciplinaNome: string) => {
    router.push(`/admin/academic-management/minhas-turmas/${turmaId}/alunos?turma=${encodeURIComponent(turmaNome)}&disciplina=${encodeURIComponent(disciplinaNome)}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando suas turmas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={carregarPerfil} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Dados do professor não encontrados</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <WelcomeHeader 
        title="Minhas Turmas"
        description={`Gerencie suas turmas e visualize os alunos. Professor: ${perfil.professor.nome}`}
        iconMain={<School className="h-8 w-8 text-white" />}
      />

      {/* Informações do Professor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Informações do Professor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-medium">{perfil.professor.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Formação</p>
              <p className="font-medium">{perfil.professor.formacao}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nível Acadêmico</p>
              <p className="font-medium">{perfil.professor.nivelAcademico}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Funcionário</p>
              <p className="font-medium">{perfil.professor.numeroFuncionario}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant={perfil.professor.status === 'Activo' ? 'default' : 'secondary'}>
                {perfil.professor.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Turmas</p>
              <p className="font-medium text-blue-600">{perfil.turmas.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Turmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Suas Turmas ({perfil.turmas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {perfil.turmas.length === 0 ? (
            <div className="text-center py-8">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma turma atribuída</p>
              <p className="text-sm text-gray-500 mt-2">
                Entre em contato com a administração para receber atribuições de turmas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perfil.turmas.map((turma) => (
                <Card key={turma.codigo} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <School className="h-5 w-5 text-blue-600" />
                      {turma.nome}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <span className="font-medium">Classe:</span> {turma.classe}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <span className="font-medium">Curso:</span> {turma.curso}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          <span className="font-medium">Disciplina:</span> {turma.disciplina.nome}
                        </span>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <Button 
                        onClick={() => visualizarAlunos(turma.codigo, turma.nome, turma.disciplina.nome)}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Alunos e Notas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disciplinas Lecionadas */}
      {perfil.disciplinas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Disciplinas que Leciona
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {perfil.disciplinas.map((disciplina) => (
                <Badge key={disciplina.codigo} variant="outline" className="px-3 py-1">
                  {disciplina.nome}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
