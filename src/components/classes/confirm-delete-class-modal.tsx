"use client";

import React, { useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Loader2, XCircle } from 'lucide-react';

interface ConfirmDeleteClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  classItem: {
    codigo: number;
    designacao: string;
    status: number;
    notaMaxima?: number;
    exame?: boolean;
  } | null;
  loading: boolean;
  error: string | null;
  deleteResult: {
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null;
}

export function ConfirmDeleteClassModal({
  open,
  onOpenChange,
  onConfirm,
  classItem,
  loading,
  error,
  deleteResult,
}: ConfirmDeleteClassModalProps) {
  if (!classItem) return null;

  const handleClose = useCallback(() => {
    if (!loading) {
      onOpenChange(false);
    }
  }, []);
  // Se já temos o resultado, mostrar tela de sucesso
  if (deleteResult) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Classe Excluída com Sucesso!</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4 ultra-fast-fade">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {deleteResult.info || 'A classe foi excluída com sucesso.'}
              </AlertDescription>
            </Alert>

            {/* Detalhes da Exclusão */}
            {deleteResult.detalhes && Object.keys(deleteResult.detalhes).length > 0 && (
              <div className="space-y-3 ultra-fast-fade">
                <h4 className="font-semibold text-sm text-gray-700">Detalhes da Exclusão:</h4>
                
                {/* Nome da Classe */}
                {deleteResult.detalhes.classeNome && (
                  <div className="col-span-2 flex justify-between p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Classe:</span>
                    <span className="font-semibold text-gray-900">
                      {String(deleteResult.detalhes.classeNome)}
                    </span>
                  </div>
                )}

                {/* Tipo de Exclusão */}
                {deleteResult.tipo && (
                  <div className="col-span-2 flex justify-between p-2 bg-blue-50 rounded">
                    <span className="text-gray-600">Tipo de Exclusão:</span>
                    <span className="font-semibold text-blue-900">
                      {deleteResult.tipo === 'cascade_delete' && 'Exclusão em Cascata'}
                      {deleteResult.tipo === 'soft_delete' && 'Exclusão Lógica'}
                      {deleteResult.tipo === 'hard_delete' && 'Exclusão Permanente'}
                    </span>
                  </div>
                )}

                {/* Registros Excluídos (Exclusão em Cascata) */}
                {deleteResult.tipo === 'cascade_delete' && (
                  <div className="space-y-2 ultra-fast-fade">
                    <h5 className="font-medium text-xs text-gray-600 uppercase">Registros Excluídos:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {deleteResult.detalhes.turmas !== undefined && (
                        <div className="flex justify-between p-2 bg-red-50 rounded">
                          <span className="text-gray-600">Turmas:</span>
                          <span className="font-semibold text-red-700">
                            {Number(deleteResult.detalhes.turmas)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.gradeCurricular !== undefined && (
                        <div className="flex justify-between p-2 bg-orange-50 rounded">
                          <span className="text-gray-600">Grade Curricular:</span>
                          <span className="font-semibold text-orange-700">
                            {Number(deleteResult.detalhes.gradeCurricular)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.confirmacoes !== undefined && Number(deleteResult.detalhes.confirmacoes) > 0 && (
                        <div className="flex justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-gray-600">Confirmações:</span>
                          <span className="font-semibold text-yellow-700">
                            {Number(deleteResult.detalhes.confirmacoes)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.servicos !== undefined && Number(deleteResult.detalhes.servicos) > 0 && (
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span className="text-gray-600">Serviços Aluno:</span>
                          <span className="font-semibold text-blue-700">
                            {Number(deleteResult.detalhes.servicos)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.docenteTurma !== undefined && Number(deleteResult.detalhes.docenteTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-purple-50 rounded">
                          <span className="text-gray-600">Docentes:</span>
                          <span className="font-semibold text-purple-700">
                            {Number(deleteResult.detalhes.docenteTurma)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.servicosTurma !== undefined && Number(deleteResult.detalhes.servicosTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-cyan-50 rounded">
                          <span className="text-gray-600">Serviços Turma:</span>
                          <span className="font-semibold text-cyan-700">
                            {Number(deleteResult.detalhes.servicosTurma)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.diretoresTurma !== undefined && Number(deleteResult.detalhes.diretoresTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-indigo-50 rounded">
                          <span className="text-gray-600">Diretores Turma:</span>
                          <span className="font-semibold text-indigo-700">
                            {Number(deleteResult.detalhes.diretoresTurma)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.diretoresTurma !== undefined && Number(deleteResult.detalhes.diretoresTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-indigo-50 rounded">
                          <span className="text-gray-600">Diretores Turma:</span>
                          <span className="font-semibold text-indigo-700">
                            {Number(deleteResult.detalhes.diretoresTurma)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.propinaClasse !== undefined && Number(deleteResult.detalhes.propinaClasse) > 0 && (
                        <div className="flex justify-between p-2 bg-emerald-50 rounded">
                          <span className="text-gray-600">Propinas Classe:</span>
                          <span className="font-semibold text-emerald-700">
                            {Number(deleteResult.detalhes.propinaClasse)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.limitePagamento !== undefined && Number(deleteResult.detalhes.limitePagamento) > 0 && (
                        <div className="flex justify-between p-2 bg-pink-50 rounded">
                          <span className="text-gray-600">Limites Pagamento:</span>
                          <span className="font-semibold text-pink-700">
                            {Number(deleteResult.detalhes.limitePagamento)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.mesesClasse !== undefined && Number(deleteResult.detalhes.mesesClasse) > 0 && (
                        <div className="flex justify-between p-2 bg-teal-50 rounded">
                          <span className="text-gray-600">Meses Classe:</span>
                          <span className="font-semibold text-teal-700">
                            {Number(deleteResult.detalhes.mesesClasse)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleClose} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Confirmar Exclusão de Classe</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A classe será excluída permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 ultra-fast-fade">
          {/* Informações da Classe */}
          <div className="space-y-2 ultra-fast-fade">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Nome da Classe:</span>
              <span className="text-sm font-semibold text-gray-900">{classItem.designacao}</span>
            </div>
            {classItem.notaMaxima !== undefined && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Nota Máxima:</span>
                <span className="text-sm font-semibold text-gray-900">{classItem.notaMaxima}</span>
              </div>
            )}
            {classItem.exame !== undefined && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Exame:</span>
                <span className="text-sm font-semibold text-gray-900">{classItem.exame ? 'Sim' : 'Não'}</span>
              </div>
            )}
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`text-sm font-semibold ${classItem.status === 1 ? 'text-green-600' : 'text-gray-600'}`}>
                {classItem.status === 1 ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>

          {/* Aviso sobre Exclusão em Cascata */}
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Exclusão em Cascata!</strong> Ao excluir esta classe, todos os dados associados serão removidos permanentemente,
              incluindo turmas, grades curriculares e confirmações relacionadas.
            </AlertDescription>
          </Alert>

          {/* Aviso de Exclusão Permanente */}
          <Alert className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Atenção!</strong> Esta ação não pode ser desfeita e removerá permanentemente a classe e todos os seus dados relacionados do sistema.
            </AlertDescription>
          </Alert>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin loading-spinner" />
                Excluindo...
              </>
            ) : (
              'Confirmar Exclusão'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
