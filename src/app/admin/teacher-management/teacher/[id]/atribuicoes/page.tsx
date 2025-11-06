'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WelcomeHeader } from '@/components/dashboard';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Plus,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';

interface Atribuicao {
  codigo: number;
  codigo_Disciplina: number;
  codigo_Curso: number;
  codigo_Turma?: number;
  anoLectivo: string;
  status: string;
  tb_disciplinas: {
    codigo: number;
    designacao: string;
  };
  tb_cursos: {
    codigo: number;
    designacao: string;
  };
  tb_turmas?: {
    codigo: number;
    designacao: string;
    tb_classes: {
      designacao: string;
    };
  };
}

interface Professor {
  codigo: number;
  nome: string;
  email: string;
  especialidade: string;
}

export default function AtribuicoesProfessorPage() {
  const params = useParams();
  const router = useRouter();
  const professorId = params.id as string;

  const [professor, setProfessor] = useState<Professor | null>(null);
  const [disciplinas, setDisciplinas] = useState<Atribuicao[]>([]);
  const [turmas, setTurmas] = useState<Atribuicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (professorId) {
      fetchAtribuicoes();
      fetchProfessor();
    }
  }, [professorId]);

  const fetchProfessor = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professores/${professorId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfessor(data.data);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
    }
  };

  const fetchAtribuicoes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/atribuicoes-professor/${professorId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDisciplinas(data.data.disciplinas || []);
          setTurmas(data.data.turmas || []);
        } else {
          setError(data.message || 'Erro ao carregar atribuições');
        }
      } else {
        setError('Erro ao carregar atribuições');
      }
    } catch (error) {
      console.error('Erro ao buscar atribuições:', error);
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAtribuicao = async (tipo: 'disciplina' | 'turma', codigo: number) => {
    if (!confirm('Tem certeza que deseja remover esta atribuição?')) {
      return;
    }

    try {
      const endpoint = tipo === 'disciplina' 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/professores/${professorId}/disciplinas/${codigo}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/professores/${professorId}/turmas/${codigo}`;

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Atribuição removida com sucesso!');
        fetchAtribuicoes(); // Recarregar dados
      } else {
        toast.error('Erro ao remover atribuição');
      }
    } catch (error) {
      console.error('Erro ao remover atribuição:', error);
      toast.error('Erro de conexão');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title={`Atribuições - ${professor?.nome || 'Professor'}`}
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
        
        <Button
          onClick={() => router.push(`/admin/teacher-management/discpline-teacher?professor=${professorId}`)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova Atribuição
        </Button>
      </div>

      {/* Informações do Professor */}
      {professor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações do Professor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Nome</p>
                <p className="text-lg font-semibold">{professor.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{professor.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Especialidade</p>
                <p>{professor.especialidade}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Atribuições de Disciplinas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Disciplinas Atribuídas ({disciplinas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {disciplinas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinas.map((disciplina) => (
                  <TableRow key={disciplina.codigo}>
                    <TableCell className="font-medium">
                      {disciplina.tb_disciplinas.designacao}
                    </TableCell>
                    <TableCell>
                      {disciplina.tb_cursos.designacao}
                    </TableCell>
                    <TableCell>
                      {disciplina.anoLectivo}
                    </TableCell>
                    <TableCell>
                      <Badge variant={disciplina.status === 'Activo' ? 'default' : 'secondary'}>
                        {disciplina.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleDeleteAtribuicao('disciplina', disciplina.codigo)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma disciplina atribuída
            </div>
          )}
        </CardContent>
      </Card>

      {/* Atribuições de Turmas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Turmas Atribuídas ({turmas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {turmas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turma</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Ano Letivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {turmas.map((turma) => (
                  <TableRow key={turma.codigo}>
                    <TableCell className="font-medium">
                      {turma.tb_turmas?.designacao}
                      <p className="text-sm text-gray-500">
                        {turma.tb_turmas?.tb_classes?.designacao}
                      </p>
                    </TableCell>
                    <TableCell>
                      {turma.tb_disciplinas.designacao}
                    </TableCell>
                    <TableCell>
                      {turma.anoLectivo}
                    </TableCell>
                    <TableCell>
                      <Badge variant={turma.status === 'Activo' ? 'default' : 'secondary'}>
                        {turma.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleDeleteAtribuicao('turma', turma.codigo)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhuma turma atribuída
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}
