import jsPDF from 'jspdf';
import { ThermalInvoiceData } from '@/components/ThermalInvoice';
import { getDadosFatura, EMPRESA_CONFIG } from '@/config/empresa.config';

export class ThermalInvoiceService {
  /**
   * Adiciona o logo ao cabeçalho do PDF térmico
   */
  private static async addLogo(doc: jsPDF, pageWidth: number, yPosition: number): Promise<number> {
    try {
      const logoUrl = '/assets/images/icon.png';
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          // Logo menor para fatura térmica (25px = ~9mm)
          const logoWidth = 9;
          const logoHeight = 9;
          doc.addImage(base64data, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
      
      return yPosition + 14; // Retornar nova posição Y (logo + margem maior)
    } catch (error) {
      console.warn('Erro ao carregar logo:', error);
      return yPosition; // Continuar sem o logo
    }
  }
  
  /**
   * Gera PDF da fatura térmica
   */
  static async generateThermalPDF(data: ThermalInvoiceData): Promise<void> {
    try {
      // Configurar PDF para formato de impressora térmica (80mm)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // 80mm de largura, altura variável
      });

      const pageWidth = 80;
      const margin = 3;
      let yPosition = 5;
      
      // Adicionar logo
      yPosition = await this.addLogo(doc, pageWidth, yPosition);

      // Configurar fonte monoespaçada
      doc.setFont('courier', 'normal');
      // Cabeçalho
      doc.setFontSize(8);
      doc.setFont('courier', 'bold');
      
      // Nome da escola (centralizado)
      const dadosEmpresa = getDadosFatura();
      doc.text(dadosEmpresa.empresa.nome, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;

      // Voltar para fonte normal
      doc.setFont('courier', 'normal');
      
      // Dados da escola
      const schoolInfo = [
        `NIF: ${dadosEmpresa.empresa.nif}`,
        dadosEmpresa.empresa.endereco,
        `Tlf: ${dadosEmpresa.empresa.telefones.join(' | ')}`,
        `Data: ${this.formatDateTime(data.pagamento.data)}`
      ];

      schoolInfo.forEach(info => {
        doc.text(info, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3;
      });

      // Linha separadora
      yPosition += 2;
      doc.text('='.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;

      // Dados do Aluno
      doc.setFontSize(6);
      doc.setFont('courier', 'bold');
      doc.text(`Aluno(a): ${data.pagamento.aluno.nome}`, margin, yPosition);
      yPosition += 3;

      doc.setFont('courier', 'normal');
      doc.text('Consumidor Final', margin, yPosition);
      yPosition += 3;

      // Curso e turma
      const curso = data.pagamento.aluno.tb_matriculas?.tb_cursos?.designacao;
      if (curso) {
        doc.text(curso, margin, yPosition);
        yPosition += 3;
      }

      const confirmacao = data.pagamento.aluno.tb_matriculas?.tb_confirmacoes?.[0];
      const classe = confirmacao?.tb_turmas?.tb_classes?.designacao;
      const turma = confirmacao?.tb_turmas?.designacao;
      
      if (classe && turma) {
        doc.text(`${classe} - ${turma}`, margin, yPosition);
        yPosition += 3;
      }

      if (data.pagamento.aluno.n_documento_identificacao) {
        doc.text(`Doc: ${data.pagamento.aluno.n_documento_identificacao}`, margin, yPosition);
        yPosition += 3;
      }

      yPosition += 2;

      // Tabela de serviços
      doc.text('-'.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 3;

      // Cabeçalho da tabela
      doc.setFont('courier', 'bold');
      doc.text('Servicos', margin, yPosition);
      doc.text('Qtd', 45, yPosition);
      doc.text('P.Unit', 55, yPosition);
      doc.text('Total', 68, yPosition);
      yPosition += 3;

      doc.text('-'.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 3;

      // Linha do serviço
      doc.setFont('courier', 'normal');
      const serviceName = this.truncateText(data.pagamento.tipoServico.designacao, 20);
      doc.text(serviceName, margin, yPosition);
      doc.text('1', 47, yPosition);
      doc.text(this.formatCurrency(data.pagamento.preco), 55, yPosition);
      doc.text(this.formatCurrency(data.pagamento.preco), 68, yPosition);
      yPosition += 3;

      doc.text('-'.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;

      // Totais
      const totals = [
        `Forma de Pagamento: ${data.pagamento.formaPagamento.designacao}`,
        `Total: ${this.formatCurrency(data.pagamento.preco)}`,
        'Total IVA: 0.00',
        'N.º de Itens: 1',
        'Desconto: 0.00',
        `A Pagar: ${this.formatCurrency(data.pagamento.preco)}`,
        `Total Pago: ${this.formatCurrency(data.pagamento.preco)}`,
        'Pago em Saldo: 0.00',
        'Saldo Actual: 0.00'
      ];

      totals.forEach(total => {
        doc.text(total, margin, yPosition);
        yPosition += 3;
      });

      // Observações
      if (data.pagamento.observacao) {
        yPosition += 2;
        doc.text('-'.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3;
        doc.setFont('courier', 'bold');
        doc.text(`Obs: ${data.pagamento.observacao}`, margin, yPosition);
        yPosition += 3;
      }

      yPosition += 2;

      // Rodapé
      doc.text('='.repeat(35), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 3;

      doc.setFontSize(5);
      const footer = [
        `Operador: ${data.operador || 'Sistema'}`,
        `Emitido em: ${this.formatDateTime(data.pagamento.data)}`,
        `Fatura: ${data.pagamento.fatura}`,
        'REGIME SIMPLIFICADO',
        'Processado pelo computador'
      ];

      footer.forEach(info => {
        doc.text(info, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 2.5;
      });

      yPosition += 3;

      // Selo de PAGO
      doc.setFontSize(10);
      doc.setFont('courier', 'bold');
      doc.text('[ PAGO ]', pageWidth / 2, yPosition, { align: 'center' });

      // Ajustar altura do PDF
      const finalHeight = yPosition + 10;
      doc.internal.pageSize.height = finalHeight;

      // Salvar o PDF
      doc.save(`Fatura_Termica_${data.pagamento.fatura}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF da fatura térmica:', error);
      throw new Error('Erro ao gerar PDF da fatura térmica');
    }
  }

  /**
   * Imprime a fatura térmica
   */
  static printThermalInvoice(): void {
    try {
      window.print();
    } catch (error) {
      console.error('Erro ao imprimir fatura térmica:', error);
      throw new Error('Erro ao imprimir fatura térmica');
    }
  }

  /**
   * Formata valor monetário para impressora térmica
   */
  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Formata data e hora
   */
  private static formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('pt-BR');
  }

  /**
   * Trunca texto para caber na largura da impressora
   */
  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Converte dados do formato antigo para o novo formato térmico
   */
  static convertToThermalData(invoiceData: any): ThermalInvoiceData {
    return {
      pagamento: {
        codigo: invoiceData.pagamento.codigo,
        fatura: invoiceData.pagamento.fatura,
        data: invoiceData.pagamento.data,
        mes: invoiceData.pagamento.mes,
        ano: invoiceData.pagamento.ano,
        preco: invoiceData.pagamento.preco,
        observacao: invoiceData.pagamento.observacao || '',
        aluno: {
          codigo: invoiceData.pagamento.aluno.codigo,
          nome: invoiceData.pagamento.aluno.nome,
          n_documento_identificacao: invoiceData.pagamento.aluno.n_documento_identificacao,
          email: invoiceData.pagamento.aluno.email,
          telefone: invoiceData.pagamento.aluno.telefone,
          tb_matriculas: invoiceData.pagamento.aluno.tb_matriculas
        },
        tipoServico: {
          designacao: invoiceData.pagamento.tipoServico.designacao
        },
        formaPagamento: {
          designacao: invoiceData.pagamento.formaPagamento.designacao
        }
      },
      operador: invoiceData.operador || 'Sistema'
    };
  }
}
