'use client';

import React, { useState, useEffect } from 'react';
import ProfessoresService from '@/services/professores.service';
import { 
  IProfessor, 
  IProfessorInput,
  IAtribuicaoDisciplinaInput,
  IAtribuicaoTurmaInput,
  IDisciplinaBasica,
  ICursoBasico,
  ITurmaBasica
} from '@/types/professores.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  UserPlus, 
  BookOpen, 
  Users, 
  Mail, 
  Phone, 
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Usando tipos do arquivo de tipos - removendo interfaces duplicadas

export default function ProfessoresPage() {
  // Estados
  const [professores, setProfessores] = useState<IProfessor[]>([]);
  const [disciplinas, setDisciplinas] = useState<IDisciplinaBasica[]>([]);
  const [cursos, setCursos] = useState<ICursoBasico[]>([]);
  const [turmas, setTurmas] = useState<ITurmaBasica[]>([]);
  const [professorSelecionado, setProfessorSelecionado] = useState<IProfessor | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTipo, setModalTipo] = useState<'criar' | 'editar' | 'visualizar' | 'atribuir'>('criar');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Activo');
  const [loading, setLoading] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  
  // Estados do formulário
  const [formData, setFormData] = useState<IProfessorInput>({
    nome: '',
    email: '',
    telefone: '',
    formacao: '',
    nivelAcademico: '',
    especialidade: '',
    numeroFuncionario: '',
    dataAdmissao: ''
  });

  // Estados de atribuição
  const [atribuicaoData, setAtribuicaoData] = useState({
    disciplinaId: '',
    cursoId: '',
    turmaId: '',
    anoLectivo: '2024'
  });

  // Carregar dados iniciais
  useEffect(() => {
    carregarProfessores();
    carregarDisciplinas();
    carregarCursos();
    carregarTurmas();
  }, []);

  const carregarProfessores = async () => {
    try {
      setLoading(true);
      const response = await ProfessoresService.listar({ 
        search: busca, 
        status: filtroStatus as 'Activo' | 'Inactivo' 
      });
      
      if (response.success) {
        setProfessores(response.data);
      } else {
        setErro('Erro ao carregar professores');
      }
    } catch (error) {
      setErro('Erro de conexão ao carregar professores');
    } finally {
      setLoading(false);
    }
  };

  const carregarDisciplinas = async () => {
    try {
      // Dados fictícios para demonstração - em produção, usar API real
      const disciplinasFicticias: IDisciplinaBasica[] = [
        { codigo: 1, designacao: 'Matemática' },
        { codigo: 2, designacao: 'Português' },
        { codigo: 3, designacao: 'Física' },
        { codigo: 4, designacao: 'Química' },
        { codigo: 5, designacao: 'História' }
      ];
      setDisciplinas(disciplinasFicticias);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  };

  const carregarCursos = async () => {
    try {
      // Dados fictícios para demonstração - em produção, usar API real
      const cursosFicticios: ICursoBasico[] = [
        { codigo: 1, designacao: 'I Ciclo do Ensino Secundário' },
        { codigo: 2, designacao: 'II Ciclo do Ensino Secundário' },
        { codigo: 3, designacao: 'Ensino Técnico' }
      ];
      setCursos(cursosFicticios);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
    }
  };

  const carregarTurmas = async () => {
    try {
      // Dados fictícios para demonstração - em produção, usar API real
      const turmasFicticias: ITurmaBasica[] = [
        { codigo: 1, designacao: 'Turma 1', tb_classes: { designacao: '7ª Classe' } },
        { codigo: 2, designacao: 'Turma 2', tb_classes: { designacao: '8ª Classe' } },
        { codigo: 3, designacao: 'Turma 3', tb_classes: { designacao: '9ª Classe' } }
      ];
      setTurmas(turmasFicticias);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    }
  };

  const abrirModal = (tipo: 'criar' | 'editar' | 'visualizar' | 'atribuir', professor?: IProfessor) => {
    setModalTipo(tipo);
    setProfessorSelecionado(professor || null);
    
    if (tipo === 'editar' && professor) {
      setFormData({
        nome: professor.nome,
        email: professor.email,
        telefone: professor.telefone || '',
        formacao: professor.formacao,
        nivelAcademico: professor.nivelAcademico,
        especialidade: professor.especialidade || '',
        numeroFuncionario: professor.numeroFuncionario || '',
        dataAdmissao: professor.dataAdmissao ? professor.dataAdmissao.split('T')[0] : ''
      });
    } else if (tipo === 'criar') {
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        formacao: '',
        nivelAcademico: '',
        especialidade: '',
        numeroFuncionario: '',
        dataAdmissao: ''
      });
    }
    
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setProfessorSelecionado(null);
    setErro('');
    setSucesso('');
  };

  const salvarProfessor = async () => {
    try {
      setSalvando(true);
      setErro('');

      let response;
      if (modalTipo === 'editar' && professorSelecionado) {
        response = await ProfessoresService.atualizar(professorSelecionado.codigo, formData);
      } else {
        response = await ProfessoresService.criar(formData);
      }

      if (response.success) {
        setSucesso('Professor salvo com sucesso!');
        await carregarProfessores();
        setTimeout(() => {
          fecharModal();
        }, 1500);
      } else {
        setErro('Erro ao salvar professor');
      }
    } catch (error) {
      setErro('Erro de conexão ao salvar professor');
    } finally {
      setSalvando(false);
    }
  };

  const atribuirDisciplina = async () => {
    if (!professorSelecionado || !atribuicaoData.disciplinaId || !atribuicaoData.cursoId) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSalvando(true);
      setErro('');

      const response = await ProfessoresService.atribuirDisciplina(
        professorSelecionado.codigo,
        {
          disciplinaId: parseInt(atribuicaoData.disciplinaId),
          cursoId: parseInt(atribuicaoData.cursoId),
          anoLectivo: atribuicaoData.anoLectivo
        }
      );

      if (response.success) {
        setSucesso('Disciplina atribuída com sucesso!');
        await carregarProfessores();
        setTimeout(() => {
          fecharModal();
        }, 1500);
      } else {
        setErro('Erro ao atribuir disciplina');
      }
    } catch (error) {
      setErro('Erro de conexão ao atribuir disciplina');
    } finally {
      setSalvando(false);
    }
  };

  const atribuirTurma = async () => {
    if (!professorSelecionado || !atribuicaoData.turmaId || !atribuicaoData.disciplinaId) {
      setErro('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setSalvando(true);
      setErro('');

      const response = await ProfessoresService.atribuirTurma(
        professorSelecionado.codigo,
        {
          turmaId: parseInt(atribuicaoData.turmaId),
          disciplinaId: parseInt(atribuicaoData.disciplinaId),
          anoLectivo: atribuicaoData.anoLectivo
        }
      );

      if (response.success) {
        setSucesso('Turma atribuída com sucesso!');
        await carregarProfessores();
        setTimeout(() => {
          fecharModal();
        }, 1500);
      } else {
        setErro('Erro ao atribuir turma');
      }
    } catch (error) {
      setErro('Erro de conexão ao atribuir turma');
    } finally {
      setSalvando(false);
    }
  };

  // Filtrar professores
  const professoresFiltrados = professores.filter(professor => {
    const nomeMatch = professor.nome.toLowerCase().includes(busca.toLowerCase());
    const emailMatch = professor.email.toLowerCase().includes(busca.toLowerCase());
    const formacaoMatch = professor.formacao.toLowerCase().includes(busca.toLowerCase());
    const statusMatch = !filtroStatus || professor.status === filtroStatus;
    
    return (nomeMatch || emailMatch || formacaoMatch) && statusMatch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Professores</h1>
          <p className="text-gray-600 mt-2">Cadastro e gestão do corpo docente</p>
        </div>
        
        <Button onClick={() => abrirModal('criar')} className="bg-[#8B4513] hover:bg-[#A0522D]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Professor
        </Button>
      </div>

      {/* Alertas */}
      {erro && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}

      {sucesso && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{sucesso}</AlertDescription>
        </Alert>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, email ou formação..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Activo">Ativo</SelectItem>
                <SelectItem value="Inactivo">Inativo</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={carregarProfessores} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Carregando...' : 'Buscar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Professores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-[#8B4513]" />
            Professores Cadastrados ({professoresFiltrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Formação</TableHead>
                  <TableHead>Nível Acadêmico</TableHead>
                  <TableHead>Disciplinas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professoresFiltrados.map((professor) => (
                  <TableRow key={professor.codigo}>
                    <TableCell className="font-medium">{professor.nome}</TableCell>
                    <TableCell>{professor.email}</TableCell>
                    <TableCell>{professor.formacao}</TableCell>
                    <TableCell>{professor.nivelAcademico}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professor.tb_professor_disciplina?.slice(0, 2).map((pd, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {pd.tb_disciplinas?.designacao || `Disciplina ${pd.codigo_Disciplina}`}
                          </Badge>
                        ))}
                        {(professor.tb_professor_disciplina?.length || 0) > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{(professor.tb_professor_disciplina?.length || 0) - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={professor.status === 'Activo' ? 'default' : 'secondary'}>
                        {professor.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirModal('visualizar', professor)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirModal('editar', professor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => abrirModal('atribuir', professor)}
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {professoresFiltrados.length === 0 && (
            <p className="text-center text-gray-500 py-4">Nenhum professor encontrado</p>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {modalTipo === 'criar' && 'Novo Professor'}
              {modalTipo === 'editar' && 'Editar Professor'}
              {modalTipo === 'visualizar' && 'Detalhes do Professor'}
              {modalTipo === 'atribuir' && 'Atribuir Disciplinas/Turmas'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 ultra-fast-fade">
            {/* Alertas do modal */}
            {erro && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            {sucesso && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{sucesso}</AlertDescription>
              </Alert>
            )}

            {/* Formulário de Professor */}
            {(modalTipo === 'criar' || modalTipo === 'editar' || modalTipo === 'visualizar') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="Nome completo do professor"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="email@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="(+244) 900 000 000"
                  />
                </div>

                <div>
                  <Label htmlFor="numeroFuncionario">Número de Funcionário</Label>
                  <Input
                    id="numeroFuncionario"
                    value={formData.numeroFuncionario}
                    onChange={(e) => setFormData({...formData, numeroFuncionario: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="Número de funcionário"
                  />
                </div>

                <div>
                  <Label htmlFor="formacao">Formação *</Label>
                  <Input
                    id="formacao"
                    value={formData.formacao}
                    onChange={(e) => setFormData({...formData, formacao: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="Ex: Licenciatura em Matemática"
                  />
                </div>

                <div>
                  <Label htmlFor="nivelAcademico">Nível Acadêmico *</Label>
                  <Select 
                    value={formData.nivelAcademico} 
                    onValueChange={(value) => setFormData({...formData, nivelAcademico: value})}
                    disabled={modalTipo === 'visualizar'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bacharel">Bacharel</SelectItem>
                      <SelectItem value="Licenciado">Licenciado</SelectItem>
                      <SelectItem value="Mestre">Mestre</SelectItem>
                      <SelectItem value="Doutor">Doutor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Input
                    id="especialidade"
                    value={formData.especialidade}
                    onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                    placeholder="Área de especialização"
                  />
                </div>

                <div>
                  <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                  <Input
                    id="dataAdmissao"
                    type="date"
                    value={formData.dataAdmissao}
                    onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                    disabled={modalTipo === 'visualizar'}
                  />
                </div>
              </div>
            )}

            {/* Formulário de Atribuição */}
            {modalTipo === 'atribuir' && professorSelecionado && (
              <div className="space-y-6 ultra-fast-fade">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Atribuir para: {professorSelecionado.nome}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="anoLectivo">Ano Letivo</Label>
                      <Input
                        id="anoLectivo"
                        value={atribuicaoData.anoLectivo}
                        onChange={(e) => setAtribuicaoData({...atribuicaoData, anoLectivo: e.target.value})}
                        placeholder="2024"
                      />
                    </div>

                    <div>
                      <Label htmlFor="disciplina">Disciplina</Label>
                      <Select 
                        value={atribuicaoData.disciplinaId} 
                        onValueChange={(value) => setAtribuicaoData({...atribuicaoData, disciplinaId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a disciplina" />
                        </SelectTrigger>
                        <SelectContent>
                          {disciplinas.map((disciplina) => (
                            <SelectItem key={disciplina.codigo} value={disciplina.codigo.toString()}>
                              {disciplina.designacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="curso">Curso</Label>
                      <Select 
                        value={atribuicaoData.cursoId} 
                        onValueChange={(value) => setAtribuicaoData({...atribuicaoData, cursoId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {cursos.map((curso) => (
                            <SelectItem key={curso.codigo} value={curso.codigo.toString()}>
                              {curso.designacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="turma">Turma (opcional)</Label>
                      <Select 
                        value={atribuicaoData.turmaId} 
                        onValueChange={(value) => setAtribuicaoData({...atribuicaoData, turmaId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a turma" />
                        </SelectTrigger>
                        <SelectContent>
                          {turmas.map((turma) => (
                            <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                              {turma.designacao} - {turma.tb_classes?.designacao || 'Classe'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={atribuirDisciplina} 
                      disabled={salvando || !atribuicaoData.disciplinaId || !atribuicaoData.cursoId}
                      className="bg-[#8B4513] hover:bg-[#A0522D]"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {salvando ? 'Salvando...' : 'Atribuir Disciplina'}
                    </Button>
                    
                    {atribuicaoData.turmaId && (
                      <Button 
                        onClick={atribuirTurma} 
                        disabled={salvando || !atribuicaoData.disciplinaId || !atribuicaoData.turmaId}
                        variant="outline"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        {salvando ? 'Salvando...' : 'Atribuir Turma'}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Disciplinas e Turmas Atuais */}
                {professorSelecionado.tb_professor_disciplina && professorSelecionado.tb_professor_disciplina.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Disciplinas Atribuídas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {professorSelecionado.tb_professor_disciplina.map((pd, index) => (
                        <Badge key={index} variant="outline">
                          {pd.tb_disciplinas?.designacao || `Disciplina ${pd.codigo_Disciplina}`} - {pd.tb_cursos?.designacao || `Curso ${pd.codigo_Curso}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {professorSelecionado.tb_professor_turma && professorSelecionado.tb_professor_turma.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Turmas Atribuídas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {professorSelecionado.tb_professor_turma.map((pt, index) => (
                        <Badge key={index} variant="outline">
                          {pt.tb_turmas?.designacao || `Turma ${pt.codigo_Turma}`} - {pt.tb_disciplinas?.designacao || `Disciplina ${pt.codigo_Disciplina}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Botões */}
            {(modalTipo === 'criar' || modalTipo === 'editar') && (
              <div className="flex gap-2 pt-4">
                <Button onClick={fecharModal} variant="outline">
                  Cancelar
                </Button>
                <Button 
                  onClick={salvarProfessor} 
                  disabled={salvando || !formData.nome || !formData.email || !formData.formacao || !formData.nivelAcademico}
                  className="bg-[#8B4513] hover:bg-[#A0522D]"
                >
                  {salvando ? 'Salvando...' : modalTipo === 'criar' ? 'Criar Professor' : 'Salvar Alterações'}
                </Button>
              </div>
            )}

            {modalTipo === 'visualizar' && (
              <div className="flex gap-2 pt-4">
                <Button onClick={fecharModal} variant="outline">
                  Fechar
                </Button>
                <Button onClick={() => abrirModal('editar', professorSelecionado!)} className="bg-[#8B4513] hover:bg-[#A0522D]">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            )}

            {modalTipo === 'atribuir' && (
              <div className="flex gap-2 pt-4">
                <Button onClick={fecharModal} variant="outline">
                  Fechar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
