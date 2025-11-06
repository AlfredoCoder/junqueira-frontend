export interface Profession {
  codigo: number;
  designacao: string;
}

export interface ProfessionResponse {
  data: Profession | Profession[];
  message?: string;
}
