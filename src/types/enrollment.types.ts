export interface IEnrollmentInput {
  codigo_Aluno: number
  data_Matricula: string // formato ISO: "2024-01-15"
  codigo_Curso: number
  codigo_Utilizador: number
  codigoStatus: number
}

export interface IStudent {
  codigo: number
  nome: string
  dataNascimento: string | null
  sexo: string
  url_Foto: string | null
}

export interface ICourse {
  codigo: number
  designacao: string
  codigo_Status: number
}

export interface IUser {
  codigo: number
  nome: string
  user: string
}

export interface IClass {
  codigo: number
  designacao: string
  codigo_Classe: number
  codigo_Curso: number
  codigo_Sala: number
  codigo_Periodo: number
  status: string
  codigo_AnoLectivo: number
  max_Alunos: number
  tb_classes: {
    codigo: number
    designacao: string
    status: number
    notaMaxima: number
    exame: boolean
  }
}

export interface IConfirmation {
  codigo: number
  codigo_Matricula: number
  data_Confirmacao: string | null
  codigo_Turma: number
  codigo_Ano_lectivo: number
  codigo_Utilizador: number
  mes_Comecar: string | null
  codigo_Status: number
  classificacao: number | null
  tb_turmas: IClass
}

export interface IEnrollment {
  codigo: number
  codigo_Aluno: number
  data_Matricula: string
  codigo_Curso: number
  codigo_Utilizador: number
  codigoStatus: number
  tb_alunos: IStudent
  tb_cursos: ICourse
  tb_utilizadores: IUser
  tb_confirmacoes: IConfirmation[]
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface IEnrollmentListResponse {
  data: IEnrollment[]
  pagination: IPagination
}
