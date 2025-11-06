"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// AlertDialog não disponível, usando confirm nativo
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';

interface PeriodoLancamento {
  codigo: number;
  nome: string;
  tipoNota: string;
  trimestre: number;
  anoLectivo: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  dataCriacao?: string;
  criadoPor?: string;
}

interface AnoLetivo {
  codigo: number;
  designacao: string;
}

export default function PeriodosLancamentoPage() {
  const [periodos, setPeriodos] = useState<PeriodoLancamento[]>([]);
  const [anosLetivos, setAnosLetivos] = useState<AnoLetivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [dialogAberto, setDialogAberto] = useState(false);
  
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [tipoNota, setTipoNota] = useState('');
  const [trimestre, setTrimestre] = useState('');
  const [anoLectivo, setAnoLectivo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    carregarPeriodos();
    carregarAnosLetivos();
  }, []);

  const carregarPeriodos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/periodos-lancamento');
      
      if (response.data.success) {
        setPeriodos(response.data.data);
      } else {
        toast.error('Erro ao carregar períodos');
      }
    } catch (error: any) {
      console.error('Erro ao carregar períodos:', error);
      toast.error('Erro ao carregar períodos');
    } finally {
      setLoading(false);
    }
  };

  const carregarAnosLetivos = async () => {
    try {
      const response = await api.get('/api/periodos-lancamento/anos-letivos');
      
      if (response.data.success) {
        setAnosLetivos(response.data.data);
        // Definir o primeiro ano como padrão se não há seleção
        if (response.data.data.length > 0 && !anoLectivo) {
          setAnoLectivo(response.data.data[0].designacao);
        }
      } else {
        toast.error('Erro ao carregar anos letivos');
      }
    } catch (error: any) {
      console.error('Erro ao carregar anos letivos:', error);
      // Fallback: usar ano atual se API falhar
      const anoAtual = new Date().getFullYear();
      setAnosLetivos([
        { codigo: 1, designacao: anoAtual.toString() },
        { codigo: 2, designacao: (anoAtual + 1).toString() }
      ]);
      setAnoLectivo(anoAtual.toString());
    }
  };

  const limparFormulario = () => {
    setNome('');
    setTipoNota('');
    setTrimestre('');
    setAnoLectivo(new Date().getFullYear().toString());
    setDataInicio('');
    setDataFim('');
  };

  const criarPeriodo = async () => {
    if (!nome || !tipoNota || !trimestre || !anoLectivo || !dataInicio || !dataFim) {
      toast.error('Todos os campos são obrigatórios');
      return;
    }

    if (new Date(dataFim) <= new Date(dataInicio)) {
      toast.error('Data de fim deve ser posterior à data de início');
      return;
    }

    try {
      setSalvando(true);
      const response = await api.post('/api/periodos-lancamento', {
        nome,
        tipoNota,
        trimestre: parseInt(trimestre),
        anoLectivo: parseInt(anoLectivo),
        dataInicio,
        dataFim
      });

      if (response.data.success) {
        toast.success('Período criado com sucesso');
        setDialogAberto(false);
        limparFormulario();
        carregarPeriodos();
      } else {
        toast.error(response.data.message || 'Erro ao criar período');
      }
    } catch (error: any) {
      console.error('Erro ao criar período:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar período');
    } finally {
      setSalvando(false);
    }
  };

  const alterarStatus = async (periodoId: number, novoStatus: string) => {
    try {
      const response = await api.put(`/api/periodos-lancamento/${periodoId}/status`, {
        status: novoStatus
      });

      if (response.data.success) {
        toast.success(`Período ${novoStatus === 'Ativo' ? 'ativado' : 'desativado'} com sucesso`);
        carregarPeriodos();
      } else {
        toast.error(response.data.message || 'Erro ao alterar status');
      }
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast.error(error?.response?.data?.message || 'Erro ao alterar status');
    }
  };

  const excluirPeriodo = async (periodoId: number) => {
    try {
      const response = await api.delete(`/api/periodos-lancamento/${periodoId}`);

      if (response.data.success) {
        toast.success('Período excluído com sucesso');
        carregarPeriodos();
      } else {
        toast.error(response.data.message || 'Erro ao excluir período');
      }
    } catch (error: any) {
      console.error('Erro ao excluir período:', error);
      toast.error(error?.response?.data?.message || 'Erro ao excluir período');
    }
  };

  const getStatusBadge = (status: string, dataInicio: string, dataFim: string) => {
    const agora = new Date();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (status === 'Ativo') {
      if (agora < inicio) {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Programado</Badge>;
      } else if (agora > fim) {
        return <Badge variant="secondary">Expirado</Badge>;
      } else {
        return <Badge variant="default" className="bg-green-600">Ativo</Badge>;
      }
    } else {
      return <Badge variant="secondary">Inativo</Badge>;
    }
  };

  const getTipoNotaBadge = (tipo: string) => {
    const cores = {
      'MAC': 'bg-blue-100 text-blue-800',
      'PP': 'bg-green-100 text-green-800',
      'PT': 'bg-purple-100 text-purple-800'
    };
    return <Badge className={cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800'}>{tipo}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Períodos de Lançamento</h1>
            <p className="text-gray-600">Gerencie os períodos para lançamento de notas</p>
          </div>
        </div>

        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogAberto(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Período
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Criar Novo Período</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Período</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: 1º Trimestre MAC 2024"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipoNota">Tipo de Nota</Label>
                  <Select value={tipoNota} onValueChange={setTipoNota}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAC">MAC (Média de Avaliação Contínua)</SelectItem>
                      <SelectItem value="PP">PP (Prova Parcial)</SelectItem>
                      <SelectItem value="PT">PT (Prova Trimestral)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trimestre">Trimestre</Label>
                  <Select value={trimestre} onValueChange={setTrimestre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Trimestre</SelectItem>
                      <SelectItem value="2">2º Trimestre</SelectItem>
                      <SelectItem value="3">3º Trimestre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="anoLectivo">Ano Letivo</Label>
                <Select value={anoLectivo} onValueChange={setAnoLectivo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano letivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {anosLetivos.map((ano) => (
                      <SelectItem key={ano.codigo} value={ano.designacao}>
                        {ano.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataInicio">Data de Início</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dataFim">Data de Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={criarPeriodo} disabled={salvando}>
                  {salvando ? 'Criando...' : 'Criar Período'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Períodos */}
      <div className="space-y-4">
        {periodos.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum período de lançamento criado</p>
            </CardContent>
          </Card>
        ) : (
          periodos.map((periodo) => (
            <Card key={periodo.codigo}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{periodo.nome}</h3>
                      {getTipoNotaBadge(periodo.tipoNota)}
                      {getStatusBadge(periodo.status, periodo.dataInicio, periodo.dataFim)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Trimestre:</span> {periodo.trimestre}º
                      </div>
                      <div>
                        <span className="font-medium">Ano:</span> {periodo.anoLectivo}
                      </div>
                      <div>
                        <span className="font-medium">Início:</span> {new Date(periodo.dataInicio).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Fim:</span> {new Date(periodo.dataFim).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Criado por {periodo.criadoPor || 'Sistema'} em {periodo.dataCriacao ? new Date(periodo.dataCriacao).toLocaleDateString('pt-BR') : 'Data não disponível'}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={periodo.status === 'Ativo' ? 'destructive' : 'default'}
                      size="sm"
                      onClick={() => alterarStatus(periodo.codigo, periodo.status === 'Ativo' ? 'Inativo' : 'Ativo')}
                    >
                      {periodo.status === 'Ativo' ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir o período "${periodo.nome}"? Esta ação não pode ser desfeita.`)) {
                          excluirPeriodo(periodo.codigo);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Informações sobre os tipos de nota */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Tipos de Nota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTipoNotaBadge('MAC')}
              </div>
              <p className="text-gray-700">
                <strong>Média de Avaliação Contínua:</strong> Notas de trabalhos, testes e participação ao longo do trimestre.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTipoNotaBadge('PP')}
              </div>
              <p className="text-gray-700">
                <strong>Prova Parcial:</strong> Avaliação intermediária do trimestre, geralmente no meio do período.
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getTipoNotaBadge('PT')}
              </div>
              <p className="text-gray-700">
                <strong>Prova Trimestral:</strong> Avaliação final do trimestre, realizada ao final do período.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
