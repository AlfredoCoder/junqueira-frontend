export interface IResponsible {
  codigo: number;
  nome: string;
  telefone: string;
  email: string;
  codigo_Profissao: number;
  local_Trabalho: string;
  codigo_Utilizador: number;
  status: number;
}

export interface IResponsibleCreate {
  nome: string;
  telefone: string;
  email: string;
  codigo_Profissao: number;
  local_Trabalho: string;
  codigo_Utilizador: number;
  status: number;
}

export interface IResponsibleUpdate extends Partial<IResponsibleCreate> {
  codigo: number;
}

export interface IResponsibleResponse {
  success: boolean;
  message: string;
  data: IResponsible;
}

export interface IResponsibleListResponse {
  success: boolean;
  message: string;
  data: IResponsible[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}
