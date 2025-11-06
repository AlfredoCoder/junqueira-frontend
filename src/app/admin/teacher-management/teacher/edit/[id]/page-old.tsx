"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ArrowLeft,
  Save,
  Loader2,
  User,
} from 'lucide-react';
import { toast } from 'react-toastify';

// Schema de validação
const docenteSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  contacto: yup.string().required('Contacto é obrigatório'),
  status: yup.number().default(1),
  codigo_Especialidade: yup.number().required('Especialidade é obrigatória'),
});

type DocenteFormData = yup.InferType<typeof docenteSchema>;

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);

  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { control, handleSubmit: handleFormSubmit, formState: { errors }, reset } = useForm<DocenteFormData>({
    resolver: yupResolver(docenteSchema),
    defaultValues: {
      nome: '',
      email: '',
      contacto: '',
      status: 1,
      codigo_Especialidade: 1,
    }
  });

  // Carregar dados do docente no formulário
  useEffect(() => {
    if (teacher) {
      reset({
        nome: teacher.nome || '',
        email: teacher.email || '',
        contacto: teacher.contacto || '',
        status: teacher.status || 1,
        codigo_Especialidade: teacher.codigo_Especialidade || 1,
      });
    }
  }, [teacher, reset]);

  const handleSubmit = async (data: DocenteFormData) => {

    setIsSubmitting(true);
    setSaveSuccess(false);

    const result = await updateDocente(teacherId, data);

    if (result) {
      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/admin/teacher-management/teacher');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);
  if (loading) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#182F59] loading-spinner" />
          <span className="ml-2 text-gray-600">Carregando dados do docente...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Erro ao carregar docente:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="text-center py-8">
          <p className="text-gray-500">Docente não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Docente</h1>
            <p className="text-gray-600">{teacher.nome}</p>
          </div>
        </div>

        {/* Botões de Ação no Header */}
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => handleFormSubmit(handleSubmit)()}
            disabled={isSubmitting || updateLoading}
            className="bg-[#3B6C4D] hover:bg-[#8B4513]"
          >
            {isSubmitting || updateLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin loading-spinner" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting || updateLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      {/* Estados de Sucesso e Erro */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-green-500 mr-2">✓</div>
            <span className="text-green-700">Docente atualizado com sucesso! Redirecionando...</span>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo <span className="text-red-500">*</span></Label>
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="nome"
                      placeholder="Nome completo do docente"
                      className={errors.nome ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.nome && (
                  <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contacto">Contacto <span className="text-red-500">*</span></Label>
                <Controller
                  name="contacto"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="contacto"
                      placeholder="923456789"
                      className={errors.contacto ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.contacto && (
                  <p className="text-red-500 text-sm mt-1">{errors.contacto.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Acadêmicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Informações Acadêmicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="especialidade">Especialidade <span className="text-red-500">*</span></Label>
                <Controller
                  name="codigo_Especialidade"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className={errors.codigo_Especialidade ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione uma especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((esp) => (
                          <SelectItem key={esp.codigo} value={esp.codigo.toString()}>
                            {esp.designacao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.codigo_Especialidade && (
                  <p className="text-red-500 text-sm mt-1">{errors.codigo_Especialidade.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        {status.map((item) => (
                          <SelectItem key={item.codigo} value={item.codigo.toString()}>
                            {item.designacao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
