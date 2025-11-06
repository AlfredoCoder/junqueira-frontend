export interface IAnoLectivoInput {
  designacao: string
  mesInicial: string
  mesFinal: string
  anoInicial: string
  anoFinal: string
}

export interface IAnoLectivo {
  codigo: number
  designacao: string
  mesInicial: string
  mesFinal: string
  anoInicial: string
  anoFinal: string
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface IAnoLectivoListResponse {
  data: IAnoLectivo[]
  pagination: IPagination
}
