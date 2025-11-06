// ===============================================================
// TIPOS PARA O NOVO SISTEMA DE PROFESSORES
// ===============================================================

// Interface para professor (baseada na nova tabela tb_professores)
export interface IProfessor {
  codigo: number;
  nome: string;
  email: string;
  telefone?: string;
  formacao: string;
  nivelAcademico: string;
  especialidade?: string;
  numeroFuncionario?: string;
  dataAdmissao?: string;
  status: string;
  codigo_Utilizador?: number;
  dataCadastro: string;
  dataActualizacao: string;
  
  // Relacionamentos
  tb_professor_disciplina?: IProfessorDisciplina[];
  tb_professor_turma?: IProfessorTurma[];
  tb_notas_alunos?: INotaAluno[];
}

// Interface para relacionamento professor-disciplina
export interface IProfessorDisciplina {
  codigo: number;
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Curso: number;
  anoLectivo: string;
  status: string;
  dataCadastro: string;
  
  // Relacionamentos expandidos (quando incluídos)
  tb_disciplinas?: {
    codigo: number;
    designacao: string;
  };
  tb_cursos?: {
    codigo: number;
    designacao: string;
  };
}

// Interface para relacionamento professor-turma
export interface IProfessorTurma {
  codigo: number;
  codigo_Professor: number;
  codigo_Turma: number;
  codigo_Disciplina: number;
  anoLectivo: string;
  status: string;
  dataCadastro: string;
  
  // Relacionamentos expandidos (quando incluídos)
  tb_turmas?: {
    codigo: number;
    designacao: string;
    tb_classes?: {
      designacao: string;
    };
    tb_cursos?: {
      designacao: string;
    };
  };
  tb_disciplinas?: {
    codigo: number;
    designacao: string;
  };
}

// Interface para período de avaliação
export interface IPeriodoAvaliacao {
  codigo: number;
  designacao: string;
  tipoAvaliacao: 'MAC' | 'PP' | 'PT';
  trimestre: number;
  dataInicio: string;
  dataFim: string;
  anoLectivo: string;
  status: string;
  observacoes?: string;
  dataCadastro: string;
}

// Interface para nota de aluno
export interface INotaAluno {
  codigo: number;
  codigo_Aluno: number;
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  codigo_Periodo: number;
  trimestre: number;
  anoLectivo: string;
  notaMAC?: number;
  notaPP?: number;
  notaPT?: number;
  mediaTrimestre?: number;
  classificacao?: 'Aprovado' | 'Reprovado' | 'Pendente';
  observacoes?: string;
  dataLancamento: string;
  dataActualizacao: string;
  lancadoPor: number;
  status: string;
  
  // Relacionamentos expandidos
  tb_alunos?: {
    codigo: number;
    nome: string;
    url_Foto?: string;
  };
  tb_professores?: {
    codigo: number;
    nome: string;
  };
  tb_periodos_avaliacao?: IPeriodoAvaliacao;
}

// Interface para histórico de notas
export interface IHistoricoNota {
  codigo: number;
  codigo_Nota: number;
  campoAlterado: string;
  valorAnterior?: number;
  valorNovo?: number;
  motivoAlteracao?: string;
  alteradoPor: number;
  dataAlteracao: string;
  
  // Relacionamentos
  tb_utilizadores?: {
    nome: string;
  };
}

// Interface para aluno (dados básicos)
export interface IAlunoBasico {
  codigo: number;
  nome: string;
  email?: string;
  telefone?: string;
  url_Foto?: string;
}

// Interface para disciplina (dados básicos)
export interface IDisciplinaBasica {
  codigo: number;
  designacao: string;
}

// Interface para curso (dados básicos)
export interface ICursoBasico {
  codigo: number;
  designacao: string;
}

// Interface para turma (dados básicos)
export interface ITurmaBasica {
  codigo: number;
  designacao: string;
  tb_classes?: {
    designacao: string;
  };
  tb_cursos?: {
    designacao: string;
  };
}

// ===============================================================
// INTERFACES PARA FORMULÁRIOS E INPUTS
// ===============================================================

// Interface para input de criação/atualização de professor
export interface IProfessorInput {
  nome: string;
  email: string;
  telefone?: string;
  formacao: string;
  nivelAcademico: string;
  especialidade?: string;
  numeroFuncionario?: string;
  dataAdmissao?: string;
  codigo_Utilizador?: number;
}

// Interface para input de atribuição de disciplina
export interface IAtribuicaoDisciplinaInput {
  disciplinaId: number;
  cursoId: number;
  anoLectivo: string;
}

// Interface para input de atribuição de turma
export interface IAtribuicaoTurmaInput {
  turmaId: number;
  disciplinaId: number;
  anoLectivo: string;
}

// Interface para input de criação de período
export interface IPeriodoAvaliacaoInput {
  designacao: string;
  tipoAvaliacao: 'MAC' | 'PP' | 'PT';
  trimestre: number;
  dataInicio: string;
  dataFim: string;
  anoLectivo: string;
  observacoes?: string;
}

// Interface para input de lançamento de nota
export interface INotaInput {
  codigo_Aluno: number;
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  codigo_Periodo: number;
  trimestre: number;
  anoLectivo: string;
  notaMAC?: number;
  notaPP?: number;
  notaPT?: number;
  observacoes?: string;
}

// Interface para lançamento de notas em lote
export interface INotasLoteInput {
  codigo_Professor: number;
  codigo_Disciplina: number;
  codigo_Turma: number;
  codigo_Periodo: number;
  trimestre: number;
  anoLectivo: string;
  notas: Array<{
    codigo_Aluno: number;
    notaMAC?: number;
    notaPP?: number;
    notaPT?: number;
    observacoes?: string;
  }>;
}

// ===============================================================
// INTERFACES PARA RESPOSTAS DA API
// ===============================================================

// Interface para paginação
export interface IPaginacao {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Interface para resposta padrão da API
export interface IApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: IPaginacao;
}

// Interface para estatísticas de relatório
export interface IEstatisticasRelatorio {
  totalAlunos: number;
  aprovados: number;
  reprovados: number;
  pendentes: number;
  mediaGeral: number;
  percentualAprovacao: number;
}

// Interface para relatório de turma
export interface IRelatorioTurma {
  turma: ITurmaBasica;
  disciplina: IDisciplinaBasica;
  trimestre: number;
  anoLectivo: string;
  notas: INotaAluno[];
  estatisticas: IEstatisticasRelatorio;
}

// Interface para resultado de lançamento em lote
export interface IResultadoLote {
  sucessos: number;
  totalErros: number;
  resultados: Array<{
    codigo_Aluno: number;
    sucesso: boolean;
    nota?: INotaAluno;
  }>;
  erros: Array<{
    codigo_Aluno: number;
    erro: string;
  }>;
}

// ===============================================================
// TIPOS PARA FILTROS E CONSULTAS
// ===============================================================

// Tipo para status de professor
export type StatusProfessor = 'Activo' | 'Inactivo';

// Tipo para nível acadêmico
export type NivelAcademico = 'Bacharel' | 'Licenciado' | 'Mestre' | 'Doutor';

// Tipo para tipo de avaliação
export type TipoAvaliacao = 'MAC' | 'PP' | 'PT';

// Tipo para classificação
export type Classificacao = 'Aprovado' | 'Reprovado' | 'Pendente';

// Tipo para trimestre
export type Trimestre = 1 | 2 | 3;

// Interface para filtros de professor
export interface IFiltrosProfessor {
  search?: string;
  status?: StatusProfessor;
  page?: number;
  limit?: number;
}

// Interface para filtros de notas
export interface IFiltrosNotas {
  turmaId?: number;
  disciplinaId?: number;
  trimestre?: Trimestre;
  anoLectivo?: string;
  classificacao?: Classificacao;
  nomeAluno?: string;
}

// Interface para filtros de períodos
export interface IFiltrosPeriodos {
  anoLectivo?: string;
  trimestre?: Trimestre;
  tipoAvaliacao?: TipoAvaliacao;
}
