import * as yup from "yup";

export const addStudentSchema = yup.object({
  // DADOS DO ALUNO - COMPATÍVEL COM BACKEND ZOD
  nome: yup
    .string()
    .required("Nome é obrigatório")
    .min(1, "Nome não pode estar vazio")
    .max(200, "Nome deve ter no máximo 200 caracteres"),

  pai: yup
    .string()
    .max(200, "Nome do pai deve ter no máximo 200 caracteres")
    .optional(),

  mae: yup
    .string()
    .max(200, "Nome da mãe deve ter no máximo 200 caracteres")
    .optional(),

  codigo_Nacionalidade: yup
    .number()
    .typeError("Nacionalidade deve ser um número")
    .integer("Nacionalidade deve ser um número inteiro")
    .positive("Nacionalidade deve ser positiva")
    .required("Nacionalidade é obrigatória"),

  // CAMPO OBRIGATÓRIO ADICIONADO!
  codigo_Estado_Civil: yup
    .number()
    .typeError("Estado civil deve ser um número")
    .integer("Estado civil deve ser um número inteiro")
    .positive("Estado civil deve ser positivo")
    .default(1), // SOLTEIRO como padrão

  dataNascimento: yup
    .date()
    .typeError("Data de nascimento inválida")
    .optional(), // Opcional conforme backend

  email: yup
    .string()
    .email("Email inválido")
    .max(45, "Email deve ter no máximo 45 caracteres")
    .optional(), // Opcional conforme backend

  telefone: yup
    .string()
    .max(45, "Telefone deve ter no máximo 45 caracteres")
    .optional(), // Opcional conforme backend

  codigo_Comuna: yup
    .number()
    .typeError("Comuna deve ser um número")
    .integer("Comuna deve ser um número inteiro")
    .positive("Comuna deve ser positiva")
    .required("Comuna é obrigatória"),

  sexo: yup
    .string()
    .max(10, "Sexo deve ter no máximo 10 caracteres")
    .oneOf(['M', 'F', 'Masculino', 'Feminino'], "Sexo deve ser M, F, Masculino ou Feminino")
    .optional(),

  n_documento_identificacao: yup
    .string()
    .max(45, "Número do documento deve ter no máximo 45 caracteres")
    .optional(), // Opcional - será gerado automaticamente se vazio

  saldo: yup
    .number()
    .min(0, "Saldo não pode ser negativo")
    .default(0),

  morada: yup
    .string()
    .max(60, "Morada deve ter no máximo 60 caracteres")
    .default("..."),

  codigoTipoDocumento: yup
    .number()
    .typeError("Tipo de documento deve ser um número")
    .integer("Tipo de documento deve ser um número inteiro")
    .positive("Tipo de documento deve ser positivo")
    .default(1),

  // CAMPOS ADICIONAIS DO FRONTEND (IGNORADOS NO BACKEND)
  codigo_Utilizador: yup.string().optional(),
  provincia: yup.string().optional(),
  municipio: yup.string().optional(),

  // ENCARREGADO - COMPATÍVEL COM BACKEND ZOD
  encarregado: yup.object({
    nome: yup
      .string()
      .required("Nome do encarregado é obrigatório")
      .min(1, "Nome do encarregado não pode estar vazio")
      .max(250, "Nome do encarregado deve ter no máximo 250 caracteres"),
    
    telefone: yup
      .string()
      .required("Telefone do encarregado é obrigatório")
      .min(1, "Telefone do encarregado não pode estar vazio")
      .max(45, "Telefone do encarregado deve ter no máximo 45 caracteres"),
    
    email: yup
      .string()
      .email("Email do encarregado inválido")
      .max(45, "Email do encarregado deve ter no máximo 45 caracteres")
      .optional(), // Opcional conforme backend
    
    codigo_Profissao: yup
      .number()
      .typeError("Profissão do encarregado deve ser um número")
      .integer("Profissão do encarregado deve ser um número inteiro")
      .positive("Profissão do encarregado deve ser positiva")
      .required("Profissão do encarregado é obrigatória"),
    
    local_Trabalho: yup
      .string()
      .required("Local de trabalho é obrigatório")
      .min(1, "Local de trabalho não pode estar vazio")
      .max(45, "Local de trabalho deve ter no máximo 45 caracteres"),
    
    status: yup
      .number()
      .typeError("Status deve ser um número")
      .integer("Status deve ser um número inteiro")
      .default(1), // Status ativo como padrão
  }).required("Encarregado é obrigatório"),
});
