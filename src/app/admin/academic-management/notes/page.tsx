"use client";

import React, { useCallback, useState } from 'react';
import { 
  useTrimestresOptimized as useTrimestres, 
  useTiposNotaOptimized as useTiposNota, 
  useRelatorioAvaliacaoOptimized as useRelatorioAvaliacao,
  useDeleteTrimestreOptimized as useDeleteTrimestre,
  useDeleteTipoNotaOptimized as useDeleteTipoNota,
  useCreateTrimestreOptimized as useCreateTrimestre,
  useCreateTipoNotaOptimized as useCreateTipoNota
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Plus,
  MoreHorizontal,
  Trash2,
  Award,
  Calendar,
  Loader2,
} from 'lucide-react';

export default function NotesPage() {
  // Hooks da API real para configurações de avaliação
  const { trimestres, loading: trimestresLoading, error: trimestresError } = useTrimestres(1, 100);
  const { tiposNota, loading: tiposNotaLoading, error: tiposNotaError } = useTiposNota(1, 100);
  const { relatorio, loading: relatorioLoading, error: relatorioError } = useRelatorioAvaliacao();
  
  // Hooks para exclusão
  const { deleteTrimestre, loading: deletingTrimestre } = useDeleteTrimestre();
  const { deleteTipoNota, loading: deletingTipoNota } = useDeleteTipoNota();
  
  // Hooks para criação
  const { createTrimestre, loading: creatingTrimestre } = useCreateTrimestre();
  const { createTipoNota, loading: creatingTipoNota } = useCreateTipoNota();
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: number, nome: string, tipo: 'trimestre' | 'tipoNota'} | null>(null);
  
  // Estados para modais de criação
  const [showCreateTrimestreModal, setShowCreateTrimestreModal] = useState(false);
  const [showCreateTipoNotaModal, setShowCreateTipoNotaModal] = useState(false);
  
  // Estados dos formulários
  const [trimestreForm, setTrimestreForm] = useState({
    designacao: ''
  });
  
  const [tipoNotaForm, setTipoNotaForm] = useState({
    designacao: '',
    positivaMinima: '',
    status: 1
  });

  // Estados de loading combinados
  const isLoading = trimestresLoading || tiposNotaLoading || relatorioLoading;

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      if (itemToDelete.tipo === 'trimestre') {
        await deleteTrimestre(itemToDelete.id);
      } else {
        await deleteTipoNota(itemToDelete.id);
      }
      setShowDeleteModal(false);
      setItemToDelete(null);
      // Recarregar dados seria feito aqui se necessário
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

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
      // Recarregar dados seria feito aqui se necessário
    } catch (error) {
      // console.error('Erro ao criar trimestre:', error);
    }
  };

  const handleCancelCreateTrimestre = useCallback(() => {
    setShowCreateTrimestreModal(false);
    setTrimestreForm({ designacao: '' });
  }, []);
  // Funções para gerenciar criação de tipo de nota
  const handleCreateTipoNota = async () => {
    try {
      await createTipoNota({
        designacao: tipoNotaForm.designacao,
        positivaMinima: parseFloat(tipoNotaForm.positivaMinima),
        status: tipoNotaForm.status
      });
      setShowCreateTipoNotaModal(false);
      setTipoNotaForm({ designacao: '', positivaMinima: '', status: 1 });
      // Recarregar dados seria feito aqui se necessário
    } catch (error) {
      console.error('Erro ao criar tipo de nota:', error);
    }
  };

  const handleCancelCreateTipoNota = useCallback(() => {
    setShowCreateTipoNotaModal(false);
    setTipoNotaForm({ designacao: '', positivaMinima: '', status: 1 });
  }, []);
  if (isLoading) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4 loading-spinner"></div>
            <p className="text-gray-600">Carregando configurações de avaliação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header seguindo padrão do Dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
            <div className="space-y-3 ultra-fast-fade">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Gestão de Trimestres Acadêmicos
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Tipos de Avaliação, Notas e Trimestres</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Configure os tipos de avaliação, escalas de notas, trimestres acadêmicos e visualize 
                estatísticas do sistema de avaliação.
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D2B48C]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>


      {/* Stats Cards das Configurações */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Trimestres"
          value={relatorio ? relatorio.resumo.totalTrimestres.toString() : "0"}
          change="Configurados"
          changeType="neutral"
          icon={Calendar}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Tipos de Nota"
          value={relatorio ? relatorio.resumo.totalTiposNota.toString() : "0"}
          change={relatorio ? `${relatorio.resumo.tiposNotaAtivos} Ativos` : "Ativos"}
          changeType="neutral"
          icon={Award}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Tipos Avaliação"
          value={relatorio ? relatorio.resumo.totalTiposAvaliacao.toString() : "0"}
          change="Configurados"
          changeType="neutral"
          icon={Settings}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />

        <StatCard
          title="Tipos Pauta"
          value={relatorio ? relatorio.resumo.totalTiposPauta.toString() : "0"}
          change="Disponíveis"
          changeType="up"
          icon={Activity}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#F5DEB3]"
        />
      </div> */}

      {/* Tabelas de Dados CRUD */}
      <div className="space-y-8 ultra-fast-fade">
        {/* Tabela de Trimestres */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#F9CD1D]" />
              <span>Trimestres Acadêmicos</span>
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
            {trimestres && trimestres.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trimestres.map((trimestre) => (
                      <TableRow key={trimestre.codigo}>
                        <TableCell className="font-medium">
                          {trimestre.designacao || `Trimestre ${trimestre.codigo}`}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled>
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum trimestre encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabela de Tipos de Nota */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-emerald-600" />
              <span>Tipos de Nota</span>
            </CardTitle>
            <Button 
              onClick={() => setShowCreateTipoNotaModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Tipo de Nota
            </Button>
          </CardHeader>
          <CardContent>
            {tiposNota && tiposNota.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designação</TableHead>
                      <TableHead>Nota Mínima</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiposNota.map((tipo) => (
                      <TableRow key={tipo.codigo}>
                        <TableCell className="font-medium">
                          {tipo.designacao || `Tipo ${tipo.codigo}`}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {tipo.positivaMinima || 10}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={tipo.status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {tipo.status === 1 ? 'Ativo' : 'Inativo'}
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
                              <DropdownMenuItem onClick={() => window.location.href = `/admin/academic-management/notes/edit/${tipo.codigo}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
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
              <div className="text-center py-8 text-gray-500">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum tipo de nota encontrado</p>
              </div>
            )}
          </CardContent>
        </Card> */}
      </div>

      {/* Modal de Criação de Trimestre */}
      <Dialog open={showCreateTrimestreModal} onOpenChange={setShowCreateTrimestreModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-[#F9CD1D] rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span>Novo Trimestre</span>
            </DialogTitle>
            <DialogDescription>
              Adicione um novo trimestre acadêmico ao sistema.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 ultra-fast-fade">
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
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90"
            >
              {creatingTrimestre && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin loading-spinner" />
              )}
              Criar Trimestre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Tipo de Nota */}
      <Dialog open={showCreateTipoNotaModal} onOpenChange={setShowCreateTipoNotaModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              <span>Novo Tipo de Nota</span>
            </DialogTitle>
            <DialogDescription>
              Adicione um novo tipo de nota ao sistema de avaliação.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 ultra-fast-fade">
            <div>
              <Label htmlFor="tipo-nota-designacao">Designação *</Label>
              <Input
                id="tipo-nota-designacao"
                value={tipoNotaForm.designacao}
                onChange={(e) => setTipoNotaForm(prev => ({ ...prev, designacao: e.target.value }))}
                placeholder="Ex: Nota Quantitativa"
              />
            </div>
            
            <div>
              <Label htmlFor="tipo-nota-minima">Nota Mínima Positiva</Label>
              <Input
                id="tipo-nota-minima"
                type="number"
                min="0"
                max="20"
                step="0.1"
                value={tipoNotaForm.positivaMinima}
                onChange={(e) => setTipoNotaForm(prev => ({ ...prev, positivaMinima: e.target.value }))}
                placeholder="Ex: 10"
              />
            </div>
            
            <div>
              <Label htmlFor="tipo-nota-status">Status</Label>
              <Select 
                value={tipoNotaForm.status.toString()} 
                onValueChange={(value) => setTipoNotaForm(prev => ({ ...prev, status: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ativo</SelectItem>
                  <SelectItem value="0">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreateTipoNota}>
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateTipoNota}
              disabled={creatingTipoNota || !tipoNotaForm.designacao}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {creatingTipoNota && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin loading-spinner" />
              )}
              Criar Tipo de Nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir {itemToDelete?.nome}?
              <br />
              <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deletingTrimestre || deletingTipoNota}
            >
              {(deletingTrimestre || deletingTipoNota) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin loading-spinner" />
              )}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
