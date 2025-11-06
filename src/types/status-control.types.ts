// ===============================
// TIPO STATUS - Types
// ===============================

export interface ITipoStatusInput {
  designacao: string
}

export interface ITipoStatus {
  codigo: number
  designacao: string
  tb_status?: IStatus[]
  _count?: {
    tb_status: number
  }
}

// ===============================
// STATUS - Types
// ===============================

export interface IStatusInput {
  designacao: string
  tipoStatus?: number | null
}

export interface IStatus {
  codigo: number
  designacao: string
  tipoStatus?: number | null
  tb_tipo_status?: {
    codigo: number
    designacao: string
  } | null
}

// ===============================
// OPERAÇÕES ESPECIAIS - Types
// ===============================

export interface IAssociarStatusInput {
  statusId: number
  tipoStatusId: number
}

export interface ITipoStatusComContagem extends ITipoStatus {
  _count: {
    tb_status: number
  }
  tb_status: Array<{
    codigo: number
    designacao: string
  }>
}

// ===============================
// API RESPONSE - Types
// ===============================

export interface IStatusControlPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ITipoStatusListResponse {
  data: ITipoStatus[]
  pagination: IStatusControlPagination
}

export interface IStatusListResponse {
  data: IStatus[]
  pagination: IStatusControlPagination
}

export interface IApiResponse<T> {
  success: boolean
  message: string
  data?: T
}
