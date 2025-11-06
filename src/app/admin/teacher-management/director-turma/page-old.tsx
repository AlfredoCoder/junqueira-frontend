"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useDiretoresTurma, useCreateDiretorTurma, useUpdateDiretorTurma, useDeleteDiretorTurma } from '@/hooks/useDirectorTurma';
import { IDiretorTurma, IDiretorTurmaInput } from '@/types/directorTurma.types';
import { useDocentes } from '@/hooks/useTeacher';
import turmaService from '@/services/turma.service';
import anoLectivoService from '@/services/anoLectivo.service';
import { ConfirmDeleteDiretorTurmaModal } from '@/components/director-turma/confirm-delete-diretor-turma-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  UserCheck,
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Save,
  X,
  Trash2,
} from 'lucide-react';
import { WelcomeHeader } from '@/components/dashboard';

export default function DirectorTurmaPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Hooks da API real
  const { data: directors, pagination, loading, error, refetch } = useDiretoresTurma(
    currentPage,
    itemsPerPage,
    searchTerm
  );
  const { createDiretorTurma, loading: createLoading } = useCreateDiretorTurma();
  const { updateDiretorTurma, loading: updateLoading } = useUpdateDiretorTurma();
  const { deleteDiretorTurma, loading: deleteLoading, error: deleteError } = useDeleteDiretorTurma();

  // Hooks para dados do modal
  const { docentes, loading: docentesLoading } = useDocentes(1, 100); // Carregar todos os professores

  // Estados locais para turmas e anos letivos
  const [turmas, setTurmas] = useState<Array<{ codigo: number; designacao: string }>>([]);
  const [turmasLoading, setTurmasLoading] = useState(false);
  const [anosLectivos, setAnosLectivos] = useState<Array<{ codigo: number; designacao: string }>>([]);
  const [anosLoading, setAnosLoading] = useState(false);

  // Estados para modal de criação/edição
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDirector, setEditingDirector] = useState<IDiretorTurma | null>(null);
  const [formData, setFormData] = useState({
    codigoDocente: "",
    codigoTurma: "",
    codigoAnoLectivo: "",
    designacao: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Estados para modal de exclusão
  const [diretorTurmaToDelete, setDiretorTurmaToDelete] = useState<IDiretorTurma | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteResult, setDeleteResult] = useState<{ success?: boolean; message?: string } | null>(null);


  const handleEditDirector = useCallback((director: IDiretorTurma) => {
    setEditingDirector(director);
    setFormData({
      codigoDocente: director.codigoDocente.toString(),
      codigoTurma: director.codigoTurma.toString(),
      codigoAnoLectivo: director.codigoAnoLectivo.toString(),
      designacao: director.designacao || "",
    });
    setShowCreateModal(true);
  }, []);
  // Handlers para exclusão
  const handleDeleteClick = useCallback((diretorTurma: IDiretorTurma) => {
    setDiretorTurmaToDelete(diretorTurma);
    setDeleteResult(null);
    setDeleteModalOpen(true);
  }, []);
  const handleConfirmDelete = async () => {
    if (!diretorTurmaToDelete?.codigo) return;

    try {
      const result = await deleteDiretorTurma(diretorTurmaToDelete.codigo);
      setDeleteResult(result);
      toast.success('Diretor de turma removido com sucesso!');
      
      setTimeout(() => {
        setDeleteModalOpen(false);
        setDiretorTurmaToDelete(null);
        setDeleteResult(null);
        refetch();
      }, 2000);
    } catch (error) {
      console.error('Erro ao remover diretor de turma:', error);
    }
  };

  const handleCloseDeleteModal = useCallback(() => {
    if (!deleteLoading) {
      setDeleteModalOpen(false);
      setDiretorTurmaToDelete(null);
      setDeleteResult(null);
    }
  }, []);
  // Funções para carregar dados
  const fetchTurmas = async () => {
    try {
      setTurmasLoading(true);
      const response = await turmaService.getTurmas(1, 100, '');
      setTurmas(response.data);
      console.log('Turmas carregadas:', response.data.length);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      setTurmas([]);
    } finally {
      setTurmasLoading(false);
    }
  };

  const fetchAnosLectivos = async () => {
    try {
      setAnosLoading(true);
      const response = await anoLectivoService.getAnosLectivos(1, 100, '');
      setAnosLectivos(response.data);
      console.log('Anos letivos carregados:', response.data.length);
    } catch (error) {
      console.error('Erro ao carregar anos letivos:', error);
      setAnosLectivos([]);
    } finally {
      setAnosLoading(false);
    }
  };

  // useEffect para carregar dados iniciais uma única vez
  useEffect(() => {
    console.log('Carregando dados iniciais do modal...');
    fetchTurmas(); // Carregar todas as turmas
    fetchAnosLectivos(); // Carregar todos os anos letivos
  }, []); // Executar apenas uma vez na montagem do componente

  // Funções do modal de criação/edição
  const handleCreateClick = useCallback(() => {
    setEditingDirector(null);
    setFormData({
      codigoDocente: "",
      codigoTurma: "",
      codigoAnoLectivo: "",
      designacao: "",
    });
    setErrors({});
    setShowCreateModal(true);
  }, []);
  const handleCancelCreate = useCallback(() => {
    setShowCreateModal(false);
    setEditingDirector(null);
    setFormData({
      codigoDocente: "",
      codigoTurma: "",
      codigoAnoLectivo: "",
      designacao: "",
    });
    setErrors({});
  }, []);
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  }, []);
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.codigoDocente) {
      newErrors.codigoDocente = "Professor é obrigatório";
    }

    if (!formData.codigoTurma) {
      newErrors.codigoTurma = "Turma é obrigatória";
    }

    if (!formData.codigoAnoLectivo) {
      newErrors.codigoAnoLectivo = "Ano letivo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const input: IDiretorTurmaInput = {
      codigoDocente: parseInt(formData.codigoDocente),
      codigoTurma: parseInt(formData.codigoTurma),
      codigoAnoLectivo: parseInt(formData.codigoAnoLectivo),
      designacao: formData.designacao || null,
    };

    let result;
    if (editingDirector) {
      // Modo edição
      result = await updateDiretorTurma(editingDirector.codigo, input);
    } else {
      // Modo criação
      result = await createDiretorTurma(input);
    }

    if (result) {
      refetch(); // Recarregar lista
      handleCancelCreate(); // Fechar modal
    }
  };

  // Estados de loading e error
  // Mostrar loader em tela inteira apenas na carga inicial (quando ainda não há dados)
  if (loading && (!directors || directors.length === 0)) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-[#F9CD1D] mx-auto mb-4 loading-spinner" />
            <p className="text-gray-600">Carregando diretores de turma...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={refetch} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ultra-fast-fade">

      <WelcomeHeader
        title="Gestão de Diretores de Turma"
        titleBtnRight='Novo Diretor'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => handleCreateClick()}
        description='Gerencie todos os diretores de turma na instituição.'
      />

      {/* Cards de Estatísticas */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Diretores"
          value={(directors?.length || 0).toString()}
          change="+4.2%"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Turmas Atribuídas"
          value={(directors?.length || 0).toString()}
          change="+2.8%"
          changeType="up"
          icon={GraduationCap}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Ano Letivo Atual"
          value="2024/2025"
          change="Ativo"
          changeType="neutral"
          icon={Calendar}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />

        <StatCard
          title="Atribuições Ativas"
          value={(directors?.length || 0).toString()}
          change="100%"
          changeType="up"
          icon={UserCheck}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div> */}

      {/* Filtros e Busca */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filtros e Busca</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome do professor ou turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Diretores */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Diretores de Turma</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Se já há resultados, mostrar loader inline quando estiver carregando (por exemplo ao pesquisar) */}
          {directors && directors.length > 0 ? (
            <div className="overflow-x-auto">
              {loading && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-[#F9CD1D] mr-2 loading-spinner" />
                  <span className="text-sm text-gray-600">Carregando...</span>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Codigo Ano Letivo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {directors.map((director: IDiretorTurma) => (
                    <TableRow key={director.codigo}>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {director.tb_docente.nome}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {director.tb_turmas.designacao}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600">
                          {director.tb_docente.contacto || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {director.codigoAnoLectivo}
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
                            <DropdownMenuItem
                              onClick={() => handleEditDirector(director)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(director)}
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
          ) : (
            <div className="text-center py-12">
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-[#F9CD1D] mr-3 loading-spinner" />
                  <span className="text-gray-600">Carregando diretores de turma...</span>
                </div>
              ) : (
                <>
                  <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum diretor de turma encontrado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando um novo diretor de turma.'}
                  </p>
                  <Button
                    onClick={handleCreateClick}
                    className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Diretor
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginação */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de{' '}
            {pagination.totalItems} diretores
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm font-medium">
              Página {currentPage} de {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={!pagination.hasNextPage}
            >
              Próximo
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Criação/Edição */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-[#F9CD1D] rounded-full flex items-center justify-center">
                {editingDirector ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <span>{editingDirector ? 'Editar Diretor de Turma' : 'Novo Diretor de Turma'}</span>
            </DialogTitle>
            <DialogDescription>
              {editingDirector
                ? 'Atualize as informações do diretor de turma.'
                : 'Atribua um professor como diretor de uma turma específica.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 ultra-fast-fade">
            {/* Seleção do Professor */}
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="professor" className="text-sm font-medium">
                Professor *
              </Label>
              <Select
                value={formData.codigoDocente}
                onValueChange={(value) => handleInputChange('codigoDocente', value)}
              >
                <SelectTrigger className={`${errors.codigoDocente ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione o professor" />
                </SelectTrigger>
                <SelectContent>
                  {docentesLoading ? (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2 loading-spinner" />
                      Carregando professores...
                    </div>
                  ) : docentes && docentes.length > 0 ? (
                    docentes.map((professor) => (
                      <SelectItem key={professor.codigo} value={professor.codigo.toString()}>
                        {professor.nome} - {professor.tb_especialidade?.designacao || 'N/A'}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      Nenhum professor encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.codigoDocente && (
                <p className="text-sm text-red-500">{errors.codigoDocente}</p>
              )}
            </div>

            {/* Seleção da Turma */}
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="turma" className="text-sm font-medium">
                Turma *
              </Label>
              <Select
                value={formData.codigoTurma}
                onValueChange={(value) => handleInputChange('codigoTurma', value)}
              >
                <SelectTrigger className={`${errors.codigoTurma ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmasLoading ? (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2 loading-spinner" />
                      Carregando turmas...
                    </div>
                  ) : turmas && turmas.length > 0 ? (
                    turmas.map((turma) => (
                      <SelectItem key={turma.codigo} value={turma.codigo.toString()}>
                        {turma.designacao}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      Nenhuma turma encontrada
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.codigoTurma && (
                <p className="text-sm text-red-500">{errors.codigoTurma}</p>
              )}
            </div>

            {/* Seleção do Ano Letivo */}
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="anoLetivo" className="text-sm font-medium">
                Ano Letivo *
              </Label>
              <Select
                value={formData.codigoAnoLectivo}
                onValueChange={(value) => handleInputChange('codigoAnoLectivo', value)}
              >
                <SelectTrigger className={`${errors.codigoAnoLectivo ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione o ano letivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosLoading ? (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      <Loader2 className="w-4 h-4 animate-spin mr-2 loading-spinner" />
                      Carregando anos letivos...
                    </div>
                  ) : anosLectivos && anosLectivos.length > 0 ? (
                    anosLectivos.map((ano) => (
                      <SelectItem key={ano.codigo} value={ano.codigo.toString()}>
                        {ano.designacao}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                      Nenhum ano letivo encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
              {errors.codigoAnoLectivo && (
                <p className="text-sm text-red-500">{errors.codigoAnoLectivo}</p>
              )}
            </div>

            {/* Designação (Opcional) */}
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="designacao" className="text-sm font-medium">
                Designação (Opcional)
              </Label>
              <Textarea
                id="designacao"
                value={formData.designacao}
                onChange={(e) => handleInputChange('designacao', e.target.value)}
                placeholder="Observações ou designação específica para esta atribuição..."
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreate} disabled={createLoading || updateLoading}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleCreateSubmit}
              disabled={createLoading || updateLoading}
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90"
            >
              {(createLoading || updateLoading) ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin loading-spinner" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {(createLoading || updateLoading)
                ? (editingDirector ? 'Atualizando...' : 'Criando...')
                : (editingDirector ? 'Atualizar' : 'Criar Atribuição')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteDiretorTurmaModal
        open={deleteModalOpen}
        onOpenChange={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        diretorTurmaItem={diretorTurmaToDelete}
        loading={deleteLoading}
        error={deleteError}
        deleteResult={deleteResult}
      />

    </div>
  );
}
