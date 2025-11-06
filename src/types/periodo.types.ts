export interface IPeriodoInput {
  designacao: string
}

export interface IPeriodo {
  codigo: number
  designacao: string
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface IPeriodoListResponse {
  data: IPeriodo[]
  pagination: IPagination
}
