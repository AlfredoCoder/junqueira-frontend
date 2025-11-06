import { z } from "zod"

// Schema para criar confirmação
export const confirmationCreateSchema = z.object({
  codigo_Matricula: z
    .number({
      required_error: "Código da matrícula é obrigatório",
      invalid_type_error: "Código da matrícula deve ser um número"
    })
    .int("Código da matrícula deve ser um número inteiro")
    .positive("Código da matrícula deve ser positivo"),

  data_Confirmacao: z
    .string({
      required_error: "Data da confirmação é obrigatória"
    })
    .datetime("Data da confirmação deve estar no formato ISO")
    .or(z.date())
    .transform((val) => typeof val === 'string' ? val : val.toISOString()),

  codigo_Turma: z
    .number({
      required_error: "Código da turma é obrigatório",
      invalid_type_error: "Código da turma deve ser um número"
    })
    .int("Código da turma deve ser um número inteiro")
    .positive("Código da turma deve ser positivo"),

  codigo_Ano_lectivo: z
    .number({
      required_error: "Código do ano letivo é obrigatório",
      invalid_type_error: "Código do ano letivo deve ser um número"
    })
    .int("Código do ano letivo deve ser um número inteiro")
    .positive("Código do ano letivo deve ser positivo"),

  codigo_Utilizador: z
    .number({
      required_error: "Código do utilizador é obrigatório",
      invalid_type_error: "Código do utilizador deve ser um número"
    })
    .int("Código do utilizador deve ser um número inteiro")
    .positive("Código do utilizador deve ser positivo"),

  mes_Comecar: z
    .string()
    .datetime("Mês para começar deve estar no formato ISO")
    .or(z.date())
    .transform((val) => typeof val === 'string' ? val : val.toISOString())
    .optional()
    .nullable(),

  codigo_Status: z
    .number()
    .int("Status deve ser um número inteiro")
    .min(0, "Status deve ser 0 ou 1")
    .max(1, "Status deve ser 0 ou 1")
    .default(1),

  classificacao: z
    .string()
    .max(45, "Classificação deve ter no máximo 45 caracteres")
    .trim()
    .optional()
    .nullable()
})

// Schema para atualizar confirmação (todos os campos opcionais)
export const confirmationUpdateSchema = confirmationCreateSchema.partial()

// Schema para validar busca por turma e ano
export const confirmationsByClassAndYearSchema = z.object({
  codigo_Turma: z
    .number({
      required_error: "Código da turma é obrigatório",
      invalid_type_error: "Código da turma deve ser um número"
    })
    .int("Código da turma deve ser um número inteiro")
    .positive("Código da turma deve ser positivo"),

  codigo_AnoLectivo: z
    .number({
      required_error: "Código do ano letivo é obrigatório", 
      invalid_type_error: "Código do ano letivo deve ser um número"
    })
    .int("Código do ano letivo deve ser um número inteiro")
    .positive("Código do ano letivo deve ser positivo")
})

// Schema para batch operations
export const batchConfirmationCreateSchema = z.object({
  confirmacoes: z
    .array(confirmationCreateSchema)
    .min(1, "Deve haver pelo menos uma confirmação")
    .max(100, "Máximo de 100 confirmações por lote")
})

// Tipos derivados dos schemas
export type ConfirmationCreateInput = z.infer<typeof confirmationCreateSchema>
export type ConfirmationUpdateInput = z.infer<typeof confirmationUpdateSchema>
export type ConfirmationsByClassAndYearInput = z.infer<typeof confirmationsByClassAndYearSchema>
export type BatchConfirmationCreateInput = z.infer<typeof batchConfirmationCreateSchema>

// Helper para validar data de confirmação
export const validateConfirmationDate = (date: string | Date): boolean => {
  const confirmationDate = new Date(date)
  const now = new Date()
  
  // Data não pode ser no futuro
  if (confirmationDate > now) {
    return false
  }
  
  // Data não pode ser muito antiga (mais de 5 anos)
  const fiveYearsAgo = new Date()
  fiveYearsAgo.setFullYear(now.getFullYear() - 5)
  
  if (confirmationDate < fiveYearsAgo) {
    return false
  }
  
  return true
}

// Helper para formatar data para input datetime-local
export const formatDateForInput = (date: string | Date): string => {
  const d = new Date(date)
  return d.toISOString().slice(0, 16)
}

// Helper para validar status
export const isValidStatus = (status: number): boolean => {
  return status === 0 || status === 1
}