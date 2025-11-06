'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WelcomeHeader } from '@/components/dashboard';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  GraduationCap,
  BookOpen,
  Calendar,
  Edit,
  Loader2
} from 'lucide-react';

interface Professor {
  codigo: number;
  nome: string;
  email: string;
  telefone: string;
  formacao: string;
  nivelAcademico: string;
  especialidade: string;
  numeroFuncionario: string;
  dataAdmissao: string;
  status: string;
  dataCadastro: string;
  tb_professor_disciplina: any[];
  tb_professor_turma: any[];
}

export default function ViewTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const professorId = params.id as string;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (professorId) {
      fetchProfessor();
    }
  }, [professorId]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/professores/${professorId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfessor(data.data);
        } else {
          setError(data.message || 'Erro ao carregar professor');
        }
      } else {
        setError('Erro ao carregar professor');
      }
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    return status === 'Activo' ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        Inativo
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="space-y-6">
        <WelcomeHeader title="Visualizar Professor" />
        <div className="text-center py-8 text-red-500">
          {error || 'Professor não encontrado'}
        </div>
      </div>
    );
  }

  // Calcular disciplinas e turmas únicas
  const uniqueDisciplinas = new Set(
    professor.tb_professor_disciplina?.map((d: any) => d.codigo_Disciplina) || []
  );
  const uniqueTurmas = new Set(
    professor.tb_professor_turma?.map((t: any) => t.codigo_Turma) || []
  );

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title={`Professor: ${professor.nome}`}
      />

      {/* Header com botões */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/admin/teacher-management/teacher/edit/${professor.codigo}`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/admin/teacher-management/teacher/${professor.codigo}/atribuicoes`)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Atribuições
          </Button>
        </div>
      </div>

      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome Completo</p>
              <p className="text-lg font-semibold">{professor.nome}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Número de Funcionário</p>
              <p className="text-lg">{professor.numeroFuncionario || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="mt-1">
                {getStatusBadge(professor.status)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Informações de Contato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-lg">{professor.email || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Telefone</p>
                <p className="text-lg">{professor.telefone || '-'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formação Acadêmica */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Formação Acadêmica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Formação</p>
              <p className="text-lg">{professor.formacao || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nível Acadêmico</p>
              <p className="text-lg">{professor.nivelAcademico || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Especialidade</p>
              <p className="text-lg">{professor.especialidade || '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas de Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Atribuições Acadêmicas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{uniqueDisciplinas.size}</div>
              <p className="text-sm text-blue-600">Disciplinas</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{uniqueTurmas.size}</div>
              <p className="text-sm text-green-600">Turmas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{professor.tb_professor_disciplina?.length || 0}</div>
              <p className="text-sm text-purple-600">Atribuições de Disciplina</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{professor.tb_professor_turma?.length || 0}</div>
              <p className="text-sm text-orange-600">Atribuições de Turma</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Admissão</p>
              <p className="text-lg">{formatDate(professor.dataAdmissao)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Cadastro</p>
              <p className="text-lg">{formatDate(professor.dataCadastro)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
