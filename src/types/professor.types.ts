// ===============================================================
// TIPOS PARA PROFESSORES - BASEADOS NA TABELA tb_professores
// ===============================================================

export interface IProfessor {
  codigo: number;
  nome: string;
  email: string;
  telefone?: string;
  formacao: string; // Ex: "Licenciatura em Matemática"
  nivelAcademico: string; // Ex: "Licenciado", "Mestre", "Doutor"
  especialidade?: string;
  numeroFuncionario?: string;
  dataAdmissao?: string;
  status: string; // "Activo", "Inactivo"
  codigo_Utilizador?: number;
  dataCadastro: string;
  dataActualizacao: string;
  
  // Relacionamentos
  tb_utilizadores?: {
    codigo: number;
    nome: string;
    email: string;
  };
  tb_professor_disciplina?: IProfessorDisciplina[];
  tb_professor_turma?: IProfessorTurma[];
  
  // Contadores para listagem
  _count?: {
    tb_professor_disciplina: number;
    tb_professor_turma: number;
  };
}

export interface IProfessorInput {
  nome: string;
  email: string;
  telefone?: string;
  formacao: string;
  nivelAcademico: string;
  especialidade?: string;
  numeroFuncionario?: string;
  dataAdmissao?: string;
  status?: string;
  codigo_Utilizador?: number;
}

// ===============================================================
// ATRIBUIÇÕES DE DISCIPLINAS
// ===============================================================

export interface IProfessorDisciplina {
  codigo: number;
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Curso: number;
  anoLectivo: string;
  dataCadastro: string;
  
  // Relacionamentos
  tb_professores?: IProfessor;
  tb_disciplinas?: {
    codigo: number;
    designacao: string;
  };
  tb_cursos?: {
    codigo: number;
    designacao: string;
  };
}

export interface IProfessorDisciplinaInput {
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Curso: number;
  anoLectivo: string;
}

// ===============================================================
// ATRIBUIÇÕES DE TURMAS
// ===============================================================

export interface IProfessorTurma {
  codigo: number;
  codigo_Professor: number;
  codigo_Turma: number;
  codigo_Disciplina: number;
  anoLectivo: string;
  status: string;
  dataCadastro: string;
  
  // Relacionamentos
  tb_professores?: IProfessor;
  tb_turmas?: {
    codigo: number;
    designacao: string;
    tb_classes?: {
      designacao: string;
    };
  };
  tb_disciplinas?: {
    codigo: number;
    designacao: string;
  };
}

export interface IProfessorTurmaInput {
  codigo_Professor: number;
  codigo_Turma: number;
  codigo_Disciplina: number;
  anoLectivo: string;
  status?: string;
}

// ===============================================================
// DADOS AUXILIARES
// ===============================================================

export interface IDisciplina {
  codigo: number;
  designacao: string;
}

export interface ICurso {
  codigo: number;
  designacao: string;
}

export interface ITurma {
  codigo: number;
  designacao: string;
  tb_classes?: {
    codigo: number;
    designacao: string;
  };
  tb_cursos?: {
    codigo: number;
    designacao: string;
  };
}

// ===============================================================
// RESPOSTAS DA API
// ===============================================================

export interface IProfessorResponse {
  success: boolean;
  message: string;
  data: IProfessor;
}

export interface IProfessorListResponse {
  success: boolean;
  message: string;
  data: IProfessor[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface IProfessorDisciplinaResponse {
  success: boolean;
  message: string;
  data: IProfessorDisciplina[];
}

export interface IProfessorTurmaResponse {
  success: boolean;
  message: string;
  data: IProfessorTurma[];
}

export interface IDisciplinaResponse {
  success: boolean;
  message: string;
  data: IDisciplina[];
}

export interface ICursoResponse {
  success: boolean;
  message: string;
  data: ICurso[];
}

export interface ITurmaResponse {
  success: boolean;
  message: string;
  data: ITurma[];
}

// ===============================================================
// ESTATÍSTICAS
// ===============================================================

export interface IEstatisticasProfessores {
  totalProfessores: number;
  professoresActivos: number;
  professoresInactivos: number;
  totalAtribuicoesDisciplinas: number;
  totalAtribuicoesTurmas: number;
}
