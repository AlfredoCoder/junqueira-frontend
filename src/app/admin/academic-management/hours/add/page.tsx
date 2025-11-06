"use client";

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  Clock,
  ArrowLeft,
  Save,
  X,
  Loader2,
  Calendar,
  BookOpen,
  Users,
  MapPin,
} from 'lucide-react';

// Dados mockados para selects
const mockDisciplinas = [
  { id: "1", nome: "Matemática", codigo: "MAT", cargaHoraria: 5 },
  { id: "2", nome: "Física", codigo: "FIS", cargaHoraria: 4 },
  { id: "3", nome: "Química", codigo: "QUI", cargaHoraria: 3 },
  { id: "4", nome: "Biologia", codigo: "BIO", cargaHoraria: 3 },
  { id: "5", nome: "Língua Portuguesa", codigo: "LP", cargaHoraria: 5 },
  { id: "6", nome: "História", codigo: "HIS", cargaHoraria: 3 },
  { id: "7", nome: "Geografia", codigo: "GEO", cargaHoraria: 3 },
  { id: "8", nome: "Informática", codigo: "INF", cargaHoraria: 4 },
];

const mockProfessores = [
  { id: "1", nome: "Prof. João Silva Santos", especialidade: "Matemática" },
  { id: "2", nome: "Prof. Maria Santos Costa", especialidade: "Física" },
  { id: "3", nome: "Prof. Carlos Mendes Lima", especialidade: "Química" },
  { id: "4", nome: "Prof. Ana Paula Francisco", especialidade: "Biologia" },
  { id: "5", nome: "Prof. Pedro Silva Neto", especialidade: "Língua Portuguesa" },
  { id: "6", nome: "Prof. Carla Lima Santos", especialidade: "História" },
];

const mockTurmas = [
  { id: "1", designacao: "IG-10A-2024", classe: "10ª Classe", curso: "Informática de Gestão" },
  { id: "2", designacao: "CG-11B-2024", classe: "11ª Classe", curso: "Contabilidade e Gestão" },
  { id: "3", designacao: "AD-12C-2024", classe: "12ª Classe", curso: "Administração" },
  { id: "4", designacao: "EC-13D-2024", classe: "13ª Classe", curso: "Economia" },
];

const mockSalas = [
  { id: "1", nome: "Sala A1", capacidade: 30, localizacao: "Bloco A" },
  { id: "2", nome: "Sala A2", capacidade: 25, localizacao: "Bloco A" },
  { id: "3", nome: "Sala B1", capacidade: 35, localizacao: "Bloco B" },
  { id: "4", nome: "Lab. Informática", capacidade: 20, localizacao: "Bloco C" },
  { id: "5", nome: "Lab. Ciências", capacidade: 25, localizacao: "Bloco C" },
];

const diasSemana = [
  { value: "segunda", label: "Segunda-feira" },
  { value: "terca", label: "Terça-feira" },
  { value: "quarta", label: "Quarta-feira" },
  { value: "quinta", label: "Quinta-feira" },
  { value: "sexta", label: "Sexta-feira" },
  { value: "sabado", label: "Sábado" },
];

const periodos = [
  { value: "manha", label: "Manhã (07:30 - 12:00)" },
  { value: "tarde", label: "Tarde (13:30 - 18:00)" },
  { value: "noite", label: "Noite (19:00 - 22:30)" },
];

export default function AddHorarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    disciplina: "",
    professor: "",
    turma: "",
    sala: "",
    diaSemana: "",
    horaInicio: "",
    horaFim: "",
    periodo: "",
    observacoes: "",
    status: "Ativo",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCancel = useCallback(() => {
    router.back();
  }, []);
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, []);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.disciplina) {
      newErrors.disciplina = "Disciplina é obrigatória";
    }

    if (!formData.professor) {
      newErrors.professor = "Professor é obrigatório";
    }

    if (!formData.turma) {
      newErrors.turma = "Turma é obrigatória";
    }

    if (!formData.sala) {
      newErrors.sala = "Sala é obrigatória";
    }

    if (!formData.diaSemana) {
      newErrors.diaSemana = "Dia da semana é obrigatório";
    }

    if (!formData.horaInicio) {
      newErrors.horaInicio = "Hora de início é obrigatória";
    }

    if (!formData.horaFim) {
      newErrors.horaFim = "Hora de fim é obrigatória";
    }

    if (!formData.periodo) {
      newErrors.periodo = "Período é obrigatório";
    }

    // Validar se hora de fim é posterior à hora de início
    if (formData.horaInicio && formData.horaFim) {
      if (formData.horaInicio >= formData.horaFim) {
        newErrors.horaFim = "Hora de fim deve ser posterior à hora de início";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Dados do horário:', formData);
      
      // Redirecionar para lista de horários
      router.push('/admin/academic-management/hours');
      
    } catch (error) {
      console.error('Erro ao criar horário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-background border-b shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Novo Horário</h1>
                <p className="text-sm text-muted-foreground">
                  Adicione um novo horário ao sistema acadêmico
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="horario-form"
                disabled={isLoading}
                className="bg-[#3B6C4D] hover:bg-[#8B4513]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin loading-spinner" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Horário
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-6xl mx-auto space-y-8 ultra-fast-fade">
        <form id="horario-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações da Aula */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="w-6 h-6 mr-3 text-blue-500" />
                Informações da Aula
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="disciplina" className="text-foreground font-semibold">
                    Disciplina *
                  </Label>
                  <Select
                    value={formData.disciplina}
                    onValueChange={(value) => handleInputChange('disciplina', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.disciplina ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDisciplinas.map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome} ({disciplina.codigo}) - {disciplina.cargaHoraria}h/sem
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.disciplina && (
                    <p className="text-sm text-red-500">{errors.disciplina}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="professor" className="text-foreground font-semibold">
                    Professor *
                  </Label>
                  <Select
                    value={formData.professor}
                    onValueChange={(value) => handleInputChange('professor', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.professor ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProfessores.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id}>
                          {professor.nome} - {professor.especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.professor && (
                    <p className="text-sm text-red-500">{errors.professor}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="turma" className="text-foreground font-semibold">
                    Turma *
                  </Label>
                  <Select
                    value={formData.turma}
                    onValueChange={(value) => handleInputChange('turma', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.turma ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTurmas.map((turma) => (
                        <SelectItem key={turma.id} value={turma.id}>
                          {turma.designacao} - {turma.classe} ({turma.curso})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.turma && (
                    <p className="text-sm text-red-500">{errors.turma}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="sala" className="text-foreground font-semibold">
                    Sala *
                  </Label>
                  <Select
                    value={formData.sala}
                    onValueChange={(value) => handleInputChange('sala', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.sala ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione a sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSalas.map((sala) => (
                        <SelectItem key={sala.id} value={sala.id}>
                          {sala.nome} - Cap: {sala.capacidade} ({sala.localizacao})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.sala && (
                    <p className="text-sm text-red-500">{errors.sala}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Horário */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Clock className="w-6 h-6 mr-3 text-purple-500" />
                Configuração de Horário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="diaSemana" className="text-foreground font-semibold">
                    Dia da Semana *
                  </Label>
                  <Select
                    value={formData.diaSemana}
                    onValueChange={(value) => handleInputChange('diaSemana', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.diaSemana ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
                        <SelectItem key={dia.value} value={dia.value}>
                          {dia.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.diaSemana && (
                    <p className="text-sm text-red-500">{errors.diaSemana}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="periodo" className="text-foreground font-semibold">
                    Período *
                  </Label>
                  <Select
                    value={formData.periodo}
                    onValueChange={(value) => handleInputChange('periodo', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.periodo ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodos.map((periodo) => (
                        <SelectItem key={periodo.value} value={periodo.value}>
                          {periodo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.periodo && (
                    <p className="text-sm text-red-500">{errors.periodo}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="horaInicio" className="text-foreground font-semibold">
                    Hora de Início *
                  </Label>
                  <Input
                    id="horaInicio"
                    type="time"
                    value={formData.horaInicio}
                    onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                    className={`h-12 ${errors.horaInicio ? 'border-red-500' : ''}`}
                  />
                  {errors.horaInicio && (
                    <p className="text-sm text-red-500">{errors.horaInicio}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="horaFim" className="text-foreground font-semibold">
                    Hora de Fim *
                  </Label>
                  <Input
                    id="horaFim"
                    type="time"
                    value={formData.horaFim}
                    onChange={(e) => handleInputChange('horaFim', e.target.value)}
                    className={`h-12 ${errors.horaFim ? 'border-red-500' : ''}`}
                  />
                  {errors.horaFim && (
                    <p className="text-sm text-red-500">{errors.horaFim}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 ultra-fast-fade">
                <Label htmlFor="status" className="text-foreground font-semibold">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                    <SelectItem value="Suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Calendar className="w-6 h-6 mr-3 text-orange-500" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 ultra-fast-fade">
                <Label htmlFor="observacoes" className="text-foreground font-semibold">
                  Observações Gerais
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Informações adicionais sobre o horário, metodologia específica, recursos necessários, etc..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

        </form>
      </div>
    </div>
  );
}
