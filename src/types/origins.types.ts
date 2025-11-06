export interface Origin {
  codigo: number;
  designacao: string;
  codigoStatus: number;
  localizacao: string;
  contacto: string;
  codigoUtilizador: number;
  dataCadastro: string | null;
  tb_utilizadores?: {
    codigo: number;
    nome: string;
    user: string;
  };
}

export interface OriginPayload {
  designacao: string;
  codigoStatus: number;
  localizacao: string;
  contacto: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}
