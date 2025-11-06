import api from '@/utils/api.utils';
import { Document, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, TextRun, PageBreak, Packer } from 'docx';

export interface StudentData {
  codigo: number;
  nome: string;
  numero_documento?: string;
  bi?: string; // Campo BI alternativo
  documento?: string; // Campo documento alternativo
  email?: string;
  telefone?: string;
  data_nascimento?: string;
  data_Nascimento?: string; // Variação do backend
  dataNascimento?: string; // Outra possível variação
  idade?: number;
  genero?: string;
}

export interface TurmaReportData {
  turma: {
    codigo: number;
    designacao: string;
    tb_classes?: { designacao: string };
    tb_cursos?: { designacao: string };
    tb_salas?: { designacao: string };
    tb_periodos?: { designacao: string };
  };
  alunos: StudentData[];
}

export class TurmaReportService {
  
  /**
   * Adiciona o cabeçalho padrão Complexo Abilio Junqueira ao PDF
   */
  private static async addHeader(doc: any, pageWidth: number, startY: number, title: string): Promise<number> {
    let yPosition = startY;
    
    // Logo centralizado
    try {
      const logoUrl = '/assets/images/icon.png';
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      await new Promise((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const logoWidth = 14;
          const logoHeight = 14;
          doc.addImage(base64data, 'PNG', (pageWidth - logoWidth) / 2, yPosition, logoWidth, logoHeight);
          resolve(null);
        };
        reader.readAsDataURL(blob);
      });
      
      yPosition += 22;
    } catch (error) {
      console.warn('Erro ao carregar logo:', error);
    }
    
    // Título do instituto centralizado
    doc.setFontSize(18);
    doc.setTextColor(249, 205, 29); // Amarelo Complexo Abilio Junqueira
    doc.text('Complexo Escolar Privado Abilio Junqueira', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 12;
    
    // Título do relatório
    doc.setFontSize(14);
    doc.setTextColor(59, 108, 77); // Verde Complexo Abilio Junqueira
    doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    
    // Data e hora
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-AO')} às ${new Date().toLocaleTimeString('pt-AO')}`, pageWidth / 2, yPosition, { align: 'center' });
    
    return yPosition + 10;
  }
  
  /**
   * Obtém a data de nascimento do aluno (suporta múltiplas variações de campo)
   */
  private static getBirthDate(aluno: any): string | null {
    // Suporta múltiplas variações do campo de data de nascimento
    return aluno.data_nascimento || aluno.data_Nascimento || aluno.dataNascimento || null;
  }

  /**
   * Calcula a idade baseada na data de nascimento
   */
  private static calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Obtém a idade do aluno (calcula ou retorna o campo idade)
   */
  private static getAge(aluno: StudentData): string {
    const birthDate = this.getBirthDate(aluno);
    if (birthDate) {
      try {
        return this.calculateAge(birthDate).toString();
      } catch (error) {
        console.warn('Erro ao calcular idade:', error);
      }
    }
    return aluno.idade?.toString() || 'N/A';
  }

  /**
   * Formata a data de nascimento
   */
  private static formatBirthDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  }
  
  /**
   * Busca alunos de uma turma específica
   */
  static async getStudentsByTurma(turmaId: number): Promise<StudentData[]> {
    try {
      const response = await api.get(`/api/academic-management/turmas/${turmaId}/alunos`);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao buscar alunos');
    } catch (error) {
      console.error('❌ Erro ao buscar alunos:', error);
      // Retornar array vazio se não houver alunos
      return [];
    }
  }

  /**
   * Busca todas as turmas com seus alunos
   */
  static async getAllTurmasWithStudents(anoLectivoId?: number): Promise<TurmaReportData[]> {
    try {
      const params = anoLectivoId ? { ano_lectivo: anoLectivoId } : {};
      const response = await api.get('/api/academic-management/relatorio-turmas-completo', { params });
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao buscar dados');
    } catch {
      throw new Error('Não foi possível carregar os dados das turmas');
    }
  }

  /**
   * Gera PDF para uma turma específica
   */
  static async generateSingleTurmaPDF(turma: any): Promise<void> {
    try {
      const alunos = await this.getStudentsByTurma(turma.codigo);
      
      // Importar jsPDF dinamicamente
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      
      // Adicionar cabeçalho
      let yPosition = await this.addHeader(doc, pageWidth, margin, 'LISTA NOMINAL DE ALUNOS');
      
      // Informações da turma
      yPosition += 5;
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      
      const turmaInfo = [
        `Turma: ${turma.designacao}`,
        `Classe: ${turma.tb_classes?.designacao || 'N/A'}`,
        `Curso: ${turma.tb_cursos?.designacao || 'N/A'}`,
        `Sala: ${turma.tb_salas?.designacao || 'N/A'}`,
        `Período: ${turma.tb_periodos?.designacao || 'N/A'}`,
        `Total de Alunos: ${alunos.length}`
      ];
      
      turmaInfo.forEach(info => {
        doc.text(info, margin, yPosition);
        yPosition += 7;
      });
      
      yPosition += 5;
      
      // Ordenar alunos alfabeticamente
      const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
      
      // Cabeçalho da tabela
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(249, 205, 29); // Amarelo Complexo Abilio Junqueira
      doc.rect(15, yPosition - 5, 180, 10, 'F');
      
      doc.text('Nº', 18, yPosition);
      doc.text('Nome', 30, yPosition);
      doc.text('Telefone', 110, yPosition);
      doc.text('Documento', 135, yPosition);
      doc.text('Idade', 165, yPosition);
      doc.text('Status', 175, yPosition);
      yPosition += 12;
      
      // Dados dos alunos
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      
      alunosOrdenados.forEach((aluno, index) => {
        // Verificar se precisa de nova página
        if (yPosition > 260) {
          doc.addPage();
          yPosition = 30;
          
          // Repetir cabeçalho da tabela
          doc.setFontSize(9);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(249, 205, 29);
          doc.rect(15, yPosition - 5, 180, 10, 'F');
          doc.text('Nº', 18, yPosition);
          doc.text('Nome', 30, yPosition);
          doc.text('Telefone', 110, yPosition);
          doc.text('Documento', 135, yPosition);
          doc.text('Idade', 165, yPosition);
          doc.text('Status', 175, yPosition);
          yPosition += 12;
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(8);
        }
        
        // Linha alternada
        if (index % 2 === 0) {
          doc.setFillColor(248, 249, 250);
          doc.rect(15, yPosition - 4, 180, 8, 'F');
        }
        
        // Dados do aluno
        doc.text((index + 1).toString(), 18, yPosition);
        // Usar texto com quebra para nomes longos
        const nomeCompleto = aluno.nome || 'N/A';
        if (nomeCompleto.length > 35) {
          const palavras = nomeCompleto.split(' ');
          const linha1 = palavras.slice(0, Math.ceil(palavras.length / 2)).join(' ');
          const linha2 = palavras.slice(Math.ceil(palavras.length / 2)).join(' ');
          doc.text(linha1, 30, yPosition - 1);
          doc.text(linha2, 30, yPosition + 2);
        } else {
          doc.text(nomeCompleto, 30, yPosition);
        }
        doc.text(aluno.telefone?.substring(0, 12) || 'N/A', 110, yPosition);
        doc.text(aluno.numero_documento || aluno.bi || aluno.documento || 'N/A', 135, yPosition);
        
        // Idade
        doc.text(this.getAge(aluno), 167, yPosition);
        
        // Status (sempre ativo para alunos matriculados)
        doc.setTextColor(34, 197, 94); // Verde
        doc.text('Ativo', 175, yPosition);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 8;
      });
      
      // Rodapé com assinaturas
      if (yPosition + 60 < 280) {
        yPosition += 20;
        doc.setFontSize(10);
        doc.text('Assinatura do Diretor: _________________________', margin, yPosition);
        doc.text('Assinatura do Coordenador: _________________________', margin, yPosition + 15);
      }
      
      // Adicionar número de página no rodapé
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, 285, { align: 'right' });
      }
      
      // Salvar o PDF
      doc.save(`Lista_Alunos_${turma.designacao.replace(/\s+/g, '_')}.pdf`);
      
    } catch (error) {
      console.error('Erro ao gerar PDF da turma:', error);
      throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Gera PDF para todas as turmas
   */
  static async generateAllTurmasPDF(anoLectivoId?: number): Promise<void> {
    try {
      const turmasData = await this.getAllTurmasWithStudents(anoLectivoId);
      
      if (!turmasData || turmasData.length === 0) {
        throw new Error('Nenhuma turma encontrada para o ano letivo selecionado');
      }
      
      
      // Importar jsPDF dinamicamente
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const margin = 20;
      
      // Processar cada turma
      for (let turmaIndex = 0; turmaIndex < turmasData.length; turmaIndex++) {
        const turmaData = turmasData[turmaIndex];
        
        try {
          
          // Nova página para cada turma (exceto a primeira)
          if (turmaIndex > 0) {
            doc.addPage();
          }
          
          // Adicionar cabeçalho
          let yPosition = await this.addHeader(doc, pageWidth, margin, 'LISTA NOMINAL DE ALUNOS');
          
          // Informações da turma
          yPosition += 5;
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          
          const turmaInfo = [
            `Turma: ${turmaData.turma.designacao || 'N/A'}`,
            `Classe: ${turmaData.turma.tb_classes?.designacao || 'N/A'}`,
            `Curso: ${turmaData.turma.tb_cursos?.designacao || 'N/A'}`,
            `Sala: ${turmaData.turma.tb_salas?.designacao || 'N/A'}`,
            `Período: ${turmaData.turma.tb_periodos?.designacao || 'N/A'}`,
            `Total de Alunos: ${turmaData.alunos?.length || 0}`
          ];
          
          turmaInfo.forEach(info => {
            doc.text(info, margin, yPosition);
            yPosition += 7;
          });
          
          yPosition += 5;
          
          // Verificar se há alunos na turma
          if (!turmaData.alunos || turmaData.alunos.length === 0) {
            doc.setFontSize(12);
            doc.text('Nenhum aluno encontrado nesta turma.', margin, yPosition + 20);
          } else {
            // Ordenar alunos alfabeticamente
            const alunosOrdenados = [...turmaData.alunos].sort((a, b) => 
              (a.nome || '').localeCompare(b.nome || '', 'pt', { sensitivity: 'base' })
            );
            
            // Cabeçalho da tabela
            doc.setFontSize(9);
            doc.setTextColor(255, 255, 255);
            doc.setFillColor(249, 205, 29); // Amarelo Complexo Abilio Junqueira
            doc.rect(15, yPosition - 5, 180, 10, 'F');
            
            doc.text('Nº', 18, yPosition);
            doc.text('Nome', 30, yPosition);
            doc.text('Telefone', 110, yPosition);
            doc.text('Documento', 135, yPosition);
            doc.text('Idade', 165, yPosition);
            doc.text('Status', 175, yPosition);
            yPosition += 12;
            
            // Dados dos alunos
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(8);
            
            alunosOrdenados.forEach((aluno, index) => {
              // Verificar se precisa de nova página
              if (yPosition > 260) {
                doc.addPage();
                yPosition = 30;
                
                // Repetir cabeçalho da tabela
                doc.setFontSize(9);
                doc.setTextColor(255, 255, 255);
                doc.setFillColor(249, 205, 29);
                doc.rect(15, yPosition - 5, 180, 10, 'F');
                doc.text('Nº', 18, yPosition);
                doc.text('Nome', 30, yPosition);
                doc.text('Telefone', 110, yPosition);
                doc.text('Documento', 135, yPosition);
                doc.text('Idade', 165, yPosition);
                doc.text('Status', 175, yPosition);
                yPosition += 12;
                doc.setTextColor(0, 0, 0);
                doc.setFontSize(8);
              }
              
              // Linha alternada
              if (index % 2 === 0) {
                doc.setFillColor(248, 249, 250);
                doc.rect(15, yPosition - 4, 180, 8, 'F');
              }
              
              // Dados do aluno
              doc.text((index + 1).toString(), 18, yPosition);
              // Usar texto com quebra para nomes longos
              const nomeCompleto = aluno.nome || 'N/A';
              if (nomeCompleto.length > 35) {
                const palavras = nomeCompleto.split(' ');
                const linha1 = palavras.slice(0, Math.ceil(palavras.length / 2)).join(' ');
                const linha2 = palavras.slice(Math.ceil(palavras.length / 2)).join(' ');
                doc.text(linha1, 30, yPosition - 1);
                doc.text(linha2, 30, yPosition + 2);
              } else {
                doc.text(nomeCompleto, 30, yPosition);
              }
              doc.text(aluno.telefone?.substring(0, 12) || 'N/A', 110, yPosition);
              doc.text(aluno.numero_documento || aluno.bi || aluno.documento || 'N/A', 135, yPosition);
              
              // Idade
              doc.text(this.getAge(aluno), 167, yPosition);
              
              // Status (sempre ativo para alunos matriculados)
              doc.setTextColor(34, 197, 94); // Verde
              doc.text('Ativo', 175, yPosition);
              doc.setTextColor(0, 0, 0);
              
              yPosition += 8;
            });
            
            // Rodapé com assinaturas
            if (yPosition + 60 < 280) {
              yPosition += 20;
              doc.setFontSize(10);
              doc.text('Assinatura do Diretor: _________________________', margin, yPosition);
              doc.text('Assinatura do Coordenador: _________________________', margin, yPosition + 15);
            }
          }
          
        } catch (turmaError) {
          console.error(`Erro ao processar turma ${turmaData.turma.designacao}:`, turmaError);
          // Continuar com as outras turmas mesmo se uma falhar
        }
      }
      
      // Adicionar número de página no rodapé de todas as páginas
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Página ${i} de ${totalPages}`, pageWidth - 20, 285, { align: 'right' });
      }
      
      // Salvar o PDF
      const fileName = `Lista_Alunos_Todas_Turmas_${new Date().toISOString().split('T')[0]}.pdf`;

      doc.save(fileName);
      
    } catch (error) {
      throw new Error(`Erro ao gerar PDF: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Gera documento Word para uma turma específica
   */
  static async generateSingleTurmaDOC(turma: any): Promise<void> {
    try {
      const alunos = await this.getStudentsByTurma(turma.codigo);
      
      // Ordenar alunos alfabeticamente
      const alunosOrdenados = alunos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }));
      
      // Criar o documento
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Título do Instituto
            new Paragraph({
              text: 'Complexo Escolar Privado Abilio Junqueira',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Título do Relatório
            new Paragraph({
              text: 'LISTA NOMINAL DE ALUNOS',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            
            // Data e hora
            new Paragraph({
              text: `Gerado em: ${new Date().toLocaleDateString('pt-AO')} às ${new Date().toLocaleTimeString('pt-AO')}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            
            // Informações da turma
            new Paragraph({
              children: [
                new TextRun({ text: 'Turma: ', bold: true }),
                new TextRun({ text: turma.designacao }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Classe: ', bold: true }),
                new TextRun({ text: turma.tb_classes?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Curso: ', bold: true }),
                new TextRun({ text: turma.tb_cursos?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Sala: ', bold: true }),
                new TextRun({ text: turma.tb_salas?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Período: ', bold: true }),
                new TextRun({ text: turma.tb_periodos?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Total de Alunos: ', bold: true }),
                new TextRun({ text: alunos.length.toString() }),
              ],
              spacing: { after: 300 },
            }),
            
            // Tabela de alunos
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                // Cabeçalho
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Nº', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 8, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Nome', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Telefone', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 18, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Documento', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Idade', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ 
                        children: [new TextRun({ text: 'Status', bold: true })],
                        alignment: AlignmentType.CENTER 
                      })],
                      width: { size: 12, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Dados dos alunos
                ...alunosOrdenados.map((aluno, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: aluno.nome || 'N/A' })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: aluno.telefone || 'N/A', alignment: AlignmentType.CENTER })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: aluno.numero_documento || aluno.bi || aluno.documento || 'N/A', alignment: AlignmentType.CENTER })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: this.getAge(aluno), alignment: AlignmentType.CENTER })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: 'Ativo', alignment: AlignmentType.CENTER })],
                      }),
                    ],
                  })
                ),
              ],
            }),
            
            // Espaço antes das assinaturas
            new Paragraph({ text: '', spacing: { before: 600 } }),
            
            // Assinaturas
            new Paragraph({
              text: 'Assinatura do Diretor: _________________________',
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: 'Assinatura do Coordenador: _________________________',
            }),
          ],
        }],
      });
      
      // Gerar e baixar o arquivo
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Lista_Alunos_${turma.designacao.replace(/\s+/g, '_')}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao gerar DOC da turma:', error);
      throw new Error(`Erro ao gerar DOC: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }

  /**
   * Gera documento Word para todas as turmas
   */
  static async generateAllTurmasDOC(anoLectivoId?: number): Promise<void> {
    try {
      const turmasData = await this.getAllTurmasWithStudents(anoLectivoId);
      
      if (!turmasData || turmasData.length === 0) {
        throw new Error('Nenhuma turma encontrada para o ano letivo selecionado');
      }
      
      // Criar seções para cada turma
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sections: any[] = [];
      
      for (let turmaIndex = 0; turmaIndex < turmasData.length; turmaIndex++) {
        const turmaData = turmasData[turmaIndex];
        
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const children: any[] = [
            // Título do Instituto
            new Paragraph({
              text: 'Complexo Escolar Privado Abilio Junqueira',
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            
            // Título do Relatório
            new Paragraph({
              text: 'LISTA NOMINAL DE ALUNOS',
              heading: HeadingLevel.HEADING_2,
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
            
            // Data e hora
            new Paragraph({
              text: `Gerado em: ${new Date().toLocaleDateString('pt-AO')} às ${new Date().toLocaleTimeString('pt-AO')}`,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            
            // Informações da turma
            new Paragraph({
              children: [
                new TextRun({ text: 'Turma: ', bold: true }),
                new TextRun({ text: turmaData.turma.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Classe: ', bold: true }),
                new TextRun({ text: turmaData.turma.tb_classes?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Curso: ', bold: true }),
                new TextRun({ text: turmaData.turma.tb_cursos?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Sala: ', bold: true }),
                new TextRun({ text: turmaData.turma.tb_salas?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Período: ', bold: true }),
                new TextRun({ text: turmaData.turma.tb_periodos?.designacao || 'N/A' }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Total de Alunos: ', bold: true }),
                new TextRun({ text: (turmaData.alunos?.length || 0).toString() }),
              ],
              spacing: { after: 300 },
            }),
          ];
          
          // Verificar se há alunos
          if (!turmaData.alunos || turmaData.alunos.length === 0) {
            children.push(
              new Paragraph({
                text: 'Nenhum aluno encontrado nesta turma.',
                alignment: AlignmentType.CENTER,
                spacing: { before: 300 },
              })
            );
          } else {
            // Ordenar alunos alfabeticamente
            const alunosOrdenados = [...turmaData.alunos].sort((a, b) => 
              (a.nome || '').localeCompare(b.nome || '', 'pt', { sensitivity: 'base' })
            );
            
            // Adicionar tabela de alunos
            children.push(
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  // Cabeçalho
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Nº', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 8, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Nome', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 30, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Telefone', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 18, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Documento', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 20, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Idade', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 12, type: WidthType.PERCENTAGE },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          children: [new TextRun({ text: 'Status', bold: true })],
                          alignment: AlignmentType.CENTER 
                        })],
                        width: { size: 12, type: WidthType.PERCENTAGE },
                      }),
                    ],
                  }),
                  // Dados dos alunos
                  ...alunosOrdenados.map((aluno, index) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: aluno.nome || 'N/A' })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: aluno.telefone || 'N/A', alignment: AlignmentType.CENTER })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: aluno.numero_documento || aluno.bi || aluno.documento || 'N/A', alignment: AlignmentType.CENTER })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: this.getAge(aluno), alignment: AlignmentType.CENTER })],
                        }),
                        new TableCell({
                          children: [new Paragraph({ text: 'Ativo', alignment: AlignmentType.CENTER })],
                        }),
                      ],
                    })
                  ),
                ],
              })
            );
          }
          
          // Assinaturas
          children.push(
            new Paragraph({ text: '', spacing: { before: 600 } }),
            new Paragraph({
              text: 'Assinatura do Diretor: _________________________',
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: 'Assinatura do Coordenador: _________________________',
            })
          );
          
          // Adicionar quebra de página entre turmas (exceto na última)
          if (turmaIndex < turmasData.length - 1) {
            children.push(
              new Paragraph({
                children: [new PageBreak()],
              })
            );
          }
          
          sections.push(...children);
          
        } catch (turmaError) {
          console.error(`Erro ao processar turma ${turmaData.turma.designacao}:`, turmaError);
        }
      }
      
      // Criar o documento
      const doc = new Document({
        sections: [{
          properties: {},
          children: sections,
        }],
      });
      
      // Gerar e baixar o arquivo
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Lista_Alunos_Todas_Turmas_${new Date().toISOString().split('T')[0]}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      throw new Error(`Erro ao gerar DOC: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}
