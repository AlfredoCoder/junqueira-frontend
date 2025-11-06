import { IMatricula, IMatriculaDetailed } from "@/types/matricula.types"

// Utilitários para trabalhar com matrículas

export class MatriculaUtils {
  // Verificar se uma matrícula está ativa
  static isActive(matricula: IMatricula): boolean {
    return matricula.codigoStatus === 1
  }

  // Verificar se uma matrícula tem confirmações
  static hasConfirmations(matricula: IMatricula | IMatriculaDetailed): boolean {
    return Boolean(matricula.tb_confirmacoes && matricula.tb_confirmacoes.length > 0)
  }

  // Obter a confirmação mais recente
  static getLatestConfirmation(matricula: IMatricula | IMatriculaDetailed) {
    if (!matricula.tb_confirmacoes || matricula.tb_confirmacoes.length === 0) {
      return null
    }
    
    return matricula.tb_confirmacoes.reduce((latest, current) => {
      const latestDate = new Date(latest.data_Confirmacao || 0)
      const currentDate = new Date(current.data_Confirmacao || 0)
      return currentDate > latestDate ? current : latest
    })
  }

  // Calcular idade do aluno na data da matrícula
  static calculateAgeAtEnrollment(matricula: IMatricula | IMatriculaDetailed): number | null {
    if (!matricula.tb_alunos.dataNascimento) return null
    
    const birthDate = new Date(matricula.tb_alunos.dataNascimento)
    const enrollmentDate = new Date(matricula.data_Matricula)
    
    let age = enrollmentDate.getFullYear() - birthDate.getFullYear()
    const monthDiff = enrollmentDate.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && enrollmentDate.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Formatar data de matrícula para exibição
  static formatEnrollmentDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  // Obter status da matrícula como texto
  static getStatusText(status: number): string {
    switch (status) {
      case 0:
        return "Inativa"
      case 1:
        return "Ativa"
      default:
        return "Desconhecido"
    }
  }

  // Obter cor do status para UI
  static getStatusColor(status: number): string {
    switch (status) {
      case 0:
        return "text-red-600 bg-red-100"
      case 1:
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  // Verificar se a matrícula pode ser editada
  static canEdit(matricula: IMatricula | IMatriculaDetailed): boolean {
    // Não pode editar se já tem confirmações
    if (this.hasConfirmations(matricula)) {
      return false
    }
    
    // Não pode editar se está inativa
    if (!this.isActive(matricula)) {
      return false
    }
    
    return true
  }

  // Verificar se a matrícula pode ser excluída
  static canDelete(matricula: IMatricula | IMatriculaDetailed): boolean {
    // Não pode excluir se já tem confirmações
    return !this.hasConfirmations(matricula)
  }

  // Gerar número de matrícula baseado no padrão da instituição
  static generateMatriculaNumber(
    alunoId: number, 
    cursoId: number, 
    year: number
  ): string {
    const yearStr = year.toString().slice(-2)
    const alunoStr = alunoId.toString().padStart(4, '0')
    const cursoStr = cursoId.toString().padStart(2, '0')
    return `${yearStr}${cursoStr}${alunoStr}`
  }

  // Validar se os dados da matrícula estão completos
  static validateComplete(matricula: Partial<IMatricula>): string[] {
    const errors: string[] = []
    
    if (!matricula.codigo_Aluno) {
      errors.push("Aluno é obrigatório")
    }
    
    if (!matricula.codigo_Curso) {
      errors.push("Curso é obrigatório")
    }
    
    if (!matricula.codigo_Utilizador) {
      errors.push("Utilizador é obrigatório")
    }
    
    if (!matricula.data_Matricula) {
      errors.push("Data da matrícula é obrigatória")
    }
    
    return errors
  }

  // Filtrar matrículas por critérios
  static filterMatriculas(
    matriculas: IMatricula[], 
    filters: {
      status?: number
      cursoId?: number
      hasConfirmations?: boolean
      dateFrom?: Date
      dateTo?: Date
    }
  ): IMatricula[] {
    return matriculas.filter(matricula => {
      // Filtro por status
      if (filters.status !== undefined && matricula.codigoStatus !== filters.status) {
        return false
      }
      
      // Filtro por curso
      if (filters.cursoId !== undefined && matricula.codigo_Curso !== filters.cursoId) {
        return false
      }
      
      // Filtro por confirmações
      if (filters.hasConfirmations !== undefined) {
        const hasConf = this.hasConfirmations(matricula)
        if (hasConf !== filters.hasConfirmations) {
          return false
        }
      }
      
      // Filtro por data
      const matriculaDate = new Date(matricula.data_Matricula)
      if (filters.dateFrom && matriculaDate < filters.dateFrom) {
        return false
      }
      
      if (filters.dateTo && matriculaDate > filters.dateTo) {
        return false
      }
      
      return true
    })
  }

  // Agrupar matrículas por curso
  static groupByCourse(matriculas: IMatricula[]): Record<string, IMatricula[]> {
    return matriculas.reduce((groups, matricula) => {
      const courseKey = `${matricula.codigo_Curso}_${matricula.tb_cursos.designacao}`
      if (!groups[courseKey]) {
        groups[courseKey] = []
      }
      groups[courseKey].push(matricula)
      return groups
    }, {} as Record<string, IMatricula[]>)
  }

  // Obter estatísticas das matrículas
  static getStatistics(matriculas: IMatricula[]) {
    const total = matriculas.length
    const active = matriculas.filter(m => this.isActive(m)).length
    const inactive = total - active
    const withConfirmations = matriculas.filter(m => this.hasConfirmations(m)).length
    const withoutConfirmations = total - withConfirmations
    
    const courseStats = this.groupByCourse(matriculas)
    const courseCount = Object.keys(courseStats).length
    
    return {
      total,
      active,
      inactive,
      withConfirmations,
      withoutConfirmations,
      courseCount,
      courseStats: Object.entries(courseStats).map(([key, matriculas]) => ({
        course: key.split('_')[1],
        count: matriculas.length
      }))
    }
  }
}