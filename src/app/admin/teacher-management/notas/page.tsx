'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen, Users, Calendar, Save, Eye, Edit, 
  CheckCircle, XCircle, Clock, GraduationCap,
  FileText, AlertTriangle, User
} from 'lucide-react';

import StatCard from '@/components/layout/StatCard';
import { WelcomeHeader } from '@/components/dashboard';

interface Professor {
  codigo: number;
  nome: string;
  email: string;
}

interface Disciplina {
  codigo: number;
  designacao: string;
}

interface Turma {
  codigo: number;
  designacao: string;
  classe?: string;
  curso?: string;
  disciplinas: Disciplina[];
}

interface Aluno {
  codigo: number;
  nome: string;
  numeroEstudante: string;
  email?: string;
  status: string;
}

interface NotaAluno {
  codigo_Aluno: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  trimestre: number;
  anoLectivo: string;
  notaMAC?: number;
  notaPP?: number;
  notaPT?: number;
  notaFinal?: number;
  observacoes?: string;
}

interface AnoLectivo {
  codigo: number;
  designacao: string;
}

export default function LancamentoNotasUnificado() {
  // Estados principais
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<number | null>(null);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [anosLetivos, setAnosLetivos] = useState<AnoLectivo[]>([]);
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>('2024/2025');
  const [trimestre, setTrimestre] = useState<number>(1);
  
  // Estados de notas
  const [notas, setNotas] = useState<Map<number, NotaAluno>>(new Map());
  const [notasExistentes, setNotasExistentes] = useState<NotaAluno[]>([]);
  
  // Estados de controle
  const [loading, setLoading] = useState(false);
  const [salvandoNotas, setSalvandoNotas] = useState(false);
  
  // Estados de estatísticas
  const [stats, setStats] = useState({
    totalTurmas: 0,
    totalAlunos: 0,
    notasLancadas: 0,
    notasPendentes: 0
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  // Carregar turmas quando professor for selecionado
  useEffect(() => {
    if (professorSelecionado && anoLetivoSelecionado) {
      carregarTurmasProfessor();
    }
  }, [professorSelecionado, anoLetivoSelecionado]);

  // Carregar alunos quando turma for selecionada
  useEffect(() => {
    if (turmaSelecionada) {
      carregarAlunosTurma();
    }
  }, [turmaSelecionada]);

  // Carregar notas existentes quando disciplina for selecionada
  useEffect(() => {
    if (turmaSelecionada && disciplinaSelecionada && trimestre && anoLetivoSelecionado) {
      carregarNotasExistentes();
    }
  }, [turmaSelecionada, disciplinaSelecionada, trimestre, anoLetivoSelecionado]);

  const carregarDadosIniciais = async () => {
    try {
      setLoading(true);
      
      // Carregar professores
      const professoresRes = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/professores');
      if (professoresRes.ok) {
        const professoresData = await professoresRes.json();
        setProfessores(professoresData.data || []);
      }

      // Carregar anos letivos
      const anosRes = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/academic-management/anos-lectivos');
      if (anosRes.ok) {
        const anosData = await anosRes.json();
        setAnosLetivos(anosData.data || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      toast.error('Erro ao carregar dados iniciais');
    } finally {
      setLoading(false);
    }
  };

  const carregarTurmasProfessor = async () => {
    if (!professorSelecionado) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/grade-curricular/professor/${professorSelecionado}/turmas-disciplinas?anoLectivo=${anoLetivoSelecionado}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTurmas(data.data || []);
        setTurmaSelecionada(null);
        setDisciplinaSelecionada(null);
        setAlunos([]);
      } else {
        toast.error('Erro ao carregar turmas do professor');
      }
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      toast.error('Erro ao carregar turmas');
    } finally {
      setLoading(false);
    }
  };

  const carregarAlunosTurma = async () => {
    if (!turmaSelecionada) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/grade-curricular/turma/${turmaSelecionada.codigo}/alunos-confirmados?anoLectivo=${anoLetivoSelecionado}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setAlunos(data.data || []);
      } else {
        toast.error('Erro ao carregar alunos da turma');
      }
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast.error('Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const carregarNotasExistentes = async () => {
    if (!turmaSelecionada || !disciplinaSelecionada) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notas/turmas/${turmaSelecionada.codigo}/disciplinas/${disciplinaSelecionada}/trimestres/${trimestre}?anoLectivo=${anoLetivoSelecionado}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setNotasExistentes(data.data || []);
        
        // Preencher o mapa de notas com as notas existentes
        const notasMap = new Map();
        (data.data || []).forEach((nota: NotaAluno) => {
          notasMap.set(nota.codigo_Aluno, nota);
        });
        setNotas(notasMap);
      }
    } catch (error) {
      console.error('Erro ao carregar notas existentes:', error);
    }
  };

  const atualizarNota = (alunoId: number, campo: keyof NotaAluno, valor: any) => {
    setNotas(prev => {
      const novasNotas = new Map(prev);
      const notaExistente = novasNotas.get(alunoId) || {
        codigo_Aluno: alunoId,
        codigo_Disciplina: disciplinaSelecionada!,
        codigo_Turma: turmaSelecionada!.codigo,
        trimestre,
        anoLectivo: anoLetivoSelecionado
      };
      
      novasNotas.set(alunoId, {
        ...notaExistente,
        [campo]: valor
      });
      
      return novasNotas;
    });
  };

  const calcularNotaFinal = (notaMAC?: number, notaPP?: number, notaPT?: number): number | undefined => {
    if (notaMAC !== undefined && notaPP !== undefined && notaPT !== undefined) {
      return Math.round(((notaMAC * 0.3) + (notaPP * 0.3) + (notaPT * 0.4)) * 100) / 100;
    }
    return undefined;
  };

  const salvarNotas = async () => {
    if (!turmaSelecionada || !disciplinaSelecionada) {
      toast.error('Selecione uma turma e disciplina');
      return;
    }

    try {
      setSalvandoNotas(true);
      
      const notasParaSalvar = Array.from(notas.values()).map(nota => ({
        ...nota,
        notaFinal: calcularNotaFinal(nota.notaMAC, nota.notaPP, nota.notaPT)
      }));

      const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/notas/lancar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notas: notasParaSalvar,
          professorId: professorSelecionado
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Notas salvas com sucesso!');
          carregarNotasExistentes(); // Recarregar notas
        } else {
          toast.error(data.message || 'Erro ao salvar notas');
        }
      } else {
        toast.error('Erro ao salvar notas');
      }
    } catch (error) {
      console.error('Erro ao salvar notas:', error);
      toast.error('Erro ao salvar notas');
    } finally {
      setSalvandoNotas(false);
    }
  };

  // Calcular estatísticas
  useEffect(() => {
    const totalTurmas = turmas.length;
    const totalAlunos = alunos.length;
    const notasLancadas = Array.from(notas.values()).filter(nota => 
      nota.notaMAC !== undefined || nota.notaPP !== undefined || nota.notaPT !== undefined
    ).length;
    const notasPendentes = totalAlunos - notasLancadas;
    
    setStats({ totalTurmas, totalAlunos, notasLancadas, notasPendentes });
  }, [turmas, alunos, notas]);

  const professorAtual = professores.find(p => p.codigo === professorSelecionado);
  const disciplinaAtual = turmaSelecionada?.disciplinas.find(d => d.codigo === disciplinaSelecionada);

  return (
    <div className="space-y-6 ultra-fast-fade">
        {/* Header */}
        <WelcomeHeader 
          title="Lançamento de Notas"
        />

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Turmas Disponíveis"
            value={stats.totalTurmas.toString()}
            icon={BookOpen}
            change="0"
            changeType="up"
            color="text-blue-600"
            bgColor="bg-blue-50"
            accentColor="border-blue-200"
          />
          <StatCard
            title="Alunos na Turma"
            value={stats.totalAlunos.toString()}
            icon={Users}
            change="0"
            changeType="up"
            color="text-green-600"
            bgColor="bg-green-50"
            accentColor="border-green-200"
          />
          <StatCard
            title="Notas Lançadas"
            value={stats.notasLancadas.toString()}
            icon={CheckCircle}
            change="0"
            changeType="up"
            color="text-purple-600"
            bgColor="bg-purple-50"
            accentColor="border-purple-200"
          />
          <StatCard
            title="Notas Pendentes"
            value={stats.notasPendentes.toString()}
            icon={Clock}
            change="0"
            changeType="up"
            color="text-orange-600"
            bgColor="bg-orange-50"
            accentColor="border-orange-200"
          />
        </div>

        {/* Seleção de Contexto */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Seleção de Contexto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Professor</Label>
                <Select 
                  value={professorSelecionado?.toString() || ''} 
                  onValueChange={(value) => setProfessorSelecionado(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o professor" />
                  </SelectTrigger>
                  <SelectContent>
                    {professores.map(professor => (
                      <SelectItem key={professor.codigo} value={professor.codigo.toString()}>
                        {professor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Ano Letivo</Label>
                <Select 
                  value={anoLetivoSelecionado} 
                  onValueChange={setAnoLetivoSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {anosLetivos.map(ano => (
                      <SelectItem key={ano.codigo} value={ano.designacao}>
                        {ano.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Trimestre</Label>
                <Select 
                  value={trimestre.toString()} 
                  onValueChange={(value) => setTrimestre(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Trimestre</SelectItem>
                    <SelectItem value="2">2º Trimestre</SelectItem>
                    <SelectItem value="3">3º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {professorAtual && (
              <Alert className="mt-4">
                <User className="h-4 w-4" />
                <AlertDescription>
                  <strong>Professor selecionado:</strong> {professorAtual.nome} | 
                  <strong> Ano:</strong> {anoLetivoSelecionado} | 
                  <strong> Trimestre:</strong> {trimestre}º
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Seleção de Turma e Disciplina */}
        {professorSelecionado && turmas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Turmas e Disciplinas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Turma</Label>
                  <Select 
                    value={turmaSelecionada?.codigo.toString() || ''} 
                    onValueChange={(value) => {
                      const turma = turmas.find(t => t.codigo === parseInt(value));
                      setTurmaSelecionada(turma || null);
                      setDisciplinaSelecionada(null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {turmas.map(turma => (
                        <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                          {turma.designacao} - {turma.classe} ({turma.curso})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {turmaSelecionada && (
                  <div>
                    <Label>Disciplina</Label>
                    <Select 
                      value={disciplinaSelecionada?.toString() || ''} 
                      onValueChange={(value) => setDisciplinaSelecionada(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {turmaSelecionada.disciplinas.map(disciplina => (
                          <SelectItem key={disciplina.codigo} value={disciplina.codigo.toString()}>
                            {disciplina.designacao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {turmaSelecionada && disciplinaAtual && (
                <Alert className="mt-4">
                  <BookOpen className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Contexto:</strong> {turmaSelecionada.designacao} - {disciplinaAtual.designacao} | 
                    <strong> Alunos:</strong> {alunos.length}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabela de Lançamento de Notas */}
        {turmaSelecionada && disciplinaSelecionada && alunos.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Lançamento de Notas - {disciplinaAtual?.designacao}
                </CardTitle>
                <Button 
                  onClick={salvarNotas} 
                  disabled={salvandoNotas}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {salvandoNotas ? 'Salvando...' : 'Salvar Notas'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Número</TableHead>
                      <TableHead>MAC (30%)</TableHead>
                      <TableHead>PP (30%)</TableHead>
                      <TableHead>PT (40%)</TableHead>
                      <TableHead>Nota Final</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alunos.map((aluno, index) => {
                      const nota = notas.get(aluno.codigo);
                      const notaFinal = calcularNotaFinal(nota?.notaMAC, nota?.notaPP, nota?.notaPT);
                      const temNotas = nota?.notaMAC !== undefined || nota?.notaPP !== undefined || nota?.notaPT !== undefined;
                      
                      return (
                        <TableRow key={aluno.codigo}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{aluno.nome}</TableCell>
                          <TableCell>{aluno.numeroEstudante}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={nota?.notaMAC || ''}
                              onChange={(e) => atualizarNota(aluno.codigo, 'notaMAC', parseFloat(e.target.value) || undefined)}
                              className="w-20"
                              placeholder="0-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={nota?.notaPP || ''}
                              onChange={(e) => atualizarNota(aluno.codigo, 'notaPP', parseFloat(e.target.value) || undefined)}
                              className="w-20"
                              placeholder="0-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max="20"
                              step="0.1"
                              value={nota?.notaPT || ''}
                              onChange={(e) => atualizarNota(aluno.codigo, 'notaPT', parseFloat(e.target.value) || undefined)}
                              className="w-20"
                              placeholder="0-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={notaFinal !== undefined ? (notaFinal >= 10 ? 'default' : 'destructive') : 'secondary'}>
                              {notaFinal !== undefined ? notaFinal.toFixed(1) : '-'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {temNotas ? (
                              <Badge variant="default" className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Lançada
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Pendente
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estado vazio */}
        {!professorSelecionado && (
          <Card>
            <CardContent className="text-center py-12">
              <GraduationCap className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Selecione um Professor
              </h3>
              <p className="text-gray-500">
                Escolha um professor para ver suas turmas e disciplinas disponíveis.
              </p>
            </CardContent>
          </Card>
        )}

        {professorSelecionado && turmas.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhuma Turma Encontrada
              </h3>
              <p className="text-gray-500">
                Este professor não possui turmas atribuídas no ano letivo selecionado.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
