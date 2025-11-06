'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Download, 
  TrendingUp, 
  Users, 
  DollarSign, 
  FileText,
  Filter,
  RefreshCw,
  CalendarDays,
  Clock,
  BarChart3
} from 'lucide-react';
import { useRelatoriosVendas } from '@/hooks/useRelatoriosVendas';
import Container from '@/components/layout/Container';

const RelatoriosVendasPage = () => {
  const {
    loading,
    error,
    relatorioGeral,
    fetchRelatorioGeral,
    clearRelatorios
  } = useRelatoriosVendas();

  // Estados para filtros
  const [tipoFiltro, setTipoFiltro] = useState<'rapido' | 'personalizado'>('rapido');
  const [periodo, setPeriodo] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Carregar relatório inicial
  useEffect(() => {
    fetchRelatorioGeral('diario');
  }, [fetchRelatorioGeral]);

  // Gerar anos disponíveis (últimos 5 anos + próximos 2)
  const anosDisponiveis = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - 3 + i);

  // Meses do ano
  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  const handleBuscarRelatorio = () => {
    if (tipoFiltro === 'personalizado' && dataInicio && dataFim) {
      fetchRelatorioGeral('diario', dataInicio, dataFim);
    } else if (tipoFiltro === 'rapido') {
      if (periodo === 'mensal') {
        // Para mensal, usar ano e mês específicos
        const inicioMes = new Date(anoSelecionado, mesSelecionado - 1, 1);
        const fimMes = new Date(anoSelecionado, mesSelecionado, 0, 23, 59, 59);
        fetchRelatorioGeral('mensal', inicioMes.toISOString(), fimMes.toISOString());
      } else {
        fetchRelatorioGeral(periodo);
      }
    }
  };

  const handleExportarPDF = () => {
    if (!relatorioGeral) return;
    
    // Criar dados para o PDF
    const dadosPDF = {
      titulo: `Relatório de Vendas por Funcionário - ${periodo.charAt(0).toUpperCase() + periodo.slice(1)}`,
      periodo: relatorioGeral.periodo,
      dataInicio: formatarData(relatorioGeral.dataInicio),
      dataFim: formatarData(relatorioGeral.dataFim),
      totalGeral: relatorioGeral.totalGeral,
      totalPagamentos: relatorioGeral.totalPagamentos,
      funcionarios: relatorioGeral.funcionarios,
      resumo: relatorioGeral.resumo
    };

    // Gerar PDF
    gerarPDFRelatorio(dadosPDF);
  };

  const gerarPDFRelatorio = (dados: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${dados.titulo}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              color: #2563eb;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            .resumo {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .resumo-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .resumo-card h3 {
              margin: 0 0 10px 0;
              color: #2563eb;
            }
            .resumo-card p {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
            }
            .funcionarios-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .funcionarios-table th,
            .funcionarios-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .funcionarios-table th {
              background-color: #f8f9fa;
              font-weight: bold;
            }
            .funcionarios-table tr:nth-child(even) {
              background-color: #f8f9fa;
            }
            .valor {
              text-align: right;
              font-weight: bold;
            }
            .ranking {
              background-color: #2563eb;
              color: white;
              border-radius: 50%;
              width: 25px;
              height: 25px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${dados.titulo}</h1>
            <p><strong>Período:</strong> ${dados.dataInicio} até ${dados.dataFim}</p>
            <p><strong>Gerado em:</strong> ${new Date().toLocaleString('pt-BR', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</p>
          </div>

          <div class="resumo">
            <div class="resumo-card">
              <h3>Total Geral</h3>
              <p>${dados.totalGeral.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</p>
            </div>
            <div class="resumo-card">
              <h3>Total de Pagamentos</h3>
              <p>${dados.totalPagamentos}</p>
            </div>
            <div class="resumo-card">
              <h3>Funcionários Ativos</h3>
              <p>${dados.resumo.totalFuncionarios}</p>
            </div>
            <div class="resumo-card">
              <h3>Média por Funcionário</h3>
              <p>${dados.resumo.mediaVendasPorFuncionario.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</p>
            </div>
          </div>

          <h2>Ranking de Vendas por Funcionário</h2>
          <table class="funcionarios-table">
            <thead>
              <tr>
                <th>Posição</th>
                <th>Funcionário</th>
                <th>Quantidade de Pagamentos</th>
                <th>Total de Vendas</th>
                <th>% do Total</th>
              </tr>
            </thead>
            <tbody>
              ${dados.funcionarios.map((func: any, index: number) => `
                <tr>
                  <td><span class="ranking">${index + 1}</span></td>
                  <td>${func.funcionarioNome}</td>
                  <td>${func.quantidadePagamentos}</td>
                  <td class="valor">${func.totalVendas.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</td>
                  <td class="valor">${((func.totalVendas / dados.totalGeral) * 100).toFixed(1)}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir Relatório
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6b7280; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              Fechar
            </button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-AO', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    });
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <Container onLogout={handleLogout}>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Vendas</h1>
          <p className="text-gray-600 mt-1">Acompanhe o desempenho de vendas por funcionário</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportarPDF}
            disabled={!relatorioGeral || loading}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filtros Organizados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tipoFiltro} onValueChange={(value: any) => setTipoFiltro(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rapido" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Filtros Rápidos
              </TabsTrigger>
              <TabsTrigger value="personalizado" className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                Período Personalizado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rapido" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Período</Label>
                  <Select value={periodo} onValueChange={(value: any) => setPeriodo(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diario">📅 Hoje</SelectItem>
                      <SelectItem value="semanal">📊 Esta Semana</SelectItem>
                      <SelectItem value="mensal">📈 Mês Específico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {periodo === 'mensal' && (
                  <>
                    <div className="space-y-2">
                      <Label>Ano</Label>
                      <Select value={anoSelecionado.toString()} onValueChange={(value) => setAnoSelecionado(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {anosDisponiveis.map(ano => (
                            <SelectItem key={ano} value={ano.toString()}>{ano}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Mês</Label>
                      <Select value={mesSelecionado.toString()} onValueChange={(value) => setMesSelecionado(parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {meses.map(mes => (
                            <SelectItem key={mes.value} value={mes.value.toString()}>{mes.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="flex items-end">
                  <Button 
                    onClick={handleBuscarRelatorio}
                    disabled={loading}
                    className="w-full flex items-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                    Gerar Relatório
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personalizado" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={handleBuscarRelatorio}
                    disabled={loading || !dataInicio || !dataFim}
                    className="w-full flex items-center gap-2"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Calendar className="w-4 h-4" />
                    )}
                    Buscar Período
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Erro */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Carregando relatório...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo Geral */}
      {relatorioGeral && !loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Geral</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatarMoeda(relatorioGeral.totalGeral)} Kz
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {relatorioGeral.totalPagamentos}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Funcionários Ativos</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {relatorioGeral.resumo.totalFuncionarios}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Média por Funcionário</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatarMoeda(relatorioGeral.resumo.mediaVendasPorFuncionario)} Kz
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Período */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Período do Relatório</h3>
                  <p className="text-gray-600">
                    {formatarData(relatorioGeral.dataInicio)} até {formatarData(relatorioGeral.dataFim)}
                  </p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {relatorioGeral.periodo.charAt(0).toUpperCase() + relatorioGeral.periodo.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Ranking de Funcionários */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Ranking de Vendas por Funcionário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatorioGeral.funcionarios.map((funcionario, index) => (
                  <div key={funcionario.funcionarioId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold">{funcionario.funcionarioNome}</h4>
                        <p className="text-sm text-gray-600">
                          @{funcionario.funcionarioUser} • {funcionario.quantidadePagamentos} pagamentos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">
                        {formatarMoeda(funcionario.totalVendas)} Kz
                      </p>
                      <p className="text-sm text-gray-600">
                        {((funcionario.totalVendas / relatorioGeral.totalGeral) * 100).toFixed(1)}% do total
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </Container>
  );
};

export default RelatoriosVendasPage;
