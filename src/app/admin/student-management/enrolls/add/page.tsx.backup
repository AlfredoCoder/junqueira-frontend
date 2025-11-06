"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  ArrowLeft,
  Save,
  User,
  BookOpen,
  AlertCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { useStudent } from '@/hooks/useStudent';
import { Student } from '@/types/student.types';
import { ICourse } from '@/types/course.types';
import { useCreateMatricula } from '@/hooks/useMatricula';
import { IMatriculaInput } from '@/types/matricula.types';
import { matriculaSchema } from '@/validations/matricula.validations';
import { useFilterOptions } from '@/hooks/useFilterOptions';

// Tipo estendido para curso com relacionamentos
interface CourseWithRelations extends ICourse {
  duracao_anos?: number;
  tb_niveis_academicos?: {
    designacao: string;
  };
}

type MatriculaFormData = yup.InferType<typeof matriculaSchema>;

export default function AddEnrollmentPage() {
  const router = useRouter();
  const [studentSearch, setStudentSearch] = useState("");

  // Estados para busca de alunos
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Hooks da API
  const { createMatricula, loading: createLoading } = useCreateMatricula();
  const {
    courses,
    statusOptions,
    loadingCourses: coursesLoading,
    loadingStatus: statusLoading
  } = useFilterOptions(1, 100);
  const { students, loading: loadingSearch, getAllStudents } = useStudent();

  // React Hook Form com Yup
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MatriculaFormData>({
    resolver: yupResolver(matriculaSchema),
    defaultValues: {
      codigo_Aluno: "",
      codigo_Curso: "",
      data_Matricula: new Date().toISOString().split('T')[0],
      codigoStatus: "1",
    },
  });

  // Watch dos valores do formulário para o resumo
  const watchedValues = watch();

  // Buscar alunos usando o hook useStudent
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (studentSearch && studentSearch.length >= 2) {
        getAllStudents(1, 50, studentSearch);
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [studentSearch, getAllStudents]);

  // Handler para submissão do formulário
  const onSubmit = async (data: MatriculaFormData) => {

    const dataMatricula = new Date(data.data_Matricula + 'T00:00:00.000Z').toISOString();

    const matriculaData: IMatriculaInput = {
      codigo_Aluno: parseInt(data.codigo_Aluno),
      codigo_Curso: parseInt(data.codigo_Curso),
      data_Matricula: dataMatricula,
      codigo_Utilizador: 49, // Usando usuário existente (Emanuel Malungo224)
      codigoStatus: parseInt(data.codigoStatus)
    };

    const result = await createMatricula(matriculaData);

    if (result) {
      router.push('/admin/student-management/enrolls');
    }

  };

  // Selecionar aluno
  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setValue('codigo_Aluno', student.codigo.toString(), { shouldValidate: true });
    setShowSearchResults(false);
    setStudentSearch(student.nome || '');
  };

  const selectedCourse = courses?.find((c) => c.codigo.toString() === watchedValues.codigo_Curso) as CourseWithRelations | undefined;
  const selectedStatus = statusOptions?.find((s) => s.value === watchedValues.codigoStatus);

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white py-8 px-4 rounded-md shadow">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Nova Matrícula</h1>
            </div>
          </div>
          {/* Botões */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="matricula-form"
              disabled={createLoading}
              className="flex items-center space-x-2"
            >
              {createLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{createLoading ? 'Criando...' : 'Criar Matrícula'}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Dados da Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <form id="matricula-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Busca de Aluno */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Buscar Aluno *
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        {loadingSearch && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
                        )}
                        <Input
                          placeholder="Digite o nome, email ou documento do aluno..."
                          value={studentSearch}
                          onChange={(e) => setStudentSearch(e.target.value)}
                          className="pl-10 pr-10"
                        />
                      </div>
                    </div>

                    {/* Resultados da busca */}
                    {showSearchResults && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Resultados da Busca {students.length > 0 && `(${students.length} encontrado${students.length !== 1 ? 's' : ''})`}
                        </label>
                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                          {loadingSearch ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Buscando alunos...</span>
                              </div>
                            </div>
                          ) : students.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                              <div className="flex items-center justify-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <span>Nenhum aluno encontrado</span>
                              </div>
                            </div>
                          ) : (
                            students.map((student: Student) => (
                              <div
                                key={student.codigo}
                                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSelectStudent(student)}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{student.nome}</span>
                                  <span className="text-sm text-gray-500">
                                    {student.email && `${student.email} • `}
                                    {student.telefone && `${student.telefone} • `}
                                    Doc: {student.n_documento_identificacao || 'N/A'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}

                    {/* Aluno selecionado */}
                    {selectedStudent && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-900 mb-2">Aluno Selecionado</h4>
                        <p className="text-sm font-semibold text-green-800">{selectedStudent.nome}</p>
                        <p className="text-xs text-green-600">
                          {selectedStudent.email && `${selectedStudent.email} • `}
                          {selectedStudent.telefone && `${selectedStudent.telefone} • `}
                          Doc: {selectedStudent.n_documento_identificacao || 'N/A'}
                        </p>
                      </div>
                    )}

                    {errors.codigo_Aluno && (
                      <p className="text-sm text-red-600">{errors.codigo_Aluno.message}</p>
                    )}
                  </div>

                  {/* Curso */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Curso *
                    </label>
                    <Controller
                      name="codigo_Curso"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className={errors.codigo_Curso ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione um curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {coursesLoading ? (
                              <div className="p-2 text-center text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                Carregando cursos...
                              </div>
                            ) : courses && courses.length > 0 ? (
                              courses.map((course) => (
                                <SelectItem key={course.codigo} value={course.codigo.toString()}>
                                  <div className="flex flex-col">
                                    <span className="font-medium">{course.designacao}</span>
                                    <span className="text-xs text-gray-500">
                                      {(course as CourseWithRelations).duracao_anos} ano{(course as CourseWithRelations).duracao_anos !== 1 ? 's' : ''} •
                                      {(course as CourseWithRelations).tb_niveis_academicos?.designacao || 'N/A'}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            ) : (
                              <div className="p-2 text-center text-gray-500">Nenhum curso disponível</div>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigo_Curso && (
                      <p className="text-sm text-red-600">{errors.codigo_Curso.message}</p>
                    )}
                  </div>

                  {/* Data de Matrícula */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Data de Matrícula *
                    </label>
                    <Controller
                      name="data_Matricula"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="date"
                          {...field}
                          className={errors.data_Matricula ? "border-red-500" : ""}
                        />
                      )}
                    />
                    {errors.data_Matricula && (
                      <p className="text-sm text-red-600">{errors.data_Matricula.message}</p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Status da Matrícula
                    </label>
                    <Controller
                      name="codigoStatus"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusLoading ? (
                              <div className="p-2 text-center text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                                Carregando status...
                              </div>
                            ) : statusOptions && statusOptions.length > 0 ? (
                              statusOptions
                                .filter(option => option.value !== "all") // Remover opção "Todos"
                                .map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))
                            ) : (
                              <>
                                <SelectItem value="1">Ativa</SelectItem>
                                <SelectItem value="0">Inativa</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Resumo da Matrícula</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStudent && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Aluno</h4>
                    <p className="text-sm font-semibold text-green-800">{selectedStudent.nome}</p>
                    <p className="text-xs text-green-600">
                      {selectedStudent.email && `${selectedStudent.email}`}
                    </p>
                  </div>
                )}

                {selectedCourse && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Curso</h4>
                    <p className="text-sm font-semibold text-blue-800">{selectedCourse.designacao}</p>
                    <p className="text-xs text-blue-600">
                      {selectedCourse.duracao_anos} ano{selectedCourse.duracao_anos !== 1 ? 's' : ''} •
                      {selectedCourse.tb_niveis_academicos?.designacao || 'N/A'}
                    </p>
                  </div>
                )}

                {watchedValues.data_Matricula && (
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium text-yellow-900 mb-2">Data de Matrícula</h4>
                    <p className="text-sm font-semibold text-yellow-800">
                      {new Date(watchedValues.data_Matricula).toLocaleDateString('pt-AO')}
                    </p>
                  </div>
                )}

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Status</h4>
                  <Badge
                    variant={watchedValues.codigoStatus === "1" ? "default" : "secondary"}
                    className={watchedValues.codigoStatus === "1" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {selectedStatus?.label || (watchedValues.codigoStatus === "1" ? "Ativa" : "Inativa")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}