import { useState } from 'react';
import { getDadosFatura } from '@/config/empresa.config';
import { ThermalInvoiceService } from '@/services/thermalInvoiceService';
import { ThermalInvoiceData } from '@/components/ThermalInvoice';
import api from '@/utils/api.utils';

export interface IPayment {
  codigo: number;
  codigo_Aluno: number;
  thermalInvoice?: ThermalInvoiceData;
  codigo_Tipo_Servico: number;
  data: string;
  mes: string;
  ano: number;
  preco: number;
  observacao: string;
  fatura: string;
  aluno?: {
    codigo: number;
    nome: string;
    n_documento_identificacao: string;
  };
  tipoServico?: {
    codigo: number;
    designacao: string;
  };
}

export interface ICreatePaymentData {
  codigo_Aluno: number;
  codigo_Tipo_Servico: number;
  mes?: string; // Opcional para serviços que não requerem mês (uniformes, etc.)
  ano: number;
  preco: number;
  observacao?: string;
  codigo_FormaPagamento?: number;
}

export interface IStudentConfirmed {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  tb_matriculas: {
    codigo: number;
    tb_cursos: {
      codigo: number;
      designacao: string;
    };
    tb_confirmacoes: Array<{
      tb_turmas: {
        codigo: number;
        designacao: string;
        tb_classes: {
          designacao: string;
        };
      };
    }>;
  };
}

export interface IStudentFinancialData {
  aluno: {
    codigo: number;
    nome: string;
    documento: string;
    email: string;
    telefone: string;
    dataNascimento?: string;
    sexo?: string;
  };
  dadosAcademicos: {
    curso: string;
    classe: string;
    turma: string;
    codigoTurma: number;
    codigoClasse: number;
    codigoCurso: number;
    confirmacao_codigo: number;
  };
  mesesPropina?: Array<{
    mes: string;
    status: 'PAGO' | 'NÃO_PAGO';
    valor: number;
    dataPagamento: string | null;
    codigoPagamento: number | null;
  }>;
  historicoFinanceiro?: Array<{
    codigo: number;
    data: string;
    servico: string;
    valor: number;
    observacao: string;
    fatura: string;
  }>;
  resumo?: {
    totalMeses: number;
    mesesPagos: number;
    mesesPendentes: number;
    valorMensal: number;
    totalPago: number;
    totalPendente: number;
    totalGeral?: number;
  };
}

// Hook para criar pagamento
export const useCreatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (data: ICreatePaymentData): Promise<IPayment> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/payment-management/pagamentos', data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erro ao criar pagamento');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao criar pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createPayment, loading, error };
};

// Hook para listar alunos confirmados
export const useStudentsConfirmed = () => {
  const [students, setStudents] = useState<IStudentConfirmed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchStudents = async (
    page: number = 1,
    limit: number = 10, // Usar paginação adequada
    search?: string,
    turma?: number,
    curso?: number
  ) => {
    setLoading(true);
    setError(null);
    
    console.log('🔍 Buscando alunos confirmados:', { page, limit, search, turma, curso });
    const startTime = performance.now();
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
        console.log('🔍 Buscando alunos com termo:', search);
      }
      if (turma) params.append('turma', turma.toString());
      if (curso) params.append('curso', curso.toString());

      console.log('Fazendo requisição para:', `/api/payment-management/alunos-confirmados?${params}`);
      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      
      if (response.data.success) {
        const endTime = performance.now();
        console.log(`✅ Alunos recebidos: ${response.data.data.length} em ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`📊 Paginação: ${response.data.pagination.currentPage}/${response.data.pagination.totalPages} (${response.data.pagination.totalItems} total)`);
        
        if (search) {
          console.log('🔍 Resultados da busca por "' + search + '":', response.data.data.map((s: any) => s.nome));
        }
        setStudents(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      console.error('❌ Erro ao buscar alunos:', errorMessage);
      setError(errorMessage);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    students, 
    loading, 
    error, 
    pagination, 
    fetchStudents 
  };
};

// Hook para dados financeiros do aluno
export const useStudentFinancialData = () => {
  const [data, setData] = useState<IStudentFinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = async (studentId: number, anoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    console.log('💰 Buscando dados completos do aluno:', { studentId, anoLectivo });
    const startTime = performance.now();
    
    try {
      // Usar a API corrigida que retorna dados da confirmação mais recente
      const response = await api.get(`/api/payment-management/aluno/${studentId}/completo`);
      
      if (response.data.success) {
        const endTime = performance.now();
        console.log(`✅ Dados completos recebidos em ${(endTime - startTime).toFixed(2)}ms`);
        
        // Buscar também dados de meses se ano letivo especificado
        let dadosCompletos = response.data.data;
        
        if (anoLectivo) {
          try {
            const mesesResponse = await api.get(`/api/payment-management/aluno/${studentId}/meses-ano-letivo/${anoLectivo}`);
            if (mesesResponse.data.success) {
              dadosCompletos = {
                ...dadosCompletos,
                mesesPropina: mesesResponse.data.data.meses,
                resumo: mesesResponse.data.data.resumo,
                historicoFinanceiro: mesesResponse.data.data.pagamentos || []
              };
            }
          } catch (mesesErr) {
            console.warn('⚠️ Erro ao buscar meses, continuando sem eles:', mesesErr);
          }
        }
        
        setData(dadosCompletos);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do aluno');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados do aluno';
      setError(errorMessage);
      setData(null);
      console.error('❌ Erro ao buscar dados financeiros:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    fetchFinancialData,
    clearData: () => setData(null)
  };
};

// Hook para gerar fatura PDF
export const useGenerateInvoicePDF = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (paymentId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar dados do pagamento
      const response = await api.get(`/api/payment-management/pagamentos/${paymentId}`);
      
      if (response.data.success) {
        const payment = response.data.data;
        
        // Buscar dados completos do aluno
        let alunoCompleto = null;
        try {
          const alunoResponse = await api.get(`/api/payment-management/aluno/${payment.codigo_Aluno}/completo`);
          if (alunoResponse.data.success) {
            alunoCompleto = alunoResponse.data.data;
          }
        } catch (error) {
          console.error('Erro ao buscar dados completos do aluno:', error);
        }
        
        // CORREÇÃO: Usar apenas o pagamento específico selecionado
        // A fatura deve mostrar apenas o mês do pagamento clicado, não todos os meses do depósito
        let mesesPagos = [];
        let valorTotal = payment.preco || 0;
        
        // Usar apenas o pagamento atual (específico que foi clicado)
        mesesPagos = payment.mes ? [`${payment.mes}-${payment.ano}`] : [];
        console.log('Gerando fatura para pagamento específico:', payment.codigo, 'Mês:', payment.mes, 'Ano:', payment.ano);
        
        // Obter nome do funcionário logado
        let nomeOperador = 'Sistema';
        try {
          const userData = localStorage.getItem('user');
          if (userData) {
            const user = JSON.parse(userData);
            nomeOperador = user.nome || user.username || 'Sistema';
          }
        } catch (error) {
          console.error('Erro ao obter dados do usuário:', error);
        }

        const dadosFatura = {
          numeroFatura: payment.fatura || `FAT_${Date.now()}`,
          dataEmissao: new Date(payment.data || new Date()).toLocaleString('pt-BR'),
          aluno: {
            nome: payment.aluno?.nome || 'Aluno não identificado',
            curso: alunoCompleto?.dadosAcademicos?.curso || 'Curso não especificado',
            classe: alunoCompleto?.dadosAcademicos?.classe || 'Classe não especificada',
            turma: alunoCompleto?.dadosAcademicos?.turma || 'Turma não especificada'
          },
          servicos: [
            {
              descricao: payment.tipoServico?.designacao || 'Serviço',
              quantidade: mesesPagos.length,
              precoUnitario: payment.preco || 0,
              total: valorTotal
            }
          ],
          formaPagamento: payment.formaPagamento?.designacao || 'DINHEIRO',
          contaBancaria: (payment.formaPagamento?.designacao === 'DEPOSITO' || payment.formaPagamento?.designacao === 'DEPÓSITO') ? payment.contaMovimentada : null,
          numeroBordero: (payment.formaPagamento?.designacao === 'DEPOSITO' || payment.formaPagamento?.designacao === 'DEPÓSITO') ? payment.n_Bordoro : null,
          mesesPagos: mesesPagos.join(', '),
          subtotal: valorTotal,
          iva: 0.00,
          desconto: 0.00,
          totalPagar: valorTotal,
          totalPago: valorTotal,
          pagoEmSaldo: 0.00,
          saldoAtual: 0.00,
          operador: nomeOperador
        };
        
        // Criar uma nova janela para impressão
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>Fatura - ${dadosFatura.numeroFatura}</title>
              <style>
                @page {
                  size: 80mm auto;
                  margin: 0;
                }
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  margin: 0;
                  padding: 8px;
                  width: 80mm;
                  background: white;
                  color: black;
                }
                .header {
                  text-align: center;
                  border-bottom: 1px solid #000;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
                }
                .header h2 {
                  font-size: 14px;
                  font-weight: bold;
                  margin: 0 0 4px 0;
                }
                .header p {
                  margin: 2px 0;
                  font-size: 11px;
                }
                .aluno {
                  margin-bottom: 8px;
                  font-size: 11px;
                }
                .aluno p {
                  margin: 2px 0;
                }
                .servicos-table {
                  width: 100%;
                  border-top: 1px solid #000;
                  border-bottom: 1px solid #000;
                  margin: 8px 0;
                  border-collapse: collapse;
                }
                .servicos-table th,
                .servicos-table td {
                  padding: 2px 4px;
                  font-size: 10px;
                  text-align: left;
                }
                .servicos-table th {
                  border-bottom: 1px solid #000;
                }
                .text-right {
                  text-align: right;
                }
                .totais {
                  font-size: 11px;
                  margin: 8px 0;
                }
                .totais p {
                  margin: 2px 0;
                }
                .rodape {
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 8px;
                  margin-top: 12px;
                  font-size: 10px;
                }
                .rodape p {
                  margin: 2px 0;
                }
                .selo-pago {
                  text-align: center;
                  margin-top: 16px;
                }
                .selo-pago span {
                  font-weight: bold;
                  font-size: 16px;
                  color: #2563eb;
                }
              </style>
            </head>
            <body>
              <div class="header">
               <img src="/assets/images/icon.png" alt="Logo" style="width: 40px; height: auto; margin-bottom: 5px;" />
                <h2>${getDadosFatura().empresa.nome}</h2>
                <p>NIF: ${getDadosFatura().empresa.nif}</p>
                <p>${getDadosFatura().empresa.endereco}</p>
                <p>Tlf: ${getDadosFatura().empresa.telefones.join(' | ')}</p>
                <p>Data: ${dadosFatura.dataEmissao}</p>
                <p>Fatura: ${dadosFatura.numeroFatura}</p>
              </div>

              <div class="aluno">
                <p><strong>Aluno(a):</strong> ${dadosFatura.aluno.nome}</p>
                <p>Consumidor Final</p>
                <p>${dadosFatura.aluno.curso}</p>
                <p>${dadosFatura.aluno.classe} - ${dadosFatura.aluno.turma}</p>
              </div>

              <table class="servicos-table">
                <thead>
                  <tr>
                    <th style="width: 50%">Serviços</th>
                    <th class="text-right" style="width: 15%">Qtd</th>
                    <th class="text-right" style="width: 17.5%">P.Unit</th>
                    <th class="text-right" style="width: 17.5%">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${dadosFatura.servicos.map(servico => `
                    <tr>
                      <td>${servico.descricao}</td>
                      <td class="text-right">${servico.quantidade}</td>
                      <td class="text-right">${servico.precoUnitario.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                      <td class="text-right">${servico.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>

              <div class="totais">
                <p>Forma de Pagamento: ${dadosFatura.formaPagamento}</p>
                ${dadosFatura.contaBancaria ? `<p>Conta Bancária: ${dadosFatura.contaBancaria}</p>` : ''}
                ${dadosFatura.numeroBordero ? `<p>Nº Borderô: ${dadosFatura.numeroBordero}</p>` : ''}
                ${dadosFatura.mesesPagos ? `<p>Meses: ${dadosFatura.mesesPagos}</p>` : ''}
                <p>Total: ${dadosFatura.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total IVA: ${dadosFatura.iva.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>N.º de Itens: ${dadosFatura.servicos.length}</p>
                <p>Desconto: ${dadosFatura.desconto.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>A Pagar: ${dadosFatura.totalPagar.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Total Pago: ${dadosFatura.totalPago.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Pago em Saldo: ${dadosFatura.pagoEmSaldo.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
                <p>Saldo Actual: ${dadosFatura.saldoAtual.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}</p>
              </div>

              <div class="rodape">
                <p>Operador: ${dadosFatura.operador}</p>
                <p>Emitido em: ${dadosFatura.dataEmissao.split(' ')[0]}</p>
                <p>REGIME SIMPLIFICADO</p>
                <p>Processado pelo computador</p>
              </div>

              <div class="selo-pago">
                <span>[ PAGO ]</span>
              </div>
            </body>
            </html>
          `);
          
          printWindow.document.close();
          printWindow.focus();
          
          // Aguardar o carregamento e imprimir
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        }
      } else {
        throw new Error('Pagamento não encontrado');
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao gerar fatura';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { generatePDF, loading, error };
};

// Hook para listar todos os pagamentos processados
export const usePaymentsList = () => {
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchPayments = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    tipoServico?: string,
    dataInicio?: string,
    dataFim?: string
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) params.append('search', search);
      if (tipoServico) params.append('tipo_servico', tipoServico);
      if (dataInicio) params.append('data_inicio', dataInicio);
      if (dataFim) params.append('data_fim', dataFim);

      const response = await api.get(`/api/payment-management/pagamentos?${params}`);
      
      if (response.data.success) {
        setPayments(response.data.data);
		console.log('Pagamentos recebidos:', response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar pagamentos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar pagamentos';
      setError(errorMessage);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  return { 
    payments, 
    loading, 
    error, 
    pagination, 
    fetchPayments 
  };
};
