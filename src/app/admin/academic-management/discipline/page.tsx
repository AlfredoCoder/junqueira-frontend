'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen, Plus, MoreHorizontal, Edit, Trash2,
  ChevronLeft, ChevronRight, Search
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';

interface Disciplina {
  codigo: number;
  designacao: string;
  status: string;
  tb_cursos?: {
    designacao: string;
  };
}

interface Curso {
  codigo: number;
  designacao: string;
}

interface Turma {
  codigo: number;
  designacao: string;
  codigo_Classe: number;
  codigo_Curso: number;
  tb_classes?: {
    designacao: string;
  };
  tb_cursos?: {
    designacao: string;
  };
}

interface Classe {
  codigo: number;
  designacao: string;
}

interface GradeCurricular {
  codigo_disciplina: number;
  codigo_Classe: number;
  codigo_Curso: number;
}

interface GradeCurricularItem {
  codigo: number;
  disciplina: {
    codigo: number;
    designacao: string;
  };
}

interface GradeCurricularCompleta {
  curso: string;
  classe: string;
  disciplinas?: GradeCurricularItem[];
}

export default function DisciplinasOptimized() {
  // Estados principais - consolidados
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros - consolidados
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cursoFilter, setCursoFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados do modal - consolidados
  const [showModal, setShowModal] = useState(false);
  const [editingDisciplina, setEditingDisciplina] = useState<Disciplina | null>(null);
  const [formData, setFormData] = useState({
    designacao: '',
    codigoCurso: '',
    status: 'Activo'
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados da grade curricular
  const [showGradeCurricularModal, setShowGradeCurricularModal] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [selectedTurma, setSelectedTurma] = useState<string>('');
  const [selectedDisciplinas, setSelectedDisciplinas] = useState<number[]>([]);
  const [loadingGrade, setLoadingGrade] = useState(false);

  // Estados para listar grades curriculares
  const [showListarGradesModal, setShowListarGradesModal] = useState(false);
  const [gradesCurriculares, setGradesCurriculares] = useState<GradeCurricularCompleta[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [showVisualizarModal, setShowVisualizarModal] = useState(false);
  const [gradeVisualizando, setGradeVisualizando] = useState<GradeCurricularCompleta | null>(null);

  // Carregar dados - otimizado com useCallback
  const carregarDados = useCallback(async () => {
    try {
      setLoading(true);
      
      const [disciplinasRes, cursosRes] = await Promise.all([
        fetch('http://localhost:8000/api/academic-management/disciplinas'),
        fetch('http://localhost:8000/api/academic-management/cursos')
      ]);

      if (disciplinasRes.ok) {
        const disciplinasData = await disciplinasRes.json();
        setDisciplinas(disciplinasData.data || []);
      }

      if (cursosRes.ok) {
        const cursosData = await cursosRes.json();
        setCursos(cursosData.data || []);
      }

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);
  // Carregar dados apenas uma vez
  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // Filtros otimizados com useMemo
  const disciplinasFiltradas = useMemo(() => {
    return disciplinas.filter(disciplina => {
      const matchSearch = disciplina.designacao.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || disciplina.status === statusFilter;
      const matchCurso = cursoFilter === 'all' || disciplina.tb_cursos?.designacao === cursoFilter;
      
      return matchSearch && matchStatus && matchCurso;
    });
  }, [disciplinas, searchTerm, statusFilter, cursoFilter]);

  // Paginação otimizada com useMemo
  const { disciplinasPaginadas, totalPages } = useMemo(() => {
    const total = Math.ceil(disciplinasFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = disciplinasFiltradas.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      disciplinasPaginadas: paginated,
      totalPages: total
    };
  }, [disciplinasFiltradas, currentPage, itemsPerPage]);

  // Estatísticas otimizadas com useMemo
  const stats = useMemo(() => {
    const total = disciplinas.length;
    const ativas = disciplinas.filter(d => d.status === 'Activo').length;
    const inativas = disciplinas.filter(d => d.status === 'Inactivo').length;
    const totalCursos = cursos.length;
    
    return { total, ativas, inativas, totalCursos };
  }, [disciplinas, cursos]);

  // Handlers otimizados
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingDisciplina 
        ? `http://localhost:8000/api/academic-management/disciplinas/${editingDisciplina.codigo}`
        : 'http://localhost:8000/api/academic-management/disciplinas';
      
      const method = editingDisciplina ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          designacao: formData.designacao,
          codigo_Curso: parseInt(formData.codigoCurso),
          status: formData.status
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(editingDisciplina ? 'Disciplina atualizada!' : 'Disciplina criada!');
          setShowModal(false);
          resetForm();
          carregarDados();
        } else {
          setMessage({ type: 'error', text: data.message || 'Erro ao salvar' });
        }
      } else {
        setMessage({ type: 'error', text: 'Erro ao salvar disciplina' });
      }

    } catch (error) {
      console.error('Erro ao salvar:', error);
      setMessage({ type: 'error', text: 'Erro de conexão' });
    }
  }, [editingDisciplina, formData, carregarDados]);

  const handleEdit = useCallback((disciplina: Disciplina) => {
    setEditingDisciplina(disciplina);
    setFormData({
      designacao: disciplina.designacao,
      codigoCurso: disciplina.tb_cursos ? 
        cursos.find(c => c.designacao === disciplina.tb_cursos?.designacao)?.codigo.toString() || '' : '',
      status: disciplina.status
    });
    setShowModal(true);
  }, [cursos]);

  const handleDelete = useCallback(async (disciplina: Disciplina) => {
    if (!confirm(`Tem certeza que deseja excluir a disciplina "${disciplina.designacao}"?`)) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/academic-management/disciplinas/${disciplina.codigo}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Disciplina excluída com sucesso!');
        carregarDados();
      } else {
        const data = await response.json();
        toast.error(data.message || 'Erro ao excluir disciplina');
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro de conexão');
    }
  }, [carregarDados]);

  const resetForm = useCallback(() => {
    setFormData({
      designacao: '',
      codigoCurso: '',
      status: 'Activo'
    });
    setEditingDisciplina(null);
    setMessage(null);
  }, []);
  const openNewModal = useCallback(() => {
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  // Funções da Grade Curricular
  const carregarTurmasEClasses = useCallback(async () => {
    try {
      const [turmasRes, classesRes] = await Promise.all([
        fetch('http://localhost:8000/api/academic-management/turmas'),
        fetch('http://localhost:8000/api/academic-management/classes')
      ]);

      if (turmasRes.ok && classesRes.ok) {
        const turmasData = await turmasRes.json();
        const classesData = await classesRes.json();
        
        if (turmasData.success) setTurmas(turmasData.data);
        if (classesData.success) setClasses(classesData.data);
      }
    } catch (error) {
      console.error('Erro ao carregar turmas e classes:', error);
      toast.error('Erro ao carregar dados');
    }
  }, []);

  const handleDisciplinaToggle = useCallback((disciplinaId: number) => {
    setSelectedDisciplinas(prev => 
      prev.includes(disciplinaId) 
        ? prev.filter(id => id !== disciplinaId)
        : [...prev, disciplinaId]
    );
  }, []);

  const criarGradeCurricular = useCallback(async () => {
    if (!selectedTurma || selectedDisciplinas.length === 0) {
      toast.error('Selecione uma turma e pelo menos uma disciplina');
      return;
    }

    try {
      setLoadingGrade(true);
      
      const response = await fetch('http://localhost:8000/api/academic-management/grade-curricular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          turmaId: parseInt(selectedTurma),
          disciplinas: selectedDisciplinas
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success(data.message);
          setShowGradeCurricularModal(false);
          setSelectedTurma('');
          setSelectedDisciplinas([]);
        } else {
          toast.error(data.message || 'Erro ao criar grade curricular');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Erro ao criar grade curricular');
      }
    } catch (error) {
      console.error('Erro ao criar grade curricular:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoadingGrade(false);
    }
  }, [selectedTurma, selectedDisciplinas]);

  // Funções para listar grades curriculares
  const carregarGradesCurriculares = useCallback(async () => {
    try {
      setLoadingGrades(true);
      const response = await fetch('http://localhost:8000/api/academic-management/grade-curricular');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGradesCurriculares(data.data);
        } else {
          toast.error('Erro ao carregar grades curriculares');
        }
      } else {
        toast.error('Erro ao carregar grades curriculares');
      }
    } catch (error) {
      console.error('Erro ao carregar grades curriculares:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoadingGrades(false);
    }
  }, []);

  const visualizarGrade = useCallback((grade: GradeCurricularCompleta) => {
    setGradeVisualizando(grade);
    setShowVisualizarModal(true);
  }, []);

  const removerGrade = useCallback(async (grade: GradeCurricularCompleta) => {
    const disciplinasCount = grade.disciplinas?.length || 0;
    
    if (disciplinasCount === 0) {
      toast.warning('Esta grade não possui disciplinas para remover');
      return;
    }

    if (!confirm(`Tem certeza que deseja remover a grade curricular de ${grade.classe} - ${grade.curso}? Esta ação removerá todas as ${disciplinasCount} disciplinas da grade.`)) {
      return;
    }

    try {
      // Remover todas as disciplinas da grade
      const promises = grade.disciplinas?.map(disciplina => 
        fetch(`http://localhost:8000/api/academic-management/grade-curricular/${disciplina.codigo}`, {
          method: 'DELETE'
        })
      ) || [];

      const results = await Promise.all(promises);
      const sucessos = results.filter(r => r.ok).length;

      if (sucessos === disciplinasCount) {
        toast.success(`Grade curricular de ${grade.classe} - ${grade.curso} removida com sucesso!`);
        carregarGradesCurriculares(); // Recarregar lista
      } else {
        toast.warning(`Apenas ${sucessos} de ${disciplinasCount} disciplinas foram removidas`);
        carregarGradesCurriculares(); // Recarregar lista
      }
    } catch (error) {
      console.error('Erro ao remover grade curricular:', error);
      toast.error('Erro ao remover grade curricular');
    }
  }, [carregarGradesCurriculares]);

  // Carregar turmas e classes quando abrir o modal
  useEffect(() => {
    if (showGradeCurricularModal) {
      carregarTurmasEClasses();
    }
  }, [showGradeCurricularModal, carregarTurmasEClasses]);

  // Carregar grades curriculares quando abrir o modal
  useEffect(() => {
    if (showListarGradesModal) {
      carregarGradesCurriculares();
    }
  }, [showListarGradesModal, carregarGradesCurriculares]);

  // Reset da página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, cursoFilter]);

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <WelcomeHeader title="Gestão de Disciplinas" />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Disciplinas"
          value={stats.total.toString()}
          icon={BookOpen}
          change="0"
          changeType="up"
          color="text-blue-600"
          bgColor="bg-blue-50"
          accentColor="border-blue-200"
        />
        <StatCard
          title="Disciplinas Ativas"
          value={stats.ativas.toString()}
          icon={BookOpen}
          change="0"
          changeType="up"
          color="text-green-600"
          bgColor="bg-green-50"
          accentColor="border-green-200"
        />
        <StatCard
          title="Disciplinas Inativas"
          value={stats.inativas.toString()}
          icon={BookOpen}
          change="0"
          changeType="up"
          color="text-red-600"
          bgColor="bg-red-50"
          accentColor="border-red-200"
        />
        <StatCard
          title="Total de Cursos"
          value={stats.totalCursos.toString()}
          icon={BookOpen}
          change="0"
          changeType="up"
          color="text-purple-600"
          bgColor="bg-purple-50"
          accentColor="border-purple-200"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome da disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Activo">Ativo</SelectItem>
                  <SelectItem value="Inactivo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Curso</Label>
              <Select value={cursoFilter} onValueChange={setCursoFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cursos</SelectItem>
                  {cursos.map(curso => (
                    <SelectItem key={curso.codigo} value={curso.designacao}>
                      {curso.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-end gap-2">
                <Button onClick={openNewModal} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Disciplina
                </Button>
                <Button onClick={() => setShowGradeCurricularModal(true)} variant="outline" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Criar Grade Curricular
                </Button>
              </div>
              <div className="flex items-end">
                <Button onClick={() => setShowListarGradesModal(true)} variant="secondary" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Listar Grades Curriculares
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disciplinas ({disciplinasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplinasPaginadas.map((disciplina) => (
                    <TableRow key={disciplina.codigo}>
                      <TableCell className="font-medium">
                        {disciplina.designacao}
                      </TableCell>
                      <TableCell>
                        {disciplina.tb_cursos?.designacao || 'Não definido'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={disciplina.status === 'Activo' ? 'default' : 'secondary'}>
                          {disciplina.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(disciplina)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(disciplina)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, disciplinasFiltradas.length)} de {disciplinasFiltradas.length} disciplinas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingDisciplina ? 'Editar Disciplina' : 'Nova Disciplina'}
            </DialogTitle>
          </DialogHeader>
          
          {message && (
            <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
              <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="designacao">Nome da Disciplina *</Label>
              <Input
                id="designacao"
                value={formData.designacao}
                onChange={(e) => handleInputChange('designacao', e.target.value)}
                placeholder="Ex: Matemática"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="codigoCurso">Curso *</Label>
              <Select value={formData.codigoCurso} onValueChange={(value) => handleInputChange('codigoCurso', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos.map(curso => (
                    <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                      {curso.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Ativo</SelectItem>
                  <SelectItem value="Inactivo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {editingDisciplina ? 'Atualizar' : 'Criar'} Disciplina
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal Grade Curricular */}
      <Dialog open={showGradeCurricularModal} onOpenChange={setShowGradeCurricularModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Criar Grade Curricular
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Seleção de Turma */}
            <div>
              <Label>Selecionar Turma *</Label>
              <Select value={selectedTurma} onValueChange={setSelectedTurma}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map(turma => (
                    <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                      {turma.designacao} - {turma.tb_classes?.designacao} ({turma.tb_cursos?.designacao})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seleção de Disciplinas */}
            <div>
              <Label>Selecionar Disciplinas ({selectedDisciplinas.length} selecionadas)</Label>
              <div className="mt-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {disciplinas.map(disciplina => (
                    <div key={disciplina.codigo} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`disciplina-${disciplina.codigo}`}
                        checked={selectedDisciplinas.includes(disciplina.codigo)}
                        onChange={() => handleDisciplinaToggle(disciplina.codigo)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label 
                        htmlFor={`disciplina-${disciplina.codigo}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {disciplina.designacao}
                        {disciplina.tb_cursos && (
                          <span className="text-gray-500 ml-1">
                            ({disciplina.tb_cursos.designacao})
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-600">
                {selectedTurma && selectedDisciplinas.length > 0 && (
                  <span>
                    Será criada grade curricular para {selectedDisciplinas.length} disciplina(s)
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowGradeCurricularModal(false)}
                  disabled={loadingGrade}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={criarGradeCurricular}
                  disabled={loadingGrade || !selectedTurma || selectedDisciplinas.length === 0}
                >
                  {loadingGrade ? 'Criando...' : 'Criar Grade Curricular'}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Listar Grades Curriculares */}
      <Dialog open={showListarGradesModal} onOpenChange={setShowListarGradesModal}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Grades Curriculares
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingGrades ? (
              <div className="flex justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Carregando grades curriculares...</p>
                </div>
              </div>
            ) : gradesCurriculares.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma grade curricular encontrada</p>
                <p className="text-sm text-gray-500">Crie uma grade curricular para começar</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {gradesCurriculares.map((grade, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{grade.classe} - {grade.curso}</h3>
                        <p className="text-gray-600">{grade.disciplinas?.length || 0} disciplina(s)</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => visualizarGrade(grade)}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          Visualizar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removerGrade(grade)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remover
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {grade.disciplinas?.slice(0, 5).map((disciplina) => (
                        <Badge key={disciplina.codigo} variant="secondary">
                          {disciplina.disciplina.designacao}
                        </Badge>
                      )) || []}
                      {(grade.disciplinas?.length || 0) > 5 && (
                        <Badge variant="outline">
                          +{(grade.disciplinas?.length || 0) - 5} mais
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Grade Curricular */}
      <Dialog open={showVisualizarModal} onOpenChange={setShowVisualizarModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {gradeVisualizando && `Grade Curricular - ${gradeVisualizando.classe} (${gradeVisualizando.curso})`}
            </DialogTitle>
          </DialogHeader>
          
          {gradeVisualizando && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Informações da Grade</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Classe:</span> {gradeVisualizando.classe}
                  </div>
                  <div>
                    <span className="font-medium">Curso:</span> {gradeVisualizando.curso}
                  </div>
                  <div>
                    <span className="font-medium">Total de Disciplinas:</span> {gradeVisualizando.disciplinas?.length || 0}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Disciplinas da Grade Curricular</h4>
                <div className="grid gap-2">
                  {gradeVisualizando.disciplinas && gradeVisualizando.disciplinas.length > 0 ? (
                    gradeVisualizando.disciplinas.map((disciplina, index) => (
                      <div key={disciplina.codigo} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {index + 1}
                          </span>
                          <span className="font-medium">{disciplina.disciplina.designacao}</span>
                        </div>
                        <Badge variant="outline">
                          ID: {disciplina.disciplina.codigo}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      Nenhuma disciplina encontrada nesta grade curricular
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => setShowVisualizarModal(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
