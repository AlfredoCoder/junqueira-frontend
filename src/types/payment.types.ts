// ===============================
// INTERFACES PARA GESTÃO DE PAGAMENTOS
// ===============================

// Forma de Pagamento
export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IFormaPagamentoInput {
  designacao: string;
}

export interface IFormaPagamentoResponse {
  success: boolean;
  message: string;
  data: IFormaPagamento;
}

export interface IFormaPagamentoListResponse {
  success: boolean;
  message: string;
  data: IFormaPagamento[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Pagamento Principal (tb_pagamentoi)
export interface IPagamentoPrincipal {
  codigo: number;
  data: string;
  codigo_Aluno: number;
  status: number;
  total?: number;
  valorEntregue: number;
  dataBanco: string;
  totalDesconto?: number;
  obs?: string;
  borderoux?: string;
  saldoAnterior?: number;
  descontoSaldo?: number;
  saldo?: number;
  codigoPagamento?: number;
  saldoOperacao?: number;
  codigoUtilizador?: number;
  hash?: string;
  tipoDocumento?: string;
  totalIva?: number;
  nifCliente?: string;
  troco?: number;
  // Relacionamentos
  aluno?: {
    codigo: number;
    nome: string;
  };
  detalhes?: IDetalhePagamento[];
  tb_alunos?: {
    codigo: number;
    nome: string;
    numeroMatricula?: string;
  };
}

export interface IPagamentoPrincipalInput {
  data: string;
  codigo_Aluno: number;
  status: number;
  valorEntregue: number;
  dataBanco: string;
  totalDesconto?: number;
  obs?: string;
}

export interface IPagamentoPrincipalResponse {
  success: boolean;
  message: string;
  data: IPagamentoPrincipal;
}

export interface IPagamentoPrincipalListResponse {
  success: boolean;
  message: string;
  data: IPagamentoPrincipal[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Detalhe de Pagamento (tb_pagamentos)
export interface IDetalhePagamento {
  codigo: number;
  codigo_Aluno: number;
  codigo_Tipo_Servico: number;
  data: string;
  n_Bordoro?: string;
  multa?: number;
  mes?: string;
  codigo_Utilizador?: number;
  observacao?: string;
  ano?: number;
  contaMovimentada?: string;
  quantidade?: number;
  desconto?: number;
  totalgeral?: number;
  codigoPagamento?: number;
  tipoDocumento?: string;
  fatura?: string;
  hash?: string;
  preco?: number;
  // Relacionamentos
  tipoServico?: {
    codigo: number;
    designacao: string;
  };
  tb_alunos?: {
    codigo: number;
    nome: string;
    numeroMatricula?: string;
  };
  tb_tipo_servicos?: {
    codigo: number;
    designacao: string;
    preco?: number;
  };
}

export interface IDetalhePagamentoInput {
  codigo_Aluno: number;
  codigo_Tipo_Servico: number;
  data: string;
  n_Bordoro?: string;
  multa?: number;
  mes?: string;
  codigo_Utilizador?: number;
  observacao?: string;
  ano?: number;
  contaMovimentada?: string;
  quantidade?: number;
  desconto?: number;
  totalgeral?: number;
  codigoPagamento?: number;
  tipoDocumento?: string;
  fatura?: string;
  hash?: string;
  preco?: number;
}

export interface IDetalhePagamentoResponse {
  success: boolean;
  message: string;
  data: IDetalhePagamento;
}

export interface IDetalhePagamentoListResponse {
  success: boolean;
  message: string;
  data: IDetalhePagamento[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Nota de Crédito
export interface INotaCredito {
  codigo: number;
  designacao: string;
  fatura?: string;
  descricao?: string;
  valor?: string;
  codigo_aluno?: number;
  documento?: string;
  // Relacionamentos
  tb_alunos?: {
    codigo: number;
    nome: string;
  };
}

export interface INotaCreditoInput {
  designacao: string;
  fatura?: string;
  descricao?: string;
  valor?: string;
  codigo_aluno?: number;
  documento?: string;
}

export interface INotaCreditoResponse {
  success: boolean;
  message: string;
  data: INotaCredito;
}

export interface INotaCreditoListResponse {
  success: boolean;
  message: string;
  data: INotaCredito[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Motivo de Anulação
export interface IMotivoAnulacao {
  codigo: number;
  designacao: string;
}

export interface IMotivoAnulacaoInput {
  designacao: string;
}

export interface IMotivoAnulacaoResponse {
  success: boolean;
  message: string;
  data: IMotivoAnulacao;
}

export interface IMotivoAnulacaoListResponse {
  success: boolean;
  message: string;
  data: IMotivoAnulacao[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// Relatório Financeiro
export interface IRelatorioFinanceiro {
  totalPagamentos: number;
  totalValor: number;
  totalDesconto: number;
  valorLiquido: number;
  periodo?: {
    dataInicio: string;
    dataFim: string;
  };
  detalhes?: any[];
}

export interface IRelatorioFinanceiroResponse {
  success: boolean;
  message: string;
  data: IRelatorioFinanceiro;
  filtros?: any;
}

// Dashboard Financeiro
export interface IDashboardFinanceiro {
  resumo: {
    totalPagamentosHoje: number;
    totalPagamentosMes: number;
    valorTotalMes: number;
    totalPendentes?: number;
    valorPendente?: number;
  };
  formasPagamentoMaisUsadas?: Array<{
    forma: string;
    quantidade: number;
    valor: number;
  }>;
  servicosMaisPagos?: Array<{
    servico: string;
    quantidade: number;
    valor: number;
  }>;
  estatisticasMensais?: Array<{
    mes: string;
    valor: number;
    quantidade: number;
  }>;
}

export interface IDashboardFinanceiroResponse {
  success: boolean;
  message: string;
  data: IDashboardFinanceiro;
}

// Estatísticas de Pagamentos
export interface IEstatisticasPagamentos {
  periodo: string;
  estatisticas: Array<{
    data: string;
    totalPagamentos: number;
    valorTotal: number;
  }>;
}

export interface IEstatisticasPagamentosResponse {
  success: boolean;
  message: string;
  data: IEstatisticasPagamentos;
}

// Filtros para Pagamentos
export interface IPagamentoFilter {
  codigo_Aluno?: number;
  codigo_Tipo_Servico?: number;
  dataInicio?: string;
  dataFim?: string;
  status?: number;
  search?: string;
}

// Resposta de Ação (Create, Update, Delete)
export interface IPaymentActionResponse {
  success: boolean;
  message: string;
}
