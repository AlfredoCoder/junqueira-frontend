import * as yup from 'yup';

// Schema de validação Yup
export const matriculaSchema = yup.object({
  codigo_Aluno: yup
    .string()
    .required('Aluno é obrigatório')
    .test('is-valid-number', 'ID do aluno inválido', (value) => {
      const num = parseInt(value || '');
      return !isNaN(num) && num > 0;
    }),
  codigo_Curso: yup
    .string()
    .required('Curso é obrigatório')
    .test('is-valid-number', 'ID do curso inválido', (value) => {
      const num = parseInt(value || '');
      return !isNaN(num) && num > 0;
    }),
  data_Matricula: yup
    .string()
    .required('Data de matrícula é obrigatória')
    .test('not-future', 'Data de matrícula não pode ser futura', (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      const matriculaDate = new Date(value);
      return matriculaDate <= today;
    }),
  codigoStatus: yup
    .string()
    .required('Status é obrigatório')
    .oneOf(['0', '1'], 'Status inválido'),
}).required();