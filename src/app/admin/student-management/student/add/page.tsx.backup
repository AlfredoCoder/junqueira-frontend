"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Container from '@/components/layout/Container';
import useStudent from '@/hooks/useStudent';
import { useGeographic } from '@/hooks/useGeographic';
import { useDocumentTypes } from '@/hooks/useDocument';
import { addStudentSchema } from '@/validations/student.validatios';
import * as yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  UserPlus,
  ArrowLeft,
  Save,
  User,
  FileText,
  Users,
  AlertCircle,
  Search,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import BIService from '@/services/bi.service';
import { ConsultaBilheteResponse } from '@/types/bi.types';
import { useProfessions } from '@/hooks/useProfession';
import { useStatus } from '@/hooks/useStatusControl';

type AddStudentFormData = yup.InferType<typeof addStudentSchema>;

export default function AddStudentPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [showBIModal, setShowBIModal] = useState(true);
  const [biNumber, setBiNumber] = useState("");
  const [loadingBI, setLoadingBI] = useState(false);
  const [biError, setBiError] = useState("");
  const [biData, setBiData] = useState<ConsultaBilheteResponse | null>(null);
  
  const { createStudent, loading, error } = useStudent();

  // Configuração do react-hook-form com yupResolver
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(addStudentSchema),
    mode: 'onChange',
    defaultValues: {
      nome: "",
      pai: "",
      mae: "",
      codigo_Nacionalidade: undefined, 
      codigo_Estado_Civil: 1, // ADICIONADO: Solteiro como padrão
      dataNascimento: undefined, 
      email: "",
      telefone: "",
      codigo_Comuna: undefined, 
      codigo_Utilizador: "",
      sexo: undefined,
      n_documento_identificacao: "",
      saldo: 0,
      morada: "...", // Valor padrão conforme backend
      codigoTipoDocumento: 1, // Valor padrão
      provincia: "",
      municipio: "",

      // Novo objeto aninhado
      encarregado: {
        nome: "",
        telefone: "",
        email: "",
        codigo_Profissao: undefined,
        local_Trabalho: "",
        status: 1 // CORRIGIDO: Status ativo como padrão
      }
    }
  });

  // Hooks geográficos
  const geographic = useGeographic();
  const { documentTypes, loading: loadingDocTypes } = useDocumentTypes();

  // Watch para mudanças geográficas
  const watchProvincia = watch("provincia");
  const watchMunicipio = watch("municipio");

  // Hook de profissões
  const { professions, loading: loadingProfessions } = useProfessions();
    
  // Hook de status
  const { status, loading: loadingStatus } = useStatus();

  // Função para consultar o BI
  const handleConsultBI = async () => {
    if (!biNumber.trim()) {
      setBiError("Por favor, digite o número do BI");
      return;
    }

    setBiError("");
    setLoadingBI(true);

    try {
      const data = await BIService.fetchBIDetails(biNumber.trim());
      console.log("Dados do BI recebidos:", data);
      if (data.error) {
        setBiError("Erro ao consultar BI. Verifique o número e tente novamente.");
        return;
      }

      setBiData(data);
      
      // Auto-preencher formulário com os dados do BI
      setValue("nome", data.name || "");
      setValue("pai", data.pai || "");
      setValue("mae", data.mae || "");
      setValue("n_documento_identificacao", biNumber.trim());
      
      // Converter data de nascimento de YYYY-MM-DD para Date
      if (data.data_de_nascimento) {
        setValue("dataNascimento", new Date(data.data_de_nascimento) as any);
      }
      
      if (data.morada) {
        setValue("morada", data.morada);
      }

      // Fechar modal após sucesso
      setTimeout(() => {
        setShowBIModal(false);
      }, 1500);

    } catch (error) {
      console.error("Erro ao buscar detalhes do BI:", error);
      setBiError("Erro ao consultar BI. Tente novamente mais tarde.");
    } finally {
      setLoadingBI(false);
    }
  };

  // Função para pular a consulta do BI
  const handleSkipBI = () => {
    setShowBIModal(false);
    setBiData(null);
  };

  const onSubmit = async (data: AddStudentFormData) => {
    try {
      await createStudent(data as any);
      router.push('/admin/student-management/student');
    } catch (error) {
      console.error("Erro ao criar estudante:", error);
    }
  };

  return (
    <Container>
      {/* Modal de Consulta de BI */}
      <Dialog open={showBIModal} onOpenChange={setShowBIModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Consultar Bilhete de Identidade
            </DialogTitle>
            <DialogDescription>
              Digite o número do BI do aluno para auto-preencher os dados básicos do formulário.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bi-number">Número do BI</Label>
              <div className="flex gap-2">
                <Input
                  id="bi-number"
                  placeholder="Ex: 007537847LA041"
                  value={biNumber}
                  onChange={(e) => {
                    setBiNumber(e.target.value);
                    setBiError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleConsultBI();
                    }
                  }}
                  disabled={loadingBI}
                  className={biError ? "border-red-500" : ""}
                />
                <Button 
                  onClick={handleConsultBI} 
                  disabled={loadingBI || !biNumber.trim()}
                  size="icon"
                >
                  {loadingBI ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {biError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {biError}
                </p>
              )}
            </div>

            {/* Resultado da consulta */}
            {biData && !biData.error && (
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800 space-y-2">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  <span>Dados encontrados!</span>
                </div>
                <div className="text-sm space-y-1 text-green-900 dark:text-green-100">
                  <p><strong>Nome:</strong> {biData.name}</p>
                  <p><strong>Data de Nascimento:</strong> {biData.data_de_nascimento}</p>
                  <p><strong>Pai:</strong> {biData.pai}</p>
                  <p><strong>Mãe:</strong> {biData.mae}</p>
                  {biData.morada && <p><strong>Morada:</strong> {biData.morada}</p>}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  Os dados serão preenchidos automaticamente no formulário.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Você pode pular esta etapa e preencher manualmente.</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleSkipBI}
              disabled={loadingBI}
              className="w-full sm:w-auto"
            >
              Preencher Manualmente
            </Button>
            {biData && !biData.error && (
              <Button
                onClick={() => setShowBIModal(false)}
                className="w-full sm:w-auto"
              >
                Continuar com os Dados
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Formulário Principal */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="w-fit"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                Adicionar Novo Aluno
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Preencha os dados do aluno e do encarregado
              </p>
            </div>
          </div>
          
          {biData && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBIModal(true)}
              className="w-full sm:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Consultar BI Novamente</span>
              <span className="sm:hidden">Consultar BI</span>
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Dados Pessoais</span>
                <span className="sm:hidden">Pessoais</span>
              </TabsTrigger>
              <TabsTrigger value="document" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Documentação</span>
                <span className="sm:hidden">Docs</span>
              </TabsTrigger>
              <TabsTrigger value="guardian" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Encarregado</span>
                <span className="sm:hidden">Resp.</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab: Dados Pessoais */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais do Aluno</CardTitle>
                  <CardDescription>
                    Dados básicos e de contato do estudante
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nome Completo */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="nome"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="nome"
                            placeholder="Digite o nome completo do aluno"
                            className={errors.nome ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.nome && (
                        <p className="text-sm text-red-500">{errors.nome.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Pais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pai">Nome do Pai</Label>
                      <Controller
                        name="pai"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="pai"
                            placeholder="Nome do pai"
                          />
                        )}
                      />
                      {errors.pai && (
                        <p className="text-sm text-red-500">{errors.pai.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mae">Nome da Mãe</Label>
                      <Controller
                        name="mae"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="mae"
                            placeholder="Nome da mãe"
                          />
                        )}
                      />
                      {errors.mae && (
                        <p className="text-sm text-red-500">{errors.mae.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Sexo e Data de Nascimento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sexo">Sexo <span className="text-red-500">*</span></Label>
                      <Controller
                        name="sexo"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.sexo ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione o sexo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="M">Masculino</SelectItem>
                              <SelectItem value="F">Feminino</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.sexo && (
                        <p className="text-sm text-red-500">{errors.sexo.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Controller
                        name="dataNascimento"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="dataNascimento"
                            type="date"
                            value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                            onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                          />
                        )}
                      />
                      {errors.dataNascimento && (
                        <p className="text-sm text-red-500">{errors.dataNascimento.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Contato */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="email"
                            type="email"
                            placeholder="exemplo@email.com"
                          />
                        )}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Controller
                        name="telefone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="telefone"
                            placeholder="923456789"
                          />
                        )}
                      />
                      {errors.telefone && (
                        <p className="text-sm text-red-500">{errors.telefone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Nacionalidade */}
                  <div className="space-y-2">
                    <Label htmlFor="codigo_Nacionalidade">
                      Nacionalidade <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      name="codigo_Nacionalidade"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className={errors.codigo_Nacionalidade ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a nacionalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {geographic.nacionalidades.nacionalidades.map((nac) => (
                              <SelectItem key={nac.codigo} value={nac.codigo.toString()}>
                                {nac.designacao}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.codigo_Nacionalidade && (
                      <p className="text-sm text-red-500">{errors.codigo_Nacionalidade.message}</p>
                    )}
                  </div>

                  {/* Endereço - Província, Município, Comuna */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Endereço</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="provincia">Província</Label>
                        <Controller
                          name="provincia"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {geographic.provincias.provincias.map((prov) => (
                                  <SelectItem key={prov.codigo || prov.designacao} value={(prov.codigo || '').toString()}>
                                    {prov.designacao}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="municipio">Município</Label>
                        <Controller
                          name="municipio"
                          control={control}
                          render={({ field }) => (
                            <Select 
                              onValueChange={field.onChange} 
                              value={field.value}
                              disabled={!watchProvincia}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {geographic.municipios.municipios
                                  .filter(mun => (mun as any).codigo_Provincia?.toString() === watchProvincia)
                                  .map((mun) => (
                                    <SelectItem key={mun.codigo || mun.designacao} value={(mun.codigo || '').toString()}>
                                      {mun.designacao}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="codigo_Comuna">
                          Comuna <span className="text-red-500">*</span>
                        </Label>
                        <Controller
                          name="codigo_Comuna"
                          control={control}
                          render={({ field }) => (
                            <Select 
                              onValueChange={(value) => field.onChange(parseInt(value))} 
                              value={field.value?.toString()}
                              disabled={!watchMunicipio}
                            >
                              <SelectTrigger className={errors.codigo_Comuna ? "border-red-500" : ""}>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                {geographic.comunas.comunas
                                  .filter(com => (com as any).codigo_Municipio?.toString() === watchMunicipio)
                                  .map((com) => (
                                    <SelectItem key={com.codigo || com.designacao} value={(com.codigo || '').toString()}>
                                      {com.designacao}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.codigo_Comuna && (
                          <p className="text-sm text-red-500">{errors.codigo_Comuna.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="morada">Morada Completa</Label>
                      <Controller
                        name="morada"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="morada"
                            placeholder="Rua, número, bairro..."
                          />
                        )}
                      />
                      {errors.morada && (
                        <p className="text-sm text-red-500">{errors.morada.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Documentação */}
            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle>Documentação</CardTitle>
                  <CardDescription>
                    Informações sobre documentos de identificação
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo de Documento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigoTipoDocumento">
                        Tipo de Documento <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="codigoTipoDocumento"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className={errors.codigoTipoDocumento ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentTypes.map((docType) => (
                                <SelectItem key={docType.codigo} value={docType.codigo.toString()}>
                                  {docType.designacao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.codigoTipoDocumento && (
                        <p className="text-sm text-red-500">{errors.codigoTipoDocumento.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="n_documento_identificacao">
                        Número do Documento <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="n_documento_identificacao"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="n_documento_identificacao"
                            placeholder="Ex: 007537847LA041"
                            className={errors.n_documento_identificacao ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.n_documento_identificacao && (
                        <p className="text-sm text-red-500">{errors.n_documento_identificacao.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Informações Financeiras */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações Financeiras</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="saldo">Saldo Inicial</Label>
                        <Controller
                          name="saldo"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="saldo"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="codigo_Utilizador">Código do Utilizador</Label>
                        <Controller
                          name="codigo_Utilizador"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="codigo_Utilizador"
                              placeholder="Será obtido automaticamente"
                              disabled
                            />
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Este campo será preenchido automaticamente com o usuário logado
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Encarregado */}
            <TabsContent value="guardian">
              <Card>
                <CardHeader>
                  <CardTitle>Dados do Encarregado</CardTitle>
                  <CardDescription>
                    Informações do responsável pelo aluno. Será criado automaticamente junto com o aluno.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Novo:</strong> O encarregado será criado automaticamente ao salvar o aluno. 
                      Não é necessário criar o encarregado separadamente.
                    </p>
                  </div>

                  {/* Nome e Telefone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="encarregado.nome">
                        Nome Completo do Encarregado <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="encarregado.nome"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="encarregado.nome"
                            placeholder="Nome completo"
                            className={errors.encarregado?.nome ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.encarregado?.nome && (
                        <p className="text-sm text-red-500">{errors.encarregado.nome.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="encarregado.telefone">
                        Telefone <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="encarregado.telefone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="encarregado.telefone"
                            placeholder="923456789"
                            className={errors.encarregado?.telefone ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.encarregado?.telefone && (
                        <p className="text-sm text-red-500">{errors.encarregado.telefone.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="encarregado.email">Email</Label>
                    <Controller
                      name="encarregado.email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          id="encarregado.email"
                          type="email"
                          placeholder="email@exemplo.com"
                        />
                      )}
                    />
                    {errors.encarregado?.email && (
                      <p className="text-sm text-red-500">{errors.encarregado.email.message}</p>
                    )}
                  </div>

                  {/* Profissão e Local de Trabalho */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="encarregado.codigo_Profissao">
                        Profissão <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="encarregado.codigo_Profissao"
                        control={control}
                        render={({ field }) => (
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className={errors.encarregado?.codigo_Profissao ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione a profissão" />
                            </SelectTrigger>
                            <SelectContent>
                              {professions.map((prof) => (
                                <SelectItem key={prof.codigo} value={prof.codigo.toString()}>
                                  {prof.designacao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.encarregado?.codigo_Profissao && (
                        <p className="text-sm text-red-500">{errors.encarregado.codigo_Profissao.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="encarregado.local_Trabalho">
                        Local de Trabalho <span className="text-red-500">*</span>
                      </Label>
                      <Controller
                        name="encarregado.local_Trabalho"
                        control={control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            id="encarregado.local_Trabalho"
                            placeholder="Ex: Hospital Central"
                            className={errors.encarregado?.local_Trabalho ? "border-red-500" : ""}
                          />
                        )}
                      />
                      {errors.encarregado?.local_Trabalho && (
                        <p className="text-sm text-red-500">{errors.encarregado.local_Trabalho.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="encarregado.status">Status</Label>
                    <Controller
                      name="encarregado.status"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          value={field.value?.toString()}
                          disabled={loadingStatus}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={loadingStatus ? "Carregando..." : "Selecione o status"} />
                          </SelectTrigger>
                          <SelectContent>
                            {status.map((statusItem) => (
                              <SelectItem key={statusItem.codigo} value={statusItem.codigo.toString()}>
                                {statusItem.designacao}
                                {statusItem.tb_tipo_status && (
                                  <span className="text-xs text-muted-foreground ml-2">
                                    ({statusItem.tb_tipo_status.designacao})
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.encarregado?.status && (
                      <p className="text-sm text-red-500">{errors.encarregado.status.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Selecione o status do encarregado
                    </p>
                  </div>

                  {/* Informação sobre o usuário */}
                  <div className="p-4 bg-muted rounded-lg border">
                    <h4 className="font-medium mb-2">Informação Importante</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• O encarregado será vinculado automaticamente ao usuário logado</li>
                      <li>• Todos os campos marcados com <span className="text-red-500">*</span> são obrigatórios</li>
                      <li>• O código do encarregado será gerado automaticamente</li>
                      <li>• Após salvar, o aluno ficará vinculado a este encarregado</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Aluno
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
}