// Tipos para Academic Management

export interface Disciplina {
  codigo: number;
  designacao: string;
  codigo_Curso: number;
  tb_cursos?: {
    codigo: number;
    designacao: string;
    observacoes?: string;
  };
}

export interface Curso {
  codigo: number;
  designacao: string;
  observacoes?: string;
}

export interface Classe {
  codigo: number;
  designacao: string;
}

export interface AnoLectivo {
  codigo: number;
  designacao: string;
  mesInicial: number;
  mesFinal: number;
  anoInicial: number;
  anoFinal: number;
}

export interface Sala {
  codigo: number;
  designacao: string;
  capacidade?: number;
}

export interface Periodo {
  codigo: number;
  designacao: string;
}

export interface Turma {
  codigo: number;
  designacao: string;
  codigo_Classe: number;
  codigo_Curso: number;
  codigo_Sala: number;
  codigo_Periodo: number;
  codigo_AnoLectivo: number;
  status?: string;
  max_Alunos?: number;
  tb_classes?: Classe;
  tb_cursos?: Curso;
  tb_salas?: Sala;
  tb_periodos?: Periodo;
  tb_anos_lectivos?: AnoLectivo;
}

export interface GradeCurricular {
  codigo: number;
  codigo_Disciplina: number;
  codigo_Classe: number;
  codigo_Curso: number;
  cargaHoraria?: number;
  tb_disciplinas?: Disciplina;
  tb_classes?: Classe;
  tb_cursos?: Curso;
}

// Tipos para formulários
export interface DisciplinaFormData {
  designacao: string;
  codigo_Curso: number;
}

export interface CursoFormData {
  designacao: string;
  observacoes?: string;
}

export interface TurmaFormData {
  designacao: string;
  codigo_Classe: number;
  codigo_Curso: number;
  codigo_Sala: number;
  codigo_Periodo: number;
  codigo_AnoLectivo: number;
  status?: string;
  max_Alunos?: number;
}

export interface Horario {
  codigo: number;
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  codigo_Turma: number;
  codigo_Disciplina: number;
  codigo_Professor: number;
  codigo_Sala: number;
  status?: string;
  tb_turmas?: Turma;
  tb_disciplinas?: Disciplina;
  tb_salas?: Sala;
}

export interface Nota {
  codigo: number;
  valor: number;
  codigo_Estudante: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  periodo: string;
  tipoAvaliacao: string;
  dataAvaliacao: string;
  observacoes?: string;
  tb_disciplinas?: Disciplina;
  tb_turmas?: Turma;
}

export interface HorarioFormData {
  diaSemana: string;
  horaInicio: string;
  horaFim: string;
  codigo_Turma: number;
  codigo_Disciplina: number;
  codigo_Professor: number;
  codigo_Sala: number;
  status?: string;
}

export interface NotaFormData {
  valor: number;
  codigo_Estudante: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  periodo: string;
  tipoAvaliacao: string;
  dataAvaliacao: string;
  observacoes?: string;
}

// Tipos para API Response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error?: string;
}
