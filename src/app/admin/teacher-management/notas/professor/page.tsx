"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, BookOpen, Users, GraduationCap, Save, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';

interface Disciplina {
  codigo: number;
  nome: string;
}

interface Turma {
  codigo: number;
  nome: string;
  classe: string;
  curso: string;
  disciplina: Disciplina;
  notaMaxima?: number; // Para identificar se é ensino primário (10) ou secundário (20)
}

interface Aluno {
  codigo: number;
  nome: string;
  numeroProcesso?: string;
  status: number;
}

interface PeriodoAtivo {
  codigo: number;
  nome: string;
  tipoNota: string;
  trimestre: number;
  anoLectivo: number;
  dataInicio: string;
  dataFim: string;
}

interface NotaAluno {
  alunoId: number;
  valor: string;
}

export default function LancamentoNotasProfessorPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [periodosAtivos, setPeriodosAtivos] = useState<PeriodoAtivo[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // Estados do formulário
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>('');
  const [notas, setNotas] = useState<Record<number, string>>({});

  // Função para determinar se é ensino primário (notas 0-10)
  const isEnsinoPrimario = (classe: string): boolean => {
    const classesPrimarias = [
      'Iniciação', 'PRÉ-CLASSE', 'Pré-Classe', 'INICIÇÃO',
      '1ª Classe', '2ª Classe', '3ª Classe', '4ª Classe', '5ª Classe', '6ª Classe'
    ];
    
    // Verificação mais específica: deve começar com uma das classes primárias
    // ou ser exatamente uma das classes primárias
    return classesPrimarias.some(cp => {
      const classeNormalizada = classe.trim().toLowerCase();
      const cpNormalizada = cp.toLowerCase();
      
      // Verifica se é exatamente a classe ou se começa com a classe seguida de espaço
      return classeNormalizada === cpNormalizada || 
             classeNormalizada.startsWith(cpNormalizada + ' ') ||
             classeNormalizada.startsWith(cpNormalizada + '-');
    });
  };

  // Função para obter nota máxima baseada na turma
  const getNotaMaxima = (turmaObj: Turma | null): number => {
    if (!turmaObj) return 20; // Padrão secundário
    
    // Se a turma tem notaMaxima definida e é maior que 0, usar ela
    if (turmaObj.notaMaxima && turmaObj.notaMaxima > 0) {
      return turmaObj.notaMaxima;
    }
    
    // Caso contrário, determinar pela classe
    return isEnsinoPrimario(turmaObj.classe) ? 10 : 20;
  };

  // Função para obter classificação baseada na nota e tipo de ensino
  const getClassificacao = (nota: number, isPrimario: boolean): string => {
    if (isPrimario) {
      // Ensino Primário (0-10)
      if (nota >= 5) return 'Positiva';
      return 'Negativa';
    } else {
      // Ensino Secundário (0-20)
      if (nota >= 10) return 'Positiva';
      return 'Negativa';
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (turmaSelecionada) {
      // Extrair o código da turma do valor selecionado (formato: "turmaId-disciplinaId")
      const turmaId = parseInt(turmaSelecionada.split('-')[0]);
      carregarAlunos(turmaId);
    }
  }, [turmaSelecionada]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      
      // Carregar turmas e períodos em paralelo
      const [turmasResponse, periodosResponse] = await Promise.all([
        api.get('/api/professor/turmas'),
        api.get('/api/periodos-lancamento/ativos')
      ]);

      if (turmasResponse.data.success) {
        setTurmas(turmasResponse.data.data);
      }

      if (periodosResponse.data.success) {
        setPeriodosAtivos(periodosResponse.data.data);
      }
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const carregarAlunos = async (turmaId: number) => {
    try {
      // Usar a API que funciona para buscar alunos
      const response = await api.get(`/api/academic-management/turmas/${turmaId}/alunos`);
      
      if (response.data.success) {
        // Mapear os dados para o formato esperado
        const alunosFormatados = response.data.data.map((aluno: any) => ({
          codigo: aluno.codigo,
          nome: aluno.nome,
          numeroProcesso: aluno.numero_documento || `ALU${aluno.codigo}`,
          status: 1 // Assumir ativo por padrão
        }));
        
        setAlunos(alunosFormatados);
        // Limpar notas quando trocar de turma
        setNotas({});
      } else {
        toast.error('Erro ao carregar alunos da turma');
      }
    } catch (error: any) {
      console.error('Erro ao carregar alunos:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar alunos');
    }
  };

  const handleNotaChange = (alunoId: number, valor: string) => {
    // Obter turma atual para determinar nota máxima
    const turmaObj = turmaSelecionada ? (() => {
      const [turmaId, disciplinaId] = turmaSelecionada.split('-').map(Number);
      return turmas.find(t => t.codigo === turmaId && t.disciplina.codigo === disciplinaId);
    })() : null;
    
    const notaMaxima = getNotaMaxima(turmaObj);
    
    // Validar se é um número válido dentro do limite da turma
    if (valor === '' || (!isNaN(parseFloat(valor)) && parseFloat(valor) >= 0 && parseFloat(valor) <= notaMaxima)) {
      setNotas(prev => ({
        ...prev,
        [alunoId]: valor
      }));
    }
  };

  const lancarNotas = async () => {
    if (!turmaSelecionada || !periodoSelecionado) {
      toast.error('Selecione uma turma e um período');
      return;
    }

    // Extrair turmaId e disciplinaId do valor selecionado
    const [turmaId, disciplinaId] = turmaSelecionada.split('-').map(Number);
    const turma = turmas.find(t => t.codigo === turmaId && t.disciplina.codigo === disciplinaId);
    const periodo = periodosAtivos.find(p => p.codigo === parseInt(periodoSelecionado));

    if (!turma || !periodo) {
      toast.error('Turma ou período inválido');
      return;
    }

    // Preparar notas para envio
    const notasParaEnvio: NotaAluno[] = Object.entries(notas)
      .filter(([_, valor]) => valor !== '' && !isNaN(parseFloat(valor)))
      .map(([alunoId, valor]) => ({
        alunoId: parseInt(alunoId),
        valor: valor
      }));

    if (notasParaEnvio.length === 0) {
      toast.error('Digite pelo menos uma nota válida');
      return;
    }

    try {
      setSalvando(true);
      
      const response = await api.post('/api/professor/lancar-notas', {
        turmaId: turmaId,
        disciplinaId: disciplinaId,
        tipoNota: periodo.tipoNota,
        trimestre: periodo.trimestre,
        anoLectivo: periodo.anoLectivo,
        notas: notasParaEnvio
      });

      if (response.data.success) {
        toast.success(`${notasParaEnvio.length} notas lançadas com sucesso!`);
        // Limpar formulário
        setNotas({});
      } else {
        toast.error(response.data.message || 'Erro ao lançar notas');
      }
    } catch (error: any) {
      console.error('Erro ao lançar notas:', error);
      toast.error(error?.response?.data?.message || 'Erro ao lançar notas');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Extrair turmaId e disciplinaId para encontrar o objeto da turma
  const turmaObj = turmaSelecionada ? (() => {
    const [turmaId, disciplinaId] = turmaSelecionada.split('-').map(Number);
    return turmas.find(t => t.codigo === turmaId && t.disciplina.codigo === disciplinaId);
  })() : null;
  const periodoObj = periodosAtivos.find(p => p.codigo === parseInt(periodoSelecionado));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lançamento de Notas</h1>
          <p className="text-gray-600">Selecione uma turma e período para lançar as notas</p>
        </div>
      </div>

      {/* Seleção de Turma e Período */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Selecionar Turma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Turma</Label>
              <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma, index) => (
                    <SelectItem key={`${turma.codigo}-${turma.disciplina.codigo}-${index}`} value={`${turma.codigo}-${turma.disciplina.codigo}`}>
                      {turma.nome} - {turma.classe} ({turma.disciplina.nome})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {turmaObj && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Curso:</strong> {turmaObj.curso}<br />
                    <strong>Disciplina:</strong> {turmaObj.disciplina.nome}<br />
                    <strong>Tipo de Ensino:</strong> {isEnsinoPrimario(turmaObj.classe) ? 'Primário (0-10)' : 'Secundário (0-20)'}
                    {isEnsinoPrimario(turmaObj.classe) && (
                      <span className="block text-xs mt-1 text-blue-600">
                        📝 Classificação: 5-10 = Positiva | 0-4 = Negativa
                      </span>
                    )}
                    {!isEnsinoPrimario(turmaObj.classe) && (
                      <span className="block text-xs mt-1 text-green-600">
                        📝 Classificação: 10-20 = Positiva | 0-9 = Negativa
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Período Ativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Período de Lançamento</Label>
              <Select value={periodoSelecionado} onValueChange={setPeriodoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  {periodosAtivos.map((periodo) => (
                    <SelectItem key={periodo.codigo} value={periodo.codigo.toString()}>
                      {periodo.nome} ({periodo.tipoNota})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {periodosAtivos.length === 0 && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Nenhum período ativo para lançamento de notas
                  </p>
                </div>
              )}
              {periodoObj && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Tipo:</strong> {periodoObj.tipoNota}<br />
                    <strong>Trimestre:</strong> {periodoObj.trimestre}º<br />
                    <strong>Período:</strong> {new Date(periodoObj.dataInicio).toLocaleDateString('pt-BR')} até {new Date(periodoObj.dataFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alunos para Lançamento */}
      {turmaSelecionada && alunos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Alunos da Turma ({alunos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 font-medium text-gray-700 border-b pb-2">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Nome do Aluno</div>
                <div className="col-span-3">Nº Processo</div>
                <div className="col-span-2">
                  Nota (0-{getNotaMaxima(turmaObj)})
                  {turmaObj && isEnsinoPrimario(turmaObj.classe) && (
                    <span className="text-xs text-blue-600 block">Ensino Primário</span>
                  )}
                  {turmaObj && !isEnsinoPrimario(turmaObj.classe) && (
                    <span className="text-xs text-green-600 block">Ensino Secundário</span>
                  )}
                </div>
                <div className="col-span-1">Status</div>
              </div>
              
              {alunos.map((aluno, index) => (
                <div key={aluno.codigo} className="grid grid-cols-12 gap-4 items-center py-2 border-b border-gray-100">
                  <div className="col-span-1 text-sm text-gray-600">
                    {index + 1}
                  </div>
                  <div className="col-span-5">
                    <p className="font-medium text-gray-900">{aluno.nome}</p>
                  </div>
                  <div className="col-span-3 text-sm text-gray-600">
                    {aluno.numeroProcesso || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      max={getNotaMaxima(turmaObj)}
                      step="0.1"
                      placeholder="0.0"
                      value={notas[aluno.codigo] || ''}
                      onChange={(e) => handleNotaChange(aluno.codigo, e.target.value)}
                      className="text-center"
                      disabled={!periodoSelecionado}
                      title={`Nota de 0 a ${getNotaMaxima(turmaObj)} ${turmaObj && isEnsinoPrimario(turmaObj.classe) ? '(Ensino Primário)' : '(Ensino Secundário)'}`}
                    />
                  </div>
                  <div className="col-span-1">
                    <Badge variant={aluno.status === 1 ? 'default' : 'secondary'}>
                      {aluno.status === 1 ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {Object.keys(notas).filter(key => notas[parseInt(key)] !== '').length} de {alunos.length} notas preenchidas
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setNotas({})}
                  disabled={Object.keys(notas).length === 0}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Limpar Notas
                </Button>
                <Button
                  onClick={lancarNotas}
                  disabled={salvando || !periodoSelecionado || Object.keys(notas).filter(key => notas[parseInt(key)] !== '').length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {salvando ? 'Salvando...' : 'Lançar Notas'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {turmaSelecionada && alunos.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum aluno encontrado nesta turma</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
