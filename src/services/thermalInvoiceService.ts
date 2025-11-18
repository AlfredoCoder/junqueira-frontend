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
      const margin = 4; // Margem maior para melhor legibilidade
      let yPosition = 6;
      
      // Adicionar logo
      yPosition = await this.addLogo(doc, pageWidth, yPosition);

      // Configurar fonte monoespaçada com tamanho maior e fonte bold
      doc.setFont('courier', 'bold'); // Força bold por padrão
      // Cabeçalho
      doc.setFontSize(11); // Aumentado de 10 para 11
      
      // Nome da escola (centralizado)
      const dadosEmpresa = getDadosFatura();
      doc.text(dadosEmpresa.empresa.nome, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;

      // Manter fonte bold para melhor contraste
      doc.setFont('courier', 'bold');
      doc.setFontSize(9); // Aumentado de 8 para 9
      
      // Dados da escola
      const schoolInfo = [
        `NIF: ${dadosEmpresa.empresa.nif}`,
        dadosEmpresa.empresa.endereco,
        `Tlf: ${dadosEmpresa.empresa.telefones.join(' | ')}`,
        `Data: ${this.formatDateTime(data.pagamento.data)}`
      ];

      schoolInfo.forEach(info => {
        doc.text(info, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4; // Espaçamento aumentado
      });

      // Linha separadora
      yPosition += 3;
      doc.text('='.repeat(30), pageWidth / 2, yPosition, { align: 'center' }); // Ajustado para 80mm
      yPosition += 5;

      // Dados do Aluno
      doc.setFontSize(9); // Aumentado de 8 para 9
      doc.setFont('courier', 'bold');
      doc.text(`Aluno(a): ${data.pagamento.aluno.nome}`, margin, yPosition);
      yPosition += 4;

      doc.setFont('courier', 'bold'); // Manter bold
      doc.text('Consumidor Final', margin, yPosition);
      yPosition += 4;

      // Curso e turma
      const curso = data.pagamento.aluno.tb_matriculas?.tb_cursos?.designacao;
      if (curso) {
        doc.text(curso, margin, yPosition);
        yPosition += 4;
      }

      const confirmacao = data.pagamento.aluno.tb_matriculas?.tb_confirmacoes?.[0];
      const classe = confirmacao?.tb_turmas?.tb_classes?.designacao;
      const turma = confirmacao?.tb_turmas?.designacao;
      
      if (classe && turma) {
        doc.text(`${classe} - ${turma}`, margin, yPosition);
        yPosition += 4;
      }

      if (data.pagamento.aluno.n_documento_identificacao) {
        doc.text(`Doc: ${data.pagamento.aluno.n_documento_identificacao}`, margin, yPosition);
        yPosition += 4;
      }

      yPosition += 3;

      // Tabela de serviços
      doc.text('-'.repeat(30), pageWidth / 2, yPosition, { align: 'center' }); // Ajustado para 80mm
      yPosition += 4;

      // Cabeçalho da tabela
      doc.setFont('courier', 'bold');
      doc.text('Servicos', margin, yPosition);
      doc.text('Qtd', 42, yPosition); // Ajustado para 80mm
      doc.text('P.Unit', 52, yPosition); // Ajustado para 80mm
      doc.text('Total', 65, yPosition); // Ajustado para 80mm
      yPosition += 4;

      doc.text('-'.repeat(30), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;

      // Linha do serviço
      doc.setFont('courier', 'bold'); // Mudar para bold
      const serviceName = this.truncateText(data.pagamento.tipoServico.designacao, 18); // Reduzido para 80mm
      doc.text(serviceName, margin, yPosition);
      doc.text('1', 44, yPosition);
      doc.text(this.formatCurrency(data.pagamento.preco), 52, yPosition);
      doc.text(this.formatCurrency(data.pagamento.preco), 65, yPosition);
      yPosition += 4;

      doc.text('-'.repeat(30), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 5;

      // Totais
      doc.setFont('courier', 'bold'); // Usar bold para todos os totais
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
        yPosition += 4; // Espaçamento aumentado
      });

      // Observações
      if (data.pagamento.observacao) {
        yPosition += 3;
        doc.text('-'.repeat(30), pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 4;
        doc.setFont('courier', 'bold');
        doc.text(`Obs: ${data.pagamento.observacao}`, margin, yPosition);
        yPosition += 4;
      }

      yPosition += 3;

      // Rodapé
      doc.text('='.repeat(30), pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 4;

      doc.setFontSize(8); // Aumentado de 7 para 8
      doc.setFont('courier', 'bold'); // Usar bold para o rodapé também
      const footer = [
        `Operador: ${data.operador || 'Sistema'}`,
        `Emitido em: ${this.formatDateTime(data.pagamento.data)}`,
        `Fatura: ${data.pagamento.fatura}`,
        'REGIME SIMPLIFICADO',
        'Processado pelo computador'
      ];

      footer.forEach(info => {
        doc.text(info, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 3.5; // Espaçamento aumentado
      });

      yPosition += 4;

      // Selo de PAGO
      doc.setFontSize(14); // Aumentado de 12 para 14
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
