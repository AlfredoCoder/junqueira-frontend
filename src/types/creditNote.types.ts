// types/creditNote.types.ts

export interface ICreditNote {
  codigo: number;
  designacao: string;
  fatura: string;
  descricao: string;
  valor: string;
  codigo_aluno: number;
  documento: string;
  next: string;
  dataOperacao: string;
  hash?: string;
  codigoPagamentoi?: number;
  // Relacionamentos
  tb_alunos?: {
    codigo: number;
    nome: string;
  };
}

export interface ICreditNoteInput {
  designacao: string;
  fatura: string;
  descricao: string;
  valor: string;
  codigo_aluno: number;
  documento: string;
  next?: string;
  dataOperacao?: string;
  hash?: string;
  codigoPagamentoi?: number;
}

export interface ICreditNoteResponse {
  success: boolean;
  message: string;
  data: ICreditNote;
}

export interface ICreditNoteListResponse {
  success: boolean;
  message: string;
  data: ICreditNote[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
