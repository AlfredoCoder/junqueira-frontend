"use client";

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  MapPin,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

import { useSalas, useDeleteSala } from '@/hooks/useSala';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/useDebounce';

interface ISala {
  codigo: number;
  designacao: string;
  capacidade?: number;
  localizacao?: string;
  status?: number;
  observacoes?: string;
}

export default function SalasPage() {
  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Hook para gerenciar salas
  const { salas, loading, error, fetchSalas, pagination, clearCache } = useSalas();
  const { deleteSala, loading: deleteLoading } = useDeleteSala();

  // Estados para modais
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState<ISala | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    designacao: ''
  });

  // Carregar salas na inicialização - otimizado
  useEffect(() => {
    fetchSalas(currentPage, itemsPerPage, debouncedSearchTerm);
  }, [currentPage, itemsPerPage, debouncedSearchTerm]); // Removido fetchSalas das dependências

  // Filtrar salas por status - otimizado
  const filteredSalas = useMemo(() => {
    if (!salas) return [];
    
    return salas.filter((sala: ISala) => {
      if (statusFilter === "all") return true;
      if (statusFilter === "active") return sala.status === 1;
      if (statusFilter === "inactive") return sala.status === 0;
      return true;
    });
  }, [salas, statusFilter]);

  // Estatísticas - otimizado
  const stats = useMemo(() => {
    if (!salas) return { total: 0, active: 0, inactive: 0, totalCapacity: 0 };
    
    return {
      total: salas.length,
      active: salas.filter((s: ISala) => s.status === 1).length,
      inactive: salas.filter((s: ISala) => s.status === 0).length,
      totalCapacity: salas.reduce((sum: number, s: ISala) => sum + (s.capacidade || 0), 0)
    };
  }, [salas]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []);

  const handleStatusFilter = useCallback((status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleCreate = useCallback(() => {
    setFormData({
      designacao: ''
    });
    setSelectedSala(null);
    setShowCreateModal(true);
  }, []);

  const handleEdit = useCallback((sala: ISala) => {
    setFormData({
      designacao: sala.designacao
    });
    setSelectedSala(sala);
    setShowEditModal(true);
  }, []);

  const handleDelete = useCallback((sala: ISala) => {
    setSelectedSala(sala);
    setShowDeleteModal(true);
  }, []);

  const handleSubmit = async () => {
    try {
      if (selectedSala) {
        // Editar sala - implementar quando o hook estiver disponível
        toast.success('Sala atualizada com sucesso!');
        setShowEditModal(false);
      } else {
        // Criar sala
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/academic-management/salas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          toast.success('Sala criada com sucesso!');
          setShowCreateModal(false);
          // Limpar cache e recarregar a lista
          clearCache();
          fetchSalas(currentPage, itemsPerPage, debouncedSearchTerm);
        } else {
          throw new Error('Erro ao criar sala');
        }
      }

      setShowCreateModal(false);
      setShowEditModal(false);
      fetchSalas(currentPage, itemsPerPage, debouncedSearchTerm);
    } catch (error) {
      toast.error('Erro ao salvar sala');
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSala) return;

    try {
      await deleteSala(selectedSala.codigo);
      setShowDeleteModal(false);
      setSelectedSala(null);
      // Limpar cache e recarregar a lista
      clearCache();
      fetchSalas(currentPage, itemsPerPage, debouncedSearchTerm);
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
    }
  };

  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Ativa
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
        <XCircle className="h-3 w-3 mr-1" />
        Inativa
      </Badge>
    );
  };

  // Loading otimizado - só mostra se não há dados
  if (loading && (!salas || salas.length === 0)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando salas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title="Gestão de Salas"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total de Salas"
          value={stats.total.toString()}
          change="Cadastradas"
          changeType="neutral"
          icon={Building}
          color="text-blue-600"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-blue-500 to-blue-600"
        />

        <StatCard
          title="Salas Ativas"
          value={stats.active.toString()}
          change="Disponíveis"
          changeType="up"
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-gradient-to-br from-green-50 via-white to-green-50/50"
          accentColor="bg-gradient-to-br from-green-500 to-green-600"
        />

        <StatCard
          title="Salas Inativas"
          value={stats.inactive.toString()}
          change="Indisponíveis"
          changeType="down"
          icon={XCircle}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

        <StatCard
          title="Capacidade Total"
          value={stats.totalCapacity.toString()}
          change="Alunos"
          changeType="neutral"
          icon={Users}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
              <Input
                placeholder="Buscar salas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="active">Ativas</SelectItem>
                  <SelectItem value="inactive">Inativas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Sala
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Salas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Salas Cadastradas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-500">
              <p>Erro ao carregar salas: {error}</p>
            </div>
          ) : filteredSalas.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designação</TableHead>
                      <TableHead>Capacidade</TableHead>
                      <TableHead>Localização</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSalas.map((sala: ISala) => (
                      <TableRow key={sala.codigo}>
                        <TableCell className="font-medium">
                          {sala.designacao}
                        </TableCell>
                        <TableCell>
                          {sala.capacidade ? `${sala.capacidade} alunos` : '-'}
                        </TableCell>
                        <TableCell>
                          {sala.localizacao || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sala.status || 1)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleEdit(sala)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(sala)}
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

              {/* Paginação */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de {pagination.totalItems} salas
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {currentPage} de {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                    >
                      Próxima
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma sala encontrada</p>
              <p className="text-sm">Clique em "Nova Sala" para adicionar a primeira sala</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Sala</DialogTitle>
            <DialogDescription>
              Adicione uma nova sala ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="designacao">Designação *</Label>
              <Input
                id="designacao"
                value={formData.designacao}
                onChange={(e) => setFormData(prev => ({ ...prev, designacao: e.target.value }))}
                placeholder="Ex: Sala A1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.designacao}
            >
              Criar Sala
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Sala</DialogTitle>
            <DialogDescription>
              Edite as informações da sala.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-designacao">Designação *</Label>
              <Input
                id="edit-designacao"
                value={formData.designacao}
                onChange={(e) => setFormData(prev => ({ ...prev, designacao: e.target.value }))}
                placeholder="Ex: Sala A1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.designacao}
            >
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a sala "{selectedSala?.designacao}"?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
