'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  BookOpen, 
  Award,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';

interface NotaAluno {
  disciplina: string;
  trimestre1?: number;
  trimestre2?: number;
  trimestre3?: number;
  mediaFinal?: number;
  status?: string;
}

interface DadosNotas {
  aluno: {
    nome: string;
    turma?: string;
    classe?: string;
    curso?: string;
  };
  notas: NotaAluno[];
  estatisticas: {
    totalDisciplinas: number;
    aprovado: number;
    reprovado: number;
    mediaGeral: number;
  };
}

export default function MinhasNotasPage() {
  const [dados, setDados] = useState<DadosNotas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotas();
  }, []);

  const carregarNotas = async () => {
    try {
      setLoading(true);
      console.log('🔍 [NOTAS ALUNO] Carregando notas...');
      
      const response = await api.get('/api/aluno/notas');
      
      if (response.data.success) {
        console.log('✅ [NOTAS ALUNO] Notas carregadas:', response.data.data);
        setDados(response.data.data);
      } else {
        toast.error(response.data.message || 'Erro ao carregar notas');
      }
    } catch (error: any) {
      console.error('❌ [NOTAS ALUNO] Erro ao carregar notas:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar notas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (mediaFinal?: number) => {
    if (!mediaFinal) return <Badge variant="secondary">N/A</Badge>;
    
    if (mediaFinal >= 10) {
      return <Badge variant="default" className="bg-green-500">Aprovado</Badge>;
    } else {
      return <Badge variant="destructive">Reprovado</Badge>;
    }
  };

  const getNotaColor = (nota?: number) => {
    if (!nota) return 'text-gray-400';
    if (nota >= 14) return 'text-green-600 font-bold';
    if (nota >= 10) return 'text-blue-600 font-medium';
    return 'text-red-600 font-medium';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notas...</p>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Nenhuma nota encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          Minhas Notas
        </h1>
        <p className="text-gray-600 mt-2">
          Visualize suas notas e desempenho acadêmico
        </p>
      </div>

      {/* Informações do Aluno */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <Label className="text-sm text-gray-600">Aluno</Label>
              <p className="font-bold text-gray-900">{dados.aluno.nome}</p>
            </div>
          </CardContent>
        </Card>
        
        {dados.aluno.turma && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Turma</Label>
                <p className="font-medium text-gray-900">{dados.aluno.turma}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {dados.aluno.classe && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Classe</Label>
                <p className="font-medium text-gray-900">{dados.aluno.classe}</p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {dados.aluno.curso && (
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <Label className="text-sm text-gray-600">Curso</Label>
                <p className="font-medium text-gray-900">{dados.aluno.curso}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Estatísticas */}
      {dados.estatisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Disciplinas</p>
                  <p className="text-2xl font-bold text-blue-600">{dados.estatisticas.totalDisciplinas}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Aprovado</p>
                  <p className="text-2xl font-bold text-green-600">{dados.estatisticas.aprovado}</p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reprovado</p>
                  <p className="text-2xl font-bold text-red-600">{dados.estatisticas.reprovado}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Média Geral</p>
                  <p className={`text-2xl font-bold ${getNotaColor(dados.estatisticas.mediaGeral)}`}>
                    {dados.estatisticas.mediaGeral?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabela de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Notas por Disciplina
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium text-gray-700">Disciplina</th>
                  <th className="text-center p-3 font-medium text-gray-700">1º Trimestre</th>
                  <th className="text-center p-3 font-medium text-gray-700">2º Trimestre</th>
                  <th className="text-center p-3 font-medium text-gray-700">3º Trimestre</th>
                  <th className="text-center p-3 font-medium text-gray-700">Média Final</th>
                  <th className="text-center p-3 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {dados.notas.map((nota, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">{nota.disciplina}</td>
                    <td className={`text-center p-3 ${getNotaColor(nota.trimestre1)}`}>
                      {nota.trimestre1?.toFixed(1) || '-'}
                    </td>
                    <td className={`text-center p-3 ${getNotaColor(nota.trimestre2)}`}>
                      {nota.trimestre2?.toFixed(1) || '-'}
                    </td>
                    <td className={`text-center p-3 ${getNotaColor(nota.trimestre3)}`}>
                      {nota.trimestre3?.toFixed(1) || '-'}
                    </td>
                    <td className={`text-center p-3 font-bold ${getNotaColor(nota.mediaFinal)}`}>
                      {nota.mediaFinal?.toFixed(1) || '-'}
                    </td>
                    <td className="text-center p-3">
                      {getStatusBadge(nota.mediaFinal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {dados.notas.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma nota lançada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
