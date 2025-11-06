'use client';

import React, { useState, useEffect } from 'react';
import NotasService from '@/services/notas.service';
import { 
  IRelatorioTurma,
  IHistoricoNota,
  ITurmaBasica,
  IDisciplinaBasica
} from '@/types/professores.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Eye, 
  Download, 
  Filter, 
  Search, 
  BarChart3, 
  Users, 
  TrendingUp, 
  FileText,
  Calendar,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  History
} from 'lucide-react';

// Usando tipos do arquivo de tipos - removendo interfaces duplicadas

export default function VisualizacaoNotasPage() {
  // Estados
  const [turmas, setTurmas] = useState<ITurmaBasica[]>([]);
  const [disciplinas, setDisciplinas] = useState<IDisciplinaBasica[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<number | null>(null);
  const [trimestre, setTrimestre] = useState<number>(1);
  const [anoLectivo, setAnoLectivo] = useState<string>('2024');
  const [relatorio, setRelatorio] = useState<IRelatorioTurma | null>(null);
  const [filtroNome, setFiltroNome] = useState<string>('');
  const [filtroClassificacao, setFiltroClassificacao] = useState<string>('');
  const [historico, setHistorico] = useState<IHistoricoNota[]>([]);
  const [notaSelecionadaHistorico, setNotaSelecionadaHistorico] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string>('');

  // Carregar dados iniciais
  useEffect(() => {
    carregarTurmas();
    carregarDisciplinas();
  }, []);

  // Carregar relatório quando filtros mudarem
  useEffect(() => {
    if (turmaSelecionada && disciplinaSelecionada) {
      carregarRelatorio();
    }
  }, [turmaSelecionada, disciplinaSelecionada, trimestre, anoLectivo]);

  const carregarTurmas = async () => {
    try {
      // Dados fictícios para demonstração - em produção, usar API real
      const turmasFicticias: ITurmaBasica[] = [
        { codigo: 1, designacao: 'Turma 1', tb_classes: { designacao: '7ª Classe' } },
        { codigo: 2, designacao: 'Turma 2', tb_classes: { designacao: '8ª Classe' } },
        { codigo: 3, designacao: 'Turma 3', tb_classes: { designacao: '9ª Classe' } }
      ];
      setTurmas(turmasFicticias);
    } catch (error) {
      setErro('Erro ao carregar turmas');
    }
  };

  const carregarDisciplinas = async () => {
    try {
      // Dados fictícios para demonstração - em produção, usar API real
      const disciplinasFicticias: IDisciplinaBasica[] = [
        { codigo: 1, designacao: 'Matemática' },
        { codigo: 2, designacao: 'Português' },
        { codigo: 3, designacao: 'Física' }
      ];
      setDisciplinas(disciplinasFicticias);
    } catch (error) {
      setErro('Erro ao carregar disciplinas');
    }
  };

  const carregarRelatorio = async () => {
    if (!turmaSelecionada || !disciplinaSelecionada) return;

    try {
      setLoading(true);
      setErro('');
      
      const response = await NotasService.relatorioNotasTurma(
        turmaSelecionada,
        disciplinaSelecionada,
        trimestre,
        anoLectivo
      );
      
      if (response.success) {
        setRelatorio(response.data);
      } else {
        setErro('Erro ao carregar relatório');
        setRelatorio(null);
      }
    } catch (error) {
      setErro('Erro de conexão ao carregar relatório');
      setRelatorio(null);
    } finally {
      setLoading(false);
    }
  };

  const carregarHistorico = async (notaId: number) => {
    try {
      const response = await NotasService.buscarHistoricoNota(notaId);
      
      if (response.success) {
        setHistorico(response.data);
        setNotaSelecionadaHistorico(notaId);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  const exportarRelatorio = () => {
    if (!relatorio) return;
    NotasService.exportarCSV(relatorio);
  };

  const notasFiltradas = relatorio?.notas.filter(nota => {
    const nomeMatch = nota.tb_alunos?.nome?.toLowerCase().includes(filtroNome.toLowerCase()) ?? false;
    const classificacaoMatch = !filtroClassificacao || nota.classificacao === filtroClassificacao;
    return nomeMatch && classificacaoMatch;
  }) || [];

  const obterCorClassificacao = (classificacao?: string) => {
    switch (classificacao) {
      case 'Aprovado':
        return 'bg-green-100 text-green-800';
      case 'Reprovado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visualização de Notas</h1>
          <p className="text-gray-600 mt-2">Consulta e relatórios de avaliação</p>
        </div>
        
        {relatorio && (
          <Button onClick={exportarRelatorio} className="bg-[#8B4513] hover:bg-[#A0522D]">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        )}
      </div>

      {/* Alertas */}
      {erro && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-[#8B4513]" />
            Filtros de Consulta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Turma */}
            <div>
              <Label htmlFor="turma">Turma</Label>
              <Select value={turmaSelecionada?.toString() || ''} onValueChange={(value) => setTurmaSelecionada(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                      {turma.designacao} - {turma.tb_classes?.designacao || 'Classe'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Disciplina */}
            <div>
              <Label htmlFor="disciplina">Disciplina</Label>
              <Select value={disciplinaSelecionada?.toString() || ''} onValueChange={(value) => setDisciplinaSelecionada(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((disciplina) => (
                    <SelectItem key={disciplina.codigo} value={disciplina.codigo.toString()}>
                      {disciplina.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trimestre */}
            <div>
              <Label htmlFor="trimestre">Trimestre</Label>
              <Select value={trimestre.toString()} onValueChange={(value) => setTrimestre(parseInt(value))}>
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

            {/* Ano Letivo */}
            <div>
              <Label htmlFor="anoLectivo">Ano Letivo</Label>
              <Input
                value={anoLectivo}
                onChange={(e) => setAnoLectivo(e.target.value)}
                placeholder="2024"
              />
            </div>

            {/* Botão Consultar */}
            <div className="flex items-end">
              <Button 
                onClick={carregarRelatorio} 
                disabled={!turmaSelecionada || !disciplinaSelecionada || loading}
                className="w-full bg-[#8B4513] hover:bg-[#A0522D]"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Carregando...' : 'Consultar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      {relatorio && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-[#8B4513]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-gray-900">{relatorio.estatisticas.totalAlunos}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aprovados</p>
                  <p className="text-2xl font-bold text-green-600">{relatorio.estatisticas.aprovados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reprovados</p>
                  <p className="text-2xl font-bold text-red-600">{relatorio.estatisticas.reprovados}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-[#8B4513]" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-[#8B4513]">{relatorio.estatisticas.mediaGeral.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela de Notas */}
      {relatorio && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#8B4513]" />
                Notas - {relatorio.turma.designacao} - {relatorio.disciplina.designacao}
              </div>
              <Badge className="bg-[#8B4513] text-white">
                {trimestre}º Trimestre {anoLectivo}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filtros da tabela */}
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <Input
                  placeholder="Filtrar por nome do aluno..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filtroClassificacao} onValueChange={setFiltroClassificacao}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por classificação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  <SelectItem value="Aprovado">Aprovado</SelectItem>
                  <SelectItem value="Reprovado">Reprovado</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Nº</TableHead>
                    <TableHead>Nome do Aluno</TableHead>
                    <TableHead className="text-center">MAC</TableHead>
                    <TableHead className="text-center">PP</TableHead>
                    <TableHead className="text-center">PT</TableHead>
                    <TableHead className="text-center">MT</TableHead>
                    <TableHead className="text-center">Classificação</TableHead>
                    <TableHead>Observações</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notasFiltradas.map((nota, index) => (
                    <TableRow key={nota.codigo}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{nota.tb_alunos?.nome || `Aluno ${nota.codigo_Aluno}`}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {nota.notaMAC?.toFixed(1) || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {nota.notaPP?.toFixed(1) || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {nota.notaPT?.toFixed(1) || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={nota.mediaTrimestre && nota.mediaTrimestre >= 10 ? 'default' : 'destructive'}>
                          {nota.mediaTrimestre?.toFixed(1) || '-'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={obterCorClassificacao(nota.classificacao)}>
                          {nota.classificacao || 'Pendente'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {nota.observacoes || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => carregarHistorico(nota.codigo)}
                            >
                              <History className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Histórico de Alterações - {nota.tb_alunos?.nome || `Aluno ${nota.codigo_Aluno}`}</DialogTitle>
                            </DialogHeader>
                            <div className="max-h-96 overflow-y-auto">
                              {historico.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Campo</TableHead>
                                      <TableHead>Valor Anterior</TableHead>
                                      <TableHead>Valor Novo</TableHead>
                                      <TableHead>Alterado Por</TableHead>
                                      <TableHead>Data</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {historico.map((item) => (
                                      <TableRow key={item.codigo}>
                                        <TableCell className="font-medium">{item.campoAlterado}</TableCell>
                                        <TableCell>{item.valorAnterior?.toFixed(1) || '-'}</TableCell>
                                        <TableCell>{item.valorNovo?.toFixed(1) || '-'}</TableCell>
                                        <TableCell>{item.tb_utilizadores?.nome || `Usuário ${item.alteradoPor}`}</TableCell>
                                        <TableCell>{new Date(item.dataAlteracao).toLocaleString()}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <p className="text-center text-gray-500 py-4">Nenhuma alteração registrada</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {notasFiltradas.length === 0 && relatorio.notas.length > 0 && (
              <p className="text-center text-gray-500 py-4">Nenhuma nota encontrada com os filtros aplicados</p>
            )}

            {relatorio.notas.length === 0 && (
              <p className="text-center text-gray-500 py-4">Nenhuma nota lançada para esta turma/disciplina/trimestre</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Resumo de Aprovação */}
      {relatorio && relatorio.estatisticas.totalAlunos > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-[#8B4513]" />
              Resumo de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 ultra-fast-fade">
              <div className="flex items-center justify-between">
                <span>Taxa de Aprovação:</span>
                <Badge className="bg-[#8B4513] text-white">
                  {relatorio.estatisticas.percentualAprovacao.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#8B4513] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${relatorio.estatisticas.percentualAprovacao}%` }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Aprovados</p>
                  <p className="text-lg font-bold text-green-600">{relatorio.estatisticas.aprovados}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reprovados</p>
                  <p className="text-lg font-bold text-red-600">{relatorio.estatisticas.reprovados}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-lg font-bold text-yellow-600">{relatorio.estatisticas.pendentes}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
