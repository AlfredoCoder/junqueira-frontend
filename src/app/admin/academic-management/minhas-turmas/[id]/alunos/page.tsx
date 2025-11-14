'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  ArrowLeft,
  GraduationCap,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WelcomeHeader from '@/components/layout/WelcomeHeader';
import useAuth from '@/hooks/useAuth';
import api from '@/utils/api.utils';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

interface NotaAluno {
  codigo: number;
  codigo_Aluno: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  trimestre: number;
  notaMAC: number | null;
  notaPP: number | null;
  notaPT: number | null;
  mediaTrimestre: number | null;
  mediaFinal: number | null;
  classificacaoFinal: string | null;
  aprovacao: string | null;
}

interface Aluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  notas: {
    1: NotaAluno | null;
    2: NotaAluno | null;
    3: NotaAluno | null;
  };
  notasRaw: NotaAluno[];
  disciplina: number;
}

export default function AlunosTurmaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const turmaId = params.id as string;
  const turmaNome = searchParams.get('turma') || 'Turma';
  const disciplinaNome = searchParams.get('disciplina') || 'Disciplina';
  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se é professor
    const userType = user?.tipoDesignacao || user?.tipo || '';
    if (user && userType !== 'Professor') {
      router.push('/admin');
      return;
    }

    if (turmaId && typeof turmaId === 'string') {
      carregarAlunos();
    }
  }, [user, router, turmaId]);

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar alunos da turma
      const response = await api.get(`/api/professor/turmas/${turmaId}/alunos`);
      
      if (response.data.success) {
        setAlunos(response.data.data || []);
      } else {
        setError('Erro ao carregar alunos da turma');
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar alunos da turma');
    } finally {
      setLoading(false);
    }
  };

  const voltarParaTurmas = () => {
    router.push('/admin/academic-management/minhas-turmas');
  };

  const calcularMediaFinal = (notas: NotaAluno[]): number | null => {
    const notasComMedia = notas.filter(n => n.mediaTrimestre !== null);
    if (notasComMedia.length === 0) return null;
    
    const soma = notasComMedia.reduce((acc, n) => acc + (n.mediaTrimestre || 0), 0);
    return Math.round((soma / notasComMedia.length) * 100) / 100;
  };

  // Função para determinar se é ensino primário (notas 0-10)
  const isEnsinoPrimario = (turmaNome: string): boolean => {
    const classesPrimarias = [
      'Iniciação', 'PRÉ-CLASSE', 'Pré-Classe', 'INICIÇÃO',
      '1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', '5ª Classe', '6ª Classe'
    ];
    
    // Verificação mais específica: deve começar com uma das classes primárias
    // ou ser exatamente uma das classes primárias
    return classesPrimarias.some(cp => {
      const turmaNormalizada = turmaNome.trim().toLowerCase();
      const cpNormalizada = cp.toLowerCase();
      
      // Verifica se é exatamente a classe ou se começa com a classe seguida de espaço
      return turmaNormalizada === cpNormalizada || 
             turmaNormalizada.startsWith(cpNormalizada + ' ') ||
             turmaNormalizada.startsWith(cpNormalizada + '-');
    });
  };

  const obterClassificacao = (media: number | null): string => {
    if (media === null) return '-';
    
    const isPrimario = isEnsinoPrimario(turmaNome);
    
    if (isPrimario) {
      // Ensino Primário (0-10)
      if (media >= 5) return 'Positiva';
      return 'Negativa';
    } else {
      // Ensino Secundário (0-20)
      if (media >= 17) return 'Muito Bom';
      if (media >= 14) return 'Bom';
      if (media >= 10) return 'Suficiente';
      return 'Insuficiente';
    }
  };

  const obterAprovacao = (media: number | null): { status: string; color: string } => {
    if (media === null) return { status: '-', color: 'text-gray-500' };
    
    const isPrimario = isEnsinoPrimario(turmaNome);
    const limiteAprovacao = isPrimario ? 5 : 10;
    
    if (media >= limiteAprovacao) return { status: 'Aprovado', color: 'text-green-600' };
    return { status: 'Reprovado', color: 'text-red-600' };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando alunos...</p>
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
            <Button onClick={carregarAlunos} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          onClick={voltarParaTurmas}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <WelcomeHeader 
          title={`Alunos - ${turmaNome}`}
          description={`Disciplina: ${disciplinaNome} • Total de alunos: ${alunos.length}`}
          iconMain={<Users className="h-8 w-8 text-white" />}
        />
      </div>

      {/* Tabela de Alunos e Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas dos Alunos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alunos.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum aluno encontrado nesta turma</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-3 text-left font-semibold">Aluno</th>
                    <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={4}>1º Trimestre</th>
                    <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={4}>2º Trimestre</th>
                    <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={4}>3º Trimestre</th>
                    <th className="border border-gray-300 p-2 text-center font-semibold" colSpan={3}>Final</th>
                  </tr>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2"></th>
                    <th className="border border-gray-300 p-1 text-xs">MAC</th>
                    <th className="border border-gray-300 p-1 text-xs">PP</th>
                    <th className="border border-gray-300 p-1 text-xs">PT</th>
                    <th className="border border-gray-300 p-1 text-xs">Média</th>
                    <th className="border border-gray-300 p-1 text-xs">MAC</th>
                    <th className="border border-gray-300 p-1 text-xs">PP</th>
                    <th className="border border-gray-300 p-1 text-xs">PT</th>
                    <th className="border border-gray-300 p-1 text-xs">Média</th>
                    <th className="border border-gray-300 p-1 text-xs">MAC</th>
                    <th className="border border-gray-300 p-1 text-xs">PP</th>
                    <th className="border border-gray-300 p-1 text-xs">PT</th>
                    <th className="border border-gray-300 p-1 text-xs">Média</th>
                    <th className="border border-gray-300 p-1 text-xs">Média Final</th>
                    <th className="border border-gray-300 p-1 text-xs">Classificação</th>
                    <th className="border border-gray-300 p-1 text-xs">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {alunos.map((aluno) => {
                    // Notas já organizadas por trimestre no backend
                    const notasTrimestre1 = aluno.notas?.[1] || null;
                    const notasTrimestre2 = aluno.notas?.[2] || null;
                    const notasTrimestre3 = aluno.notas?.[3] || null;
                    
                    // Calcular média final usando as notas organizadas
                    const notasArray = aluno.notasRaw || [];
                    const mediaFinal = calcularMediaFinal(notasArray);
                    const classificacao = obterClassificacao(mediaFinal);
                    const aprovacao = obterAprovacao(mediaFinal);
                    
                    return (
                      <tr key={aluno.codigo} className="hover:bg-gray-50">
                        <td className="border border-gray-300 p-3">
                          <div>
                            <p className="font-medium">{aluno.nome}</p>
                            <p className="text-sm text-gray-500">{aluno.n_documento_identificacao}</p>
                          </div>
                        </td>
                        
                        {/* 1º Trimestre */}
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre1?.notaMAC ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre1?.notaPP ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre1?.notaPT ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm font-medium">
                          {notasTrimestre1?.mediaTrimestre ?? '-'}
                        </td>
                        
                        {/* 2º Trimestre */}
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre2?.notaMAC ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre2?.notaPP ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre2?.notaPT ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm font-medium">
                          {notasTrimestre2?.mediaTrimestre ?? '-'}
                        </td>
                        
                        {/* 3º Trimestre */}
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre3?.notaMAC ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre3?.notaPP ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {notasTrimestre3?.notaPT ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm font-medium">
                          {notasTrimestre3?.mediaTrimestre ?? '-'}
                        </td>
                        
                        {/* Final */}
                        <td className="border border-gray-300 p-2 text-center text-sm font-bold">
                          {mediaFinal ?? '-'}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          {classificacao}
                        </td>
                        <td className="border border-gray-300 p-2 text-center text-sm">
                          <span className={`font-medium ${aprovacao.color} flex items-center justify-center gap-1`}>
                            {aprovacao.status === 'Aprovado' && <CheckCircle className="w-4 h-4" />}
                            {aprovacao.status === 'Reprovado' && <XCircle className="w-4 h-4" />}
                            {aprovacao.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Legenda:</strong></p>
                <p>MAC - Média de Avaliação Contínua | PP - Prova Parcial | PT - Prova Trimestral</p>
                {isEnsinoPrimario(turmaNome) ? (
                  <>
                    <p><strong>Classificação (Ensino Primário):</strong> <span className="text-green-600">Positiva</span> (≥5) | <span className="text-red-600">Negativa</span> (&lt;5)</p>
                    <p><strong>Situação:</strong> <span className="text-green-600">Aprovado</span> (≥5) | <span className="text-red-600">Reprovado</span> (&lt;5)</p>
                  </>
                ) : (
                  <>
                    <p><strong>Classificação (Ensino Secundário):</strong> Muito Bom (≥17) | Bom (14-16) | Suficiente (10-13) | Insuficiente (&lt;10)</p>
                    <p><strong>Situação:</strong> <span className="text-green-600">Aprovado</span> (≥10) | <span className="text-red-600">Reprovado</span> (&lt;10)</p>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
