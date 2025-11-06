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
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface ConfirmDeleteTurmaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  turmaItem: {
    codigo: number;
    designacao: string;
    status?: string;
    max_Alunos?: number;
    tb_classes?: { designacao: string };
    tb_cursos?: { designacao: string };
    tb_salas?: { designacao: string };
    tb_periodos?: { designacao: string };
  } | null;
  loading: boolean;
  error: string | null;
  deleteResult: {
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null;
}

export function ConfirmDeleteTurmaModal({
  open,
  onOpenChange,
  onConfirm,
  turmaItem,
  loading,
  error,
  deleteResult,
}: ConfirmDeleteTurmaModalProps) {
  if (!turmaItem) return null;

  const handleClose = useCallback(() => {
    if (!loading) {
      onOpenChange(false);
    }
  }, []);
  // Se houver resultado da exclusão, mostrar feedback
  if (deleteResult) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Turma Excluída com Sucesso</span>
            </DialogTitle>
            <DialogDescription>
              A turma foi excluída permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 ultra-fast-fade">
            {/* Informações da Turma Excluída */}
            {deleteResult.detalhes && (
              <div className="space-y-3 ultra-fast-fade">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {deleteResult.detalhes.turmaNome as string}
                  </h4>
                  <p className="text-sm text-green-700">
                    {deleteResult.info || 'Turma excluída com sucesso'}
                  </p>
                </div>

                {/* Registros Excluídos (Exclusão em Cascata) */}
                {deleteResult.tipo === 'cascade_delete' && (
                  <div className="space-y-2 ultra-fast-fade">
                    <h5 className="font-medium text-xs text-gray-600 uppercase">Registros Excluídos:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
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
                      {deleteResult.detalhes.permissoes !== undefined && Number(deleteResult.detalhes.permissoes) > 0 && (
                        <div className="flex justify-between p-2 bg-pink-50 rounded">
                          <span className="text-gray-600">Permissões:</span>
                          <span className="font-semibold text-pink-700">
                            {Number(deleteResult.detalhes.permissoes)}
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
            <span>Confirmar Exclusão de Turma</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. A turma será excluída permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 ultra-fast-fade">
          {/* Informações da Turma */}
          <div className="space-y-2 ultra-fast-fade">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Nome da Turma:</span>
              <span className="text-sm font-semibold text-gray-900">{turmaItem.designacao}</span>
            </div>
            {turmaItem.tb_classes && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Classe:</span>
                <span className="text-sm font-semibold text-gray-900">{turmaItem.tb_classes.designacao}</span>
              </div>
            )}
            {turmaItem.tb_cursos && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Curso:</span>
                <span className="text-sm font-semibold text-gray-900">{turmaItem.tb_cursos.designacao}</span>
              </div>
            )}
            {turmaItem.tb_salas && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Sala:</span>
                <span className="text-sm font-semibold text-gray-900">{turmaItem.tb_salas.designacao}</span>
              </div>
            )}
            {turmaItem.tb_periodos && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Período:</span>
                <span className="text-sm font-semibold text-gray-900">{turmaItem.tb_periodos.designacao}</span>
              </div>
            )}
            {turmaItem.max_Alunos !== undefined && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Capacidade:</span>
                <span className="text-sm font-semibold text-gray-900">{turmaItem.max_Alunos} alunos</span>
              </div>
            )}
            {turmaItem.status && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge
                  variant={turmaItem.status === "Ativo" || turmaItem.status === "Activo" ? "default" : "secondary"}
                  className={turmaItem.status === "Ativo" || turmaItem.status === "Activo" ? "bg-emerald-100 text-emerald-800" : ""}
                >
                  {turmaItem.status}
                </Badge>
              </div>
            )}
          </div>

          {/* Alerta */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação irá excluir permanentemente a turma e todas as suas dependências, 
              incluindo confirmações, serviços, relações com docentes, diretores e permissões.
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            onClick={handleClose}
            variant="outline"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin loading-spinner" />
                Excluindo...
              </>
            ) : (
              'Excluir Turma'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
