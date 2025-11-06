"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Save,
  Search,
  GraduationCap,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useCreateConfirmation } from '@/hooks/useConfirmation';
import { useTurmas } from '@/hooks/useTurma';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { IConfirmationInput } from '@/types/confirmation.types';
import { toast } from 'react-toastify';
import api from '@/utils/api.utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

// Schema de validação com Yup
const confirmationSchema = yup.object().shape({
  codigo_Matricula: yup
    .number()
    .positive('Matrícula é obrigatória')
    .required('Matrícula é obrigatória'),
  codigo_Turma: yup
    .number()
    .positive('Turma é obrigatória')
    .required('Turma é obrigatória'),
  data_Confirmacao: yup
    .string()
    .required('Data de confirmação é obrigatória')
    .test('not-future', 'Data de confirmação não pode ser futura', function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const confirmationDate = new Date(value);
      confirmationDate.setHours(0, 0, 0, 0);
      return confirmationDate <= today;
    }),
  codigo_Ano_lectivo: yup
    .number()
    .positive('Ano letivo é obrigatório')
    .required('Ano letivo é obrigatório'),
  codigo_Utilizador: yup.number().positive().required(),
  codigo_Status: yup.number().required(),
  classificacao: yup
    .string()
    .required('Classificação é obrigatória')
    .oneOf(['Aprovado', 'Pendente', 'Reprovado'], 'Classificação inválida'),
  mes_Comecar: yup.string().optional(),
});
export default function AddConfirmationPage() {
  const router = useRouter();
  const { createConfirmation, loading: creating, error: createError } = useCreateConfirmation();
  const { turmas, loading: turmasLoading } = useTurmas();
  const { codigo_Utilizador: currentUserId } = useCurrentUser();

  // Estados para dados carregados
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAcademicYears, setLoadingAcademicYears] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [enrollmentSearch, setEnrollmentSearch] = useState('');

  // Estados para busca de turmas
  const [turmaSearch, setTurmaSearch] = useState("");
  const [turmaSearchResults, setTurmaSearchResults] = useState<any[]>([]);
  const [loadingTurmaSearch, setLoadingTurmaSearch] = useState(false);
  const [showTurmaSearchResults, setShowTurmaSearchResults] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<any>(null);

  // React Hook Form com Yup resolver
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<IConfirmationInput>({
    resolver: yupResolver(confirmationSchema),
    defaultValues: {
      codigo_Matricula: 0,
      codigo_Turma: 0,
      data_Confirmacao: "",
      codigo_Ano_lectivo: 0,
      codigo_Utilizador: currentUserId || 1,
      codigo_Status: 1,
      classificacao: "",
      mes_Comecar: ""
    },
  });

  // Watch form values for summary display
  const watchedValues = watch();

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      console.log('Iniciando carregamento de dados...');
      await loadAcademicYears();
      console.log('Dados carregados!');
    };
    loadData();
  }, []);

  // Função para buscar alunos matriculados
  const searchEnrollments = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setLoadingSearch(true);

      const response = await api.get('/api/student-management/matriculas', {
        params: {
          search: searchTerm,
          limit: 50
        }
      });

      const data = response.data;
      if (data.success && data.data) {
        setSearchResults(data.data);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      toast.error('Erro ao buscar matrículas');
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Função para buscar turmas usando a API paginada
  const searchTurmas = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setTurmaSearchResults([]);
      setShowTurmaSearchResults(false);
      return;
    }

    try {
      setLoadingTurmaSearch(true);

      const response = await api.get('/api/academic-management/turmas', {
        params: {
          search: searchTerm,
          limit: 20
        }
      });

      const data = response.data;
      if (data.success && data.data) {
        setTurmaSearchResults(data.data);
        setShowTurmaSearchResults(true);
      } else {
        setTurmaSearchResults([]);
        setShowTurmaSearchResults(false);
      }
    } catch (error) {
      toast.error('Erro ao buscar turmas');
      setTurmaSearchResults([]);
      setShowTurmaSearchResults(false);
    } finally {
      setLoadingTurmaSearch(false);
    }
  };

  const loadAcademicYears = async () => {
    try {
      setLoadingAcademicYears(true);
      const response = await api.get('/api/academic-management/anos-lectivos');
      const data = response.data;
      if (data.success) {
        console.log('Anos letivos carregados:', data.data);
        setAcademicYears(data.data);
      } else {
        console.log('API retornou erro:', data.message);
      }
    } catch (error) {
      console.error('Erro ao carregar anos letivos:', error);
    } finally {
      setLoadingAcademicYears(false);
    }
  };

  // Debounce para busca de matrículas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (enrollmentSearch) {
        searchEnrollments(enrollmentSearch);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [enrollmentSearch]);

  // Debounce para busca de turmas
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (turmaSearch) {
        searchTurmas(turmaSearch);
      } else {
        setTurmaSearchResults([]);
        setShowTurmaSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [turmaSearch]);

  // Validação adicional para confirmação duplicada
  useEffect(() => {
    if (selectedEnrollment && watchedValues.codigo_Ano_lectivo && selectedEnrollment.tb_confirmacoes) {
      const existingConfirmation = selectedEnrollment.tb_confirmacoes.find(
        (conf: any) => conf.codigo_Ano_lectivo === watchedValues.codigo_Ano_lectivo
      );
      if (existingConfirmation) {
        toast.error('Já existe confirmação para esta matrícula neste ano letivo');
      }
    }
  }, [selectedEnrollment, watchedValues.codigo_Ano_lectivo]);

  const onSubmit = async (data: IConfirmationInput) => {
    console.log('=== INICIANDO SUBMIT ===');
    console.log('Dados do formulário:', data);

    // Verificar confirmação duplicada antes de enviar
    if (selectedEnrollment && selectedEnrollment.tb_confirmacoes) {
      const existingConfirmation = selectedEnrollment.tb_confirmacoes.find(
        (conf: any) => conf.codigo_Ano_lectivo === data.codigo_Ano_lectivo
      );
      if (existingConfirmation) {
        toast.error('Já existe confirmação para esta matrícula neste ano letivo');
        return;
      }
    }

    try {
      // Preparar dados para envio
      const dataToSend: any = {
        codigo_Matricula: data.codigo_Matricula,
        codigo_Turma: data.codigo_Turma,
        data_Confirmacao: new Date(data.data_Confirmacao + 'T00:00:00.000Z').toISOString(),
        codigo_Ano_lectivo: data.codigo_Ano_lectivo,
        codigo_Utilizador: data.codigo_Utilizador,
        codigo_Status: data.codigo_Status,
        classificacao: data.classificacao
      };

      // Só adicionar mes_Comecar se tiver valor
      if (data.mes_Comecar && data.mes_Comecar.trim() !== '') {
        dataToSend.mes_Comecar = new Date(data.mes_Comecar + 'T00:00:00.000Z').toISOString();
      }

      console.log('Dados originais:', data);
      console.log('Dados convertidos para envio:', dataToSend);
      console.log('Chamando createConfirmation com:', dataToSend);
      const result = await createConfirmation(dataToSend);
      console.log('Confirmação criada com sucesso:', result);

      toast.success('Confirmação criada com sucesso!', {
        autoClose: 2000,
        onClose: () => router.push('/admin/student-management/confirmations?success=created')
      });
    } catch (error) {
      console.error("Erro ao salvar confirmação:", error);

      let errorMessage = 'Erro desconhecido ao salvar confirmação';

      if (error instanceof Error) {
        if (error.message.includes('já possui confirmação')) {
          errorMessage = 'Esta matrícula já possui confirmação para o ano letivo selecionado.';
        } else if (error.message.includes('não encontrado')) {
          errorMessage = 'Dados não encontrados. Verifique se a matrícula, turma e ano letivo são válidos.';
        } else if (error.message.includes('Dados inválidos')) {
          errorMessage = 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.';
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(`Erro ao salvar confirmação: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
            <div className="space-y-3 ultra-fast-fade">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Nova Confirmação
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Confirmar Aluno em Turma</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Preencha as informações necessárias para confirmar um aluno em uma turma.
                Todos os campos marcados com * são obrigatórios.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className={`${isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#F9CD1D] hover:bg-[#F9CD1D]'
                  } text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 loading-spinner"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Confirmação
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D2B48C]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2 space-y-6 ultra-fast-fade">
            {/* Seleção da Matrícula */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Selecionar Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 ultra-fast-fade">
                  <label className="text-sm font-medium text-gray-700">
                    Buscar Matrícula *
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Digite o nome do aluno ou curso..."
                      value={enrollmentSearch}
                      onChange={(e) => setEnrollmentSearch(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Resultados da busca */}
                {showSearchResults && (
                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Resultados da Busca {searchResults.length > 0 && `(${searchResults.length} encontrado${searchResults.length !== 1 ? 's' : ''})`}
                    </label>
                    <div className="max-h-80 overflow-y-auto border rounded-lg">
                      {loadingSearch ? (
                        <div className="p-4 text-center text-gray-500">
                          Buscando...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((enrollment) => (
                          <div
                            key={enrollment.codigo}
                            className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedEnrollment(enrollment);
                              setValue('codigo_Matricula', enrollment.codigo);
                              setShowSearchResults(false);
                              setEnrollmentSearch(enrollment.tb_alunos?.nome || '');
                            }}
                          >
                            <div className="flex flex-col">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{enrollment.tb_alunos?.nome}</span>
                                {enrollment.tb_confirmacoes && enrollment.tb_confirmacoes.length > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {enrollment.tb_confirmacoes.length} confirmação(ões)
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                {enrollment.tb_cursos?.designacao} • Matrícula: {new Date(enrollment.data_Matricula).toLocaleDateString('pt-AO')}
                              </span>
                              {enrollment.tb_alunos?.email && (
                                <span className="text-xs text-gray-400">
                                  {enrollment.tb_alunos.email}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          Nenhum resultado encontrado
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Matrícula selecionada */}
                {selectedEnrollment && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Matrícula Selecionada</h4>
                    <div className="space-y-1 ultra-fast-fade">
                      <p className="text-sm font-semibold text-green-800">{selectedEnrollment.tb_alunos?.nome}</p>
                      <p className="text-xs text-green-600">{selectedEnrollment.tb_cursos?.designacao}</p>
                      <p className="text-xs text-green-600">
                        Matrícula: {new Date(selectedEnrollment.data_Matricula).toLocaleDateString('pt-AO')}
                      </p>
                      {selectedEnrollment.tb_alunos?.email && (
                        <p className="text-xs text-green-600">{selectedEnrollment.tb_alunos.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {errors.codigo_Matricula && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.codigo_Matricula.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Informações da Confirmação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Informações da Confirmação</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Buscar Turma *
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Digite o nome da turma..."
                        value={turmaSearch}
                        onChange={(e) => setTurmaSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Resultados da busca de turmas */}
                    {showTurmaSearchResults && (
                      <div className="max-h-80 overflow-y-auto border rounded-lg">
                        {loadingTurmaSearch ? (
                          <div className="p-4 text-center text-gray-500">
                            Buscando turmas...
                          </div>
                        ) : turmaSearchResults.length > 0 ? (
                          turmaSearchResults.map((turma) => (
                            <div
                              key={turma.codigo}
                              className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                setSelectedTurma(turma);
                                setValue('codigo_Turma', turma.codigo);
                                setShowTurmaSearchResults(false);
                                setTurmaSearch(turma.designacao || '');
                              }}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{turma.designacao}</span>
                                <span className="text-xs text-gray-500">
                                  {turma.tb_classes?.designacao} • {turma.tb_salas?.designacao} • {turma.tb_periodos?.designacao}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Nenhuma turma encontrada
                          </div>
                        )}
                      </div>
                    )}

                    {/* Turma selecionada */}
                    {selectedTurma && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Turma Selecionada</h4>
                        <div className="space-y-1 ultra-fast-fade">
                          <p className="text-sm font-semibold text-blue-800">{selectedTurma.designacao}</p>
                          <p className="text-xs text-blue-600">
                            {selectedTurma.tb_classes?.designacao} • {selectedTurma.tb_salas?.designacao} • {selectedTurma.tb_periodos?.designacao}
                          </p>
                        </div>
                      </div>
                    )}

                    {errors.codigo_Turma && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigo_Turma.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Data de Confirmação *
                    </label>
                    <Controller
                      name="data_Confirmacao"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                          className={errors.data_Confirmacao ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.data_Confirmacao && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.data_Confirmacao.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Classificação *
                    </label>
                    <Controller
                      name="classificacao"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value || undefined}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={errors.classificacao ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a classificação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Aprovado">Aprovado</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Reprovado">Reprovado</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.classificacao && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.classificacao.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Ano Letivo *
                    </label>
                    <Controller
                      name="codigo_Ano_lectivo"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value && field.value > 0 ? field.value.toString() : undefined}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger className={errors.codigo_Ano_lectivo ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione o ano letivo" />
                          </SelectTrigger>
                          <SelectContent>
                            {loadingAcademicYears ? (
                              <SelectItem value="loading" disabled>Carregando anos letivos...</SelectItem>
                            ) : academicYears && academicYears.length > 0 ? (
                              academicYears.map((year: any) => (
                                <SelectItem key={year.codigo} value={year.codigo.toString()}>
                                  {year.designacao}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-years" disabled>Nenhum ano letivo disponível</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigo_Ano_lectivo && (
                      <p className="text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.codigo_Ano_lectivo.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Status da Confirmação
                    </label>
                    <Controller
                      name="codigo_Status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ativa</SelectItem>
                            <SelectItem value="0">Inativa</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2 ultra-fast-fade">
                    <label className="text-sm font-medium text-gray-700">
                      Mês de Começar (Opcional)
                    </label>
                    <Controller
                      name="mes_Comecar"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-6 ultra-fast-fade">
            <Card>
              <CardHeader>
                <CardTitle>Resumo da Confirmação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedEnrollment ? (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Matrícula Selecionada</h4>
                    <p className="text-sm font-semibold text-blue-800">{selectedEnrollment.tb_alunos.nome}</p>
                    <p className="text-xs text-blue-600">{selectedEnrollment.tb_cursos.designacao}</p>
                    <p className="text-xs text-blue-600">Matrícula: {new Date(selectedEnrollment.data_Matricula).toLocaleDateString('pt-AO')}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Nenhuma matrícula selecionada</p>
                  </div>
                )}

                {selectedTurma && (
                  <div className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-900 mb-2">Turma Selecionada</h4>
                    <p className="text-sm font-semibold text-indigo-800">{selectedTurma.designacao}</p>
                    <p className="text-xs text-indigo-600">
                      {selectedTurma.tb_classes?.designacao} • {selectedTurma.tb_salas?.designacao}
                    </p>
                  </div>
                )}

                {watchedValues.data_Confirmacao && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Data de Confirmação</h4>
                    <p className="text-sm font-semibold text-yellow-800">
                      {new Date(watchedValues.data_Confirmacao).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Classificação</h4>
                  <Badge
                    variant={
                      watchedValues.classificacao === "Aprovado" ? "default" :
                        watchedValues.classificacao === "Pendente" ? "secondary" :
                          "destructive"
                    }
                    className={
                      watchedValues.classificacao === "Aprovado" ? "bg-green-100 text-green-800" :
                        watchedValues.classificacao === "Pendente" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                    }
                  >
                    {watchedValues.classificacao || "Não selecionada"}
                  </Badge>
                </div>

                {watchedValues.codigo_Ano_lectivo > 0 && (
                  <div className="p-4 bg-teal-50 rounded-lg">
                    <h4 className="font-medium text-teal-900 mb-2">Ano Letivo</h4>
                    <p className="text-sm font-semibold text-teal-800">
                      {academicYears.find(y => y.codigo === watchedValues.codigo_Ano_lectivo)?.designacao || watchedValues.codigo_Ano_lectivo}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações Importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <span>Informações Importantes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2 ultra-fast-fade">
                  <p>• Verifique se o aluno não possui confirmação ativa para o mesmo ano letivo</p>
                  <p>• A data de confirmação não pode ser futura</p>
                  <p>• Apenas uma confirmação ativa por matrícula/ano letivo é permitida</p>
                  <p>• A classificação pode ser alterada posteriormente se necessário</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

    </div>
  );
}