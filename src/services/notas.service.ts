import api from '@/utils/api.utils';
import {
  IPeriodoAvaliacao,
  IPeriodoAvaliacaoInput,
  INotaAluno,
  INotaInput,
  INotasLoteInput,
  IHistoricoNota,
  IRelatorioTurma,
  IResultadoLote,
  IAlunoBasico,
  IApiResponse,
  IFiltrosPeriodos,
  IFiltrosNotas
} from '@/types/professores.types';

// ===============================================================
// SERVIÇO DE NOTAS E AVALIAÇÃO
// ===============================================================

export class NotasService {
  private static baseUrl = '/notas';

  /**
   * Listar períodos de avaliação
   */
  static async listarPeriodos(filtros: IFiltrosPeriodos = {}): Promise<IApiResponse<IPeriodoAvaliacao[]>> {
    const params = new URLSearchParams();
    
    if (filtros.anoLectivo) params.append('anoLectivo', filtros.anoLectivo);
    if (filtros.trimestre) params.append('trimestre', filtros.trimestre.toString());
    if (filtros.tipoAvaliacao) params.append('tipoAvaliacao', filtros.tipoAvaliacao);

    const response = await api.get(`${this.baseUrl}/periodos?${params.toString()}`);
    return response.data;
  }

  /**
   * Criar período de avaliação
   */
  static async criarPeriodo(dados: IPeriodoAvaliacaoInput): Promise<IApiResponse<IPeriodoAvaliacao>> {
    const response = await api.post(`${this.baseUrl}/periodos`, dados);
    return response.data;
  }

  /**
   * Buscar alunos de uma turma
   */
  static async buscarAlunosTurma(turmaId: number, anoLectivo?: string): Promise<IApiResponse<IAlunoBasico[]>> {
    const params = new URLSearchParams();
    if (anoLectivo) params.append('anoLectivo', anoLectivo);

    const response = await api.get(`${this.baseUrl}/turmas/${turmaId}/alunos?${params.toString()}`);
    return response.data;
  }

  /**
   * Buscar notas de uma turma/disciplina/trimestre
   */
  static async buscarNotasTurma(
    turmaId: number,
    disciplinaId: number,
    trimestre: number,
    anoLectivo?: string
  ): Promise<IApiResponse<INotaAluno[]>> {
    const params = new URLSearchParams();
    if (anoLectivo) params.append('anoLectivo', anoLectivo);

    const response = await api.get(
      `${this.baseUrl}/turmas/${turmaId}/disciplinas/${disciplinaId}/trimestres/${trimestre}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Lançar nota individual
   */
  static async lancarNota(dados: INotaInput): Promise<IApiResponse<INotaAluno>> {
    const response = await api.post(`${this.baseUrl}/lancar`, dados);
    return response.data;
  }

  /**
   * Lançar notas em lote
   */
  static async lancarNotasLote(dados: INotasLoteInput): Promise<IApiResponse<IResultadoLote>> {
    const response = await api.post(`${this.baseUrl}/lancar-lote`, dados);
    return response.data;
  }

  /**
   * Buscar histórico de alterações de uma nota
   */
  static async buscarHistoricoNota(notaId: number): Promise<IApiResponse<IHistoricoNota[]>> {
    const response = await api.get(`${this.baseUrl}/${notaId}/historico`);
    return response.data;
  }

  /**
   * Gerar relatório de notas por turma
   */
  static async relatorioNotasTurma(
    turmaId: number,
    disciplinaId: number,
    trimestre: number,
    anoLectivo?: string
  ): Promise<IApiResponse<IRelatorioTurma>> {
    const params = new URLSearchParams();
    if (anoLectivo) params.append('anoLectivo', anoLectivo);

    const response = await api.get(
      `${this.baseUrl}/relatorio/turmas/${turmaId}/disciplinas/${disciplinaId}/trimestres/${trimestre}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Calcular média do trimestre
   */
  static calcularMediaTrimestre(notaMAC?: number, notaPP?: number, notaPT?: number): number | null {
    const notas = [notaMAC, notaPP, notaPT].filter(nota => nota !== null && nota !== undefined);
    
    if (notas.length === 0) return null;
    if (notas.length < 3) return null; // Só calcula se todas as notas estiverem preenchidas
    
    return notas.reduce((sum, nota) => sum + nota!, 0) / notas.length;
  }

  /**
   * Determinar classificação baseada na média
   */
  static determinarClassificacao(media?: number | null): 'Aprovado' | 'Reprovado' | 'Pendente' {
    if (media === null || media === undefined) return 'Pendente';
    return media >= 10 ? 'Aprovado' : 'Reprovado';
  }

  /**
   * Verificar se pode editar nota baseado no período ativo
   */
  static podeEditarTipoNota(tipoNota: 'MAC' | 'PP' | 'PT', periodoAtivo?: IPeriodoAvaliacao): boolean {
    if (!periodoAtivo) return false;
    
    const hoje = new Date();
    const inicio = new Date(periodoAtivo.dataInicio);
    const fim = new Date(periodoAtivo.dataFim);
    
    // Verificar se estamos no período correto
    const noPeriodo = hoje >= inicio && hoje <= fim;
    
    // Verificar se o tipo de avaliação corresponde
    const tipoCorreto = periodoAtivo.tipoAvaliacao === tipoNota;
    
    return noPeriodo && tipoCorreto && periodoAtivo.status === 'Activo';
  }

  /**
   * Obter período ativo atual
   */
  static async obterPeriodoAtivo(trimestre: number, anoLectivo: string): Promise<IPeriodoAvaliacao | null> {
    try {
      const response = await this.listarPeriodos({ trimestre: trimestre as 1 | 2 | 3, anoLectivo });
      
      if (!response.success || !response.data) return null;
      
      const hoje = new Date();
      
      // Encontrar período ativo baseado na data atual
      const periodoAtivo = response.data.find(periodo => {
        const inicio = new Date(periodo.dataInicio);
        const fim = new Date(periodo.dataFim);
        return hoje >= inicio && hoje <= fim && periodo.status === 'Activo';
      });
      
      return periodoAtivo || null;
    } catch (error) {
      console.error('Erro ao obter período ativo:', error);
      return null;
    }
  }

  /**
   * Exportar notas para CSV
   */
  static exportarCSV(relatorio: IRelatorioTurma): void {
    const csvContent = [
      ['Nome do Aluno', 'MAC', 'PP', 'PT', 'Média', 'Classificação', 'Observações'],
      ...relatorio.notas.map(nota => [
        nota.tb_alunos?.nome || `Aluno ${nota.codigo_Aluno}`,
        nota.notaMAC?.toString() || '',
        nota.notaPP?.toString() || '',
        nota.notaPT?.toString() || '',
        nota.mediaTrimestre?.toFixed(1) || '',
        nota.classificacao || '',
        nota.observacoes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 
      `notas_${relatorio.turma.designacao}_${relatorio.disciplina.designacao}_T${relatorio.trimestre}_${relatorio.anoLectivo}.csv`
    );
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default NotasService;
