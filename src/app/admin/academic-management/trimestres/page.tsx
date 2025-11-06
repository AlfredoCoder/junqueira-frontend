"use client";

import React, { useCallback, useState } from 'react';
import { 
  useTrimestresOptimized as useTrimestres, 
  useDeleteTrimestreOptimized as useDeleteTrimestre,
  useCreateTrimestreOptimized as useCreateTrimestre
} from '@/hooks/useAcademicEvaluationOptimized';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import { toast } from 'react-toastify';

export default function TrimestresPage() {
  // Hooks da API
  const { trimestres, loading: trimestresLoading, error: trimestresError } = useTrimestres();
  
  // Hooks para exclusão e criação
  const { deleteTrimestre, loading: deletingTrimestre } = useDeleteTrimestre();
  const { createTrimestre, loading: creatingTrimestre } = useCreateTrimestre();
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, nome: string} | null>(null);
  
  // Estados para modal de criação
  const [showCreateTrimestreModal, setShowCreateTrimestreModal] = useState(false);
  
  // Estados do formulário
  const [trimestreForm, setTrimestreForm] = useState({
    designacao: ''
  });

  // Estados de loading combinados
  const isLoading = trimestresLoading;

  // Funções para gerenciar exclusão
  const handleDeleteClick = useCallback((trimestre: any) => {
    setItemToDelete({
      id: trimestre.codigo,
      nome: trimestre.designacao
    });
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    try {
      await deleteTrimestre(itemToDelete.id);
      toast.success('Trimestre excluído com sucesso!');
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error('Erro ao excluir trimestre');
    }
  }, [itemToDelete, deleteTrimestre]);

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  }, []);

  // Funções para gerenciar criação de trimestre
  const handleCreateTrimestre = async () => {
    try {
      await createTrimestre({
        designacao: trimestreForm.designacao
      });
      setShowCreateTrimestreModal(false);
      setTrimestreForm({ designacao: '' });
      toast.success('Trimestre criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar trimestre');
    }
  };

  const handleCancelCreateTrimestre = useCallback(() => {
    setShowCreateTrimestreModal(false);
    setTrimestreForm({ designacao: '' });
  }, []);

  // Estatísticas dos trimestres
  const stats = {
    total: trimestres?.length || 0,
    active: trimestres?.length || 0,
    inactive: 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-gray-600">Carregando trimestres...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader 
        title="Gestão de Trimestres"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total de Trimestres"
          value={stats.total}
          icon={Calendar}
          description="Trimestres cadastrados"
        />
        <StatCard
          title="Trimestres Ativos"
          value={stats.active}
          icon={Calendar}
          description="Em uso no sistema"
        />
        <StatCard
          title="Trimestres Inativos"
          value={stats.inactive}
          icon={Calendar}
          description="Não utilizados"
        />
      </div>

      {/* Tabela de Trimestres */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Lista de Trimestres</span>
          </CardTitle>
          <Button 
            onClick={() => setShowCreateTrimestreModal(true)}
            className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Trimestre
          </Button>
        </CardHeader>
        <CardContent>
          {trimestresError ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Erro ao carregar trimestres: {trimestresError}</span>
            </div>
          ) : trimestres && trimestres.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Designação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trimestres.map((trimestre: any) => (
                  <TableRow key={trimestre.codigo}>
                    <TableCell className="font-medium">
                      {trimestre.codigo}
                    </TableCell>
                    <TableCell>
                      {trimestre.designacao}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                        Ativo
                      </Badge>
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
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteClick(trimestre)}
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum trimestre encontrado</p>
              <p className="text-sm">Clique em "Novo Trimestre" para adicionar o primeiro trimestre</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o trimestre "{itemToDelete?.nome}"?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deletingTrimestre}
            >
              {deletingTrimestre && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Trimestre */}
      <Dialog open={showCreateTrimestreModal} onOpenChange={setShowCreateTrimestreModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-[#F9CD1D]" />
              <span>Novo Trimestre</span>
            </DialogTitle>
            <DialogDescription>
              Adicione um novo trimestre ao sistema acadêmico.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="trimestre-designacao">Designação *</Label>
              <Input
                id="trimestre-designacao"
                value={trimestreForm.designacao}
                onChange={(e) => setTrimestreForm(prev => ({ ...prev, designacao: e.target.value }))}
                placeholder="Ex: 1º Trimestre 2024"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreateTrimestre}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateTrimestre}
              disabled={creatingTrimestre || !trimestreForm.designacao}
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-black"
            >
              {creatingTrimestre && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar Trimestre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
