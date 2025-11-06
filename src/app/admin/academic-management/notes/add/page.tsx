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
  FileText,
  ArrowLeft,
  Save,
  X,
  Loader2,
  Award,
  BookOpen,
  Users,
  Calendar,
} from 'lucide-react';

// Dados mockados para selects
const mockAlunos = [
  { id: "1", nome: "Ana Silva Santos", numeroEstudante: "2024001", turma: "IG-10A-2024" },
  { id: "2", nome: "Carlos Manuel Ferreira", numeroEstudante: "2024002", turma: "IG-10A-2024" },
  { id: "3", nome: "Beatriz Costa Lima", numeroEstudante: "2024003", turma: "CG-11B-2024" },
  { id: "4", nome: "David Nunes Pereira", numeroEstudante: "2024004", turma: "AD-12C-2024" },
  { id: "5", nome: "Elena Rodrigues Silva", numeroEstudante: "2024005", turma: "EC-13D-2024" },
];

const mockDisciplinas = [
  { id: "1", nome: "Matemática", codigo: "MAT", professor: "Prof. João Silva" },
  { id: "2", nome: "Física", codigo: "FIS", professor: "Prof. Maria Santos" },
  { id: "3", nome: "Química", codigo: "QUI", professor: "Prof. Carlos Mendes" },
  { id: "4", nome: "Biologia", codigo: "BIO", professor: "Prof. Ana Costa" },
  { id: "5", nome: "Língua Portuguesa", codigo: "LP", professor: "Prof. Pedro Silva" },
  { id: "6", nome: "História", codigo: "HIS", professor: "Prof. Carla Lima" },
  { id: "7", nome: "Geografia", codigo: "GEO", professor: "Prof. Paulo Santos" },
  { id: "8", nome: "Informática", codigo: "INF", professor: "Prof. Sofia Neto" },
];

const mockTurmas = [
  { id: "1", designacao: "IG-10A-2024", classe: "10ª Classe", curso: "Informática de Gestão" },
  { id: "2", designacao: "CG-11B-2024", classe: "11ª Classe", curso: "Contabilidade e Gestão" },
  { id: "3", designacao: "AD-12C-2024", classe: "12ª Classe", curso: "Administração" },
  { id: "4", designacao: "EC-13D-2024", classe: "13ª Classe", curso: "Economia" },
];

const trimestres = [
  { value: "1", label: "1º Trimestre" },
  { value: "2", label: "2º Trimestre" },
  { value: "3", label: "3º Trimestre" },
];

const tiposAvaliacao = [
  { value: "prova", label: "Prova" },
  { value: "teste", label: "Teste" },
  { value: "trabalho", label: "Trabalho" },
  { value: "participacao", label: "Participação" },
  { value: "projeto", label: "Projeto" },
];

export default function AddNotaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    aluno: "",
    disciplina: "",
    turma: "",
    trimestre: "",
    tipoAvaliacao: "",
    nota: "",
    notaMaxima: "20",
    dataAvaliacao: "",
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

    if (!formData.aluno) {
      newErrors.aluno = "Aluno é obrigatório";
    }

    if (!formData.disciplina) {
      newErrors.disciplina = "Disciplina é obrigatória";
    }

    if (!formData.turma) {
      newErrors.turma = "Turma é obrigatória";
    }

    if (!formData.trimestre) {
      newErrors.trimestre = "Trimestre é obrigatório";
    }

    if (!formData.tipoAvaliacao) {
      newErrors.tipoAvaliacao = "Tipo de avaliação é obrigatório";
    }

    if (!formData.nota.trim()) {
      newErrors.nota = "Nota é obrigatória";
    } else {
      const nota = parseFloat(formData.nota);
      const notaMaxima = parseFloat(formData.notaMaxima);
      
      if (isNaN(nota)) {
        newErrors.nota = "Nota deve ser um número válido";
      } else if (nota < 0) {
        newErrors.nota = "Nota não pode ser negativa";
      } else if (nota > notaMaxima) {
        newErrors.nota = `Nota não pode ser maior que ${notaMaxima}`;
      }
    }

    if (!formData.dataAvaliacao) {
      newErrors.dataAvaliacao = "Data da avaliação é obrigatória";
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
      
      console.log('Dados da nota:', formData);
      
      // Redirecionar para lista de notas
      router.push('/admin/academic-management/notes');
      
    } catch (error) {
      console.error('Erro ao criar nota:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSituacao = () => {
    if (!formData.nota) return "";
    const nota = parseFloat(formData.nota);
    return nota >= 10 ? "Aprovado" : "Reprovado";
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
                <h1 className="text-2xl font-bold text-foreground">Nova Nota</h1>
                <p className="text-sm text-muted-foreground">
                  Adicione uma nova nota ao sistema acadêmico
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
                form="nota-form"
                disabled={isLoading}
                className="bg-[#3B6C4D] hover:bg-[#8B4513]"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin loading-spinner" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Nota
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-6xl mx-auto space-y-8 ultra-fast-fade">
        <form id="nota-form" onSubmit={handleSubmit} className="space-y-8">
          
          {/* Informações do Aluno */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Users className="w-6 h-6 mr-3 text-blue-500" />
                Informações do Aluno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="aluno" className="text-foreground font-semibold">
                    Aluno *
                  </Label>
                  <Select
                    value={formData.aluno}
                    onValueChange={(value) => handleInputChange('aluno', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.aluno ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAlunos.map((aluno) => (
                        <SelectItem key={aluno.id} value={aluno.id}>
                          {aluno.nome} - Nº {aluno.numeroEstudante} ({aluno.turma})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.aluno && (
                    <p className="text-sm text-red-500">{errors.aluno}</p>
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
              </div>
            </CardContent>
          </Card>

          {/* Informações da Avaliação */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <BookOpen className="w-6 h-6 mr-3 text-purple-500" />
                Informações da Avaliação
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
                          {disciplina.nome} ({disciplina.codigo}) - {disciplina.professor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.disciplina && (
                    <p className="text-sm text-red-500">{errors.disciplina}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="trimestre" className="text-foreground font-semibold">
                    Trimestre *
                  </Label>
                  <Select
                    value={formData.trimestre}
                    onValueChange={(value) => handleInputChange('trimestre', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.trimestre ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o trimestre" />
                    </SelectTrigger>
                    <SelectContent>
                      {trimestres.map((trimestre) => (
                        <SelectItem key={trimestre.value} value={trimestre.value}>
                          {trimestre.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.trimestre && (
                    <p className="text-sm text-red-500">{errors.trimestre}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="tipoAvaliacao" className="text-foreground font-semibold">
                    Tipo de Avaliação *
                  </Label>
                  <Select
                    value={formData.tipoAvaliacao}
                    onValueChange={(value) => handleInputChange('tipoAvaliacao', value)}
                  >
                    <SelectTrigger className={`h-12 ${errors.tipoAvaliacao ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposAvaliacao.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipoAvaliacao && (
                    <p className="text-sm text-red-500">{errors.tipoAvaliacao}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="dataAvaliacao" className="text-foreground font-semibold">
                    Data da Avaliação *
                  </Label>
                  <Input
                    id="dataAvaliacao"
                    type="date"
                    value={formData.dataAvaliacao}
                    onChange={(e) => handleInputChange('dataAvaliacao', e.target.value)}
                    className={`h-12 ${errors.dataAvaliacao ? 'border-red-500' : ''}`}
                  />
                  {errors.dataAvaliacao && (
                    <p className="text-sm text-red-500">{errors.dataAvaliacao}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nota e Avaliação */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Award className="w-6 h-6 mr-3 text-green-500" />
                Nota e Avaliação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="nota" className="text-foreground font-semibold">
                    Nota *
                  </Label>
                  <Input
                    id="nota"
                    type="number"
                    min="0"
                    max={formData.notaMaxima}
                    step="0.1"
                    value={formData.nota}
                    onChange={(e) => handleInputChange('nota', e.target.value)}
                    placeholder="Ex: 15.5"
                    className={`h-12 ${errors.nota ? 'border-red-500' : ''}`}
                  />
                  {errors.nota && (
                    <p className="text-sm text-red-500">{errors.nota}</p>
                  )}
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label htmlFor="notaMaxima" className="text-foreground font-semibold">
                    Nota Máxima
                  </Label>
                  <Input
                    id="notaMaxima"
                    type="number"
                    min="1"
                    max="100"
                    value={formData.notaMaxima}
                    onChange={(e) => handleInputChange('notaMaxima', e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2 ultra-fast-fade">
                  <Label className="text-foreground font-semibold">
                    Situação
                  </Label>
                  <div className="h-12 flex items-center">
                    {formData.nota && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getSituacao() === "Aprovado" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {getSituacao()}
                      </span>
                    )}
                  </div>
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
                    <SelectItem value="Revisão">Em Revisão</SelectItem>
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
                  Observações sobre o Desempenho
                </Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  placeholder="Comentários sobre o desempenho do aluno, pontos fortes, áreas de melhoria, etc..."
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
