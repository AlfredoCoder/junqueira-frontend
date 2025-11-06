"use client";

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
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
  GraduationCap,
} from 'lucide-react';

import { useCreateDocente, useEspecialidades } from '@/hooks/useTeacher';
import { useStatus } from '@/hooks/useStatusControl';

// Schema de validação
const docenteSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: yup.string().required('Telefone é obrigatório'),
  genero: yup.string().required('Gênero é obrigatório'),
  dataNascimento: yup.string().required('Data de nascimento é obrigatória'),
  morada: yup.string().required('Morada é obrigatória'),
  dataAdmissao: yup.string().required('Data de admissão é obrigatória'),
  status: yup.string().default('Activo'),
  formacao: yup.string().required('Formação é obrigatória'),
  nivelAcademico: yup.string().required('Nível acadêmico é obrigatório'),
});

type DocenteFormData = yup.InferType<typeof docenteSchema>;

export default function AddTeacherPage() {
  const router = useRouter();
  
  const { createDocente, loading: createLoading } = useCreateDocente();
  const { especialidades } = useEspecialidades();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit: handleFormSubmit, formState: { errors } } = useForm<DocenteFormData>({
    resolver: yupResolver(docenteSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      genero: '',
      dataNascimento: '',
      morada: '',
      dataAdmissao: '',
      status: 'Activo',
      formacao: '',
      nivelAcademico: '',
    }
  });

  const { status } = useStatus(1, 100, ""); 

  const handleSubmit = async (data: DocenteFormData) => {
    console.log('📝 Dados do formulário:', data);
    
    setIsSubmitting(true);

    // Mapear dados do formulário para o formato da API
    // Gerar número de funcionário automaticamente baseado no timestamp
    const numeroFuncionario = `PROF${Date.now().toString().slice(-6)}`;
    
    const professorData = {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      genero: data.genero,
      dataNascimento: data.dataNascimento,
      morada: data.morada,
      numeroFuncionario: numeroFuncionario,
      dataAdmissao: data.dataAdmissao,
      status: data.status,
      formacao: data.formacao,
      nivelAcademico: data.nivelAcademico
    };

    console.log('🚀 Enviando para API:', professorData);

    const result = await createDocente(professorData as any);
    
    if (result) {
      setTimeout(() => {
        router.push('/admin/teacher-management/teacher');
      }, 2000);
    }
    setIsSubmitting(false);
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);
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
            <h1 className="text-3xl font-bold text-gray-900">Novo Docente</h1>
            <p className="text-gray-600">Adicionar novo docente ao sistema</p>
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
            disabled={isSubmitting || createLoading}
            className="bg-[#3B6C4D] hover:bg-[#8B4513]"
          >
            {isSubmitting || createLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin loading-spinner" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting || createLoading ? 'Criando...' : 'Criar Docente'}
          </Button>
        </div>
      </div>

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
                <Label htmlFor="telefone">Telefone <span className="text-red-500">*</span></Label>
                <Controller
                  name="telefone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="telefone"
                      placeholder="923456789"
                      className={errors.telefone ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.telefone && (
                  <p className="text-red-500 text-sm mt-1">{errors.telefone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="genero">Gênero <span className="text-red-500">*</span></Label>
                <Controller
                  name="genero"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={errors.genero ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Masculino</SelectItem>
                        <SelectItem value="F">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.genero && (
                  <p className="text-red-500 text-sm mt-1">{errors.genero.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento <span className="text-red-500">*</span></Label>
                <Controller
                  name="dataNascimento"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="dataNascimento"
                      type="date"
                      className={errors.dataNascimento ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.dataNascimento && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataNascimento.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="morada">Morada <span className="text-red-500">*</span></Label>
                <Controller
                  name="morada"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="morada"
                      placeholder="Endereço completo"
                      className={errors.morada ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.morada && (
                  <p className="text-red-500 text-sm mt-1">{errors.morada.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Informações Profissionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Informações Profissionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Número de Funcionário</Label>
                <div className="p-3 bg-gray-50 rounded-lg border">
                  <span className="text-gray-600 text-sm">
                    ✨ Será gerado automaticamente (ex: PROF123456)
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="dataAdmissao">Data de Admissão <span className="text-red-500">*</span></Label>
                <Controller
                  name="dataAdmissao"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="dataAdmissao"
                      type="date"
                      className={errors.dataAdmissao ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.dataAdmissao && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataAdmissao.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="formacao">Formação <span className="text-red-500">*</span></Label>
                <Controller
                  name="formacao"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="formacao"
                      placeholder="Licenciatura em Matemática"
                      className={errors.formacao ? 'border-red-500' : ''}
                    />
                  )}
                />
                {errors.formacao && (
                  <p className="text-red-500 text-sm mt-1">{errors.formacao.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="nivelAcademico">Nível Acadêmico <span className="text-red-500">*</span></Label>
                <Controller
                  name="nivelAcademico"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={errors.nivelAcademico ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Licenciado">Licenciado</SelectItem>
                        <SelectItem value="Mestre">Mestre</SelectItem>
                        <SelectItem value="Doutor">Doutor</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nivelAcademico && (
                  <p className="text-red-500 text-sm mt-1">{errors.nivelAcademico.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Ativo</SelectItem>
                        <SelectItem value="Inactivo">Inativo</SelectItem>
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
