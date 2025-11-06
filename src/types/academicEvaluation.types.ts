// Tipos para Avaliação Acadêmica baseados no backend

// ===============================
// TIPOS DE AVALIAÇÃO
// ===============================
export interface ITipoAvaliacao {
  codigo: number;
  descricao?: string;
  designacao: string;
  tipoAvaliacao: number;
}

export interface ITipoAvaliacaoInput {
  descricao?: string;
  designacao: string;
  tipoAvaliacao: number;
}

export interface ITipoAvaliacaoResponse {
  success: boolean;
  message: string;
  data: ITipoAvaliacao;
}

export interface ITipoAvaliacaoListResponse {
  success: boolean;
  message: string;
  data: ITipoAvaliacao[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===============================
// RELATÓRIO DE AVALIAÇÃO
// ===============================
export interface IAcademicEvaluationReport {
  resumo: {
    totalTiposAvaliacao: number;
    totalTiposNota: number;
    tiposNotaAtivos: number;
    totalTiposNotaValor: number;
    totalTiposPauta: number;
    totalTrimestres: number;
  };
}

export interface IAcademicEvaluationReportResponse {
  success: boolean;
  message: string;
  data: IAcademicEvaluationReport;
}

// ===============================
// TIPOS DE NOTA
// ===============================
export interface ITipoNota {
  codigo: number;
  designacao?: string;
  positivaMinima?: number;
  status: number;
}

export interface ITipoNotaInput {
  designacao?: string;
  positivaMinima?: number;
  status: number;
}

export interface ITipoNotaResponse {
  success: boolean;
  message: string;
  data: ITipoNota;
}

export interface ITipoNotaListResponse {
  success: boolean;
  message: string;
  data: ITipoNota[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===============================
// TIPOS DE NOTA VALOR
// ===============================
export interface ITipoNotaValor {
  codigo: number;
  codigoTipoNota: number;
  tipoValor: string;
  valorNumerico: number;
  valorSprecao: string;
}

export interface ITipoNotaValorInput {
  codigoTipoNota: number;
  tipoValor: string;
  valorNumerico: number;
  valorSprecao: string;
}

export interface ITipoNotaValorResponse {
  success: boolean;
  message: string;
  data: ITipoNotaValor;
}

export interface ITipoNotaValorListResponse {
  success: boolean;
  message: string;
  data: ITipoNotaValor[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===============================
// TIPOS DE PAUTA
// ===============================
export interface ITipoPauta {
  codigo: number;
  designacao?: string;
  status?: number;
}

export interface ITipoPautaInput {
  designacao?: string;
  status?: number;
}

export interface ITipoPautaResponse {
  success: boolean;
  message: string;
  data: ITipoPauta;
}

export interface ITipoPautaListResponse {
  success: boolean;
  message: string;
  data: ITipoPauta[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===============================
// TRIMESTRES
// ===============================
export interface ITrimestre {
  codigo: number;
  designacao?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: number;
}

export interface ITrimestreInput {
  designacao?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: number;
}

export interface ITrimestreResponse {
  success: boolean;
  message: string;
  data: ITrimestre;
}

export interface ITrimestreListResponse {
  success: boolean;
  message: string;
  data: ITrimestre[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ===============================
// RELATÓRIOS E ESTATÍSTICAS
// ===============================
export interface IRelatorioAvaliacao {
  totalAvaliacoes: number;
  totalTiposNota: number;
  totalTrimestres: number;
  estatisticasPorTipo: {
    tipo: string;
    quantidade: number;
  }[];
}

export interface IEstatisticasNotas {
  totalNotas: number;
  mediaGeral: number;
  aprovados: number;
  reprovados: number;
  distribuicaoPorNota: {
    faixa: string;
    quantidade: number;
  }[];
}

// ===============================
// RESPONSES GENÉRICAS
// ===============================
export interface IAcademicEvaluationActionResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// ===============================
// TIPOS PARA NOTAS REAIS (MOCKADOS)
// ===============================
export interface INota {
  id: number;
  aluno: string;
  disciplina: string;
  professor: string;
  turma: string;
  trimestre: string;
  nota: number;
  situacao: "Aprovado" | "Reprovado" | "Recuperação";
  observacoes?: string;
  dataAvaliacao: string;
  tipoAvaliacao?: string;
  codigoAluno?: number;
  codigoDisciplina?: number;
  codigoTurma?: number;
  codigoTrimestre?: number;
}

export interface INotaInput {
  codigoAluno: number;
  codigoDisciplina: number;
  codigoTurma: number;
  codigoTrimestre: number;
  nota: number;
  observacoes?: string;
  tipoAvaliacao?: string;
}

export interface INotaResponse {
  success: boolean;
  message: string;
  data: INota;
}

export interface INotaListResponse {
  success: boolean;
  message: string;
  data: INota[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
