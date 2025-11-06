export interface ICourseInput {
  designacao: string
  codigo_Status: number
}

export interface ICourse {
  codigo: number
  designacao: string
  codigo_Status: number
  duracao?: number
  descricao?: string | null
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface ICourseListResponse {
  data: ICourse[]
  pagination: IPagination
}
