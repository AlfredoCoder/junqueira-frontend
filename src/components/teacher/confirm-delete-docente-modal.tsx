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

interface ConfirmDeleteDocenteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  docenteItem: {
    codigo: number;
    nome: string;
    email?: string;
    telefone?: string;
    status?: number;
    tb_especialidade?: { designacao: string };
  } | null;
  loading: boolean;
  error: string | null;
  deleteResult: {
    tipo?: 'cascade_delete' | 'soft_delete' | 'hard_delete';
    detalhes?: Record<string, number | boolean | string>;
    info?: string;
  } | null;
}

export function ConfirmDeleteDocenteModal({
  open,
  onOpenChange,
  onConfirm,
  docenteItem,
  loading,
  error,
  deleteResult,
}: ConfirmDeleteDocenteModalProps) {
  if (!docenteItem) return null;

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
              <span>Docente Excluído com Sucesso</span>
            </DialogTitle>
            <DialogDescription>
              O docente foi excluído permanentemente do sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 ultra-fast-fade">
            {/* Informações do Docente Excluído */}
            {deleteResult.detalhes && (
              <div className="space-y-3 ultra-fast-fade">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {deleteResult.detalhes.docenteNome as string}
                  </h4>
                  <p className="text-sm text-green-700">
                    {deleteResult.info || 'Docente excluído com sucesso'}
                  </p>
                </div>

                {/* Registros Excluídos (Exclusão em Cascata) */}
                {deleteResult.tipo === 'cascade_delete' && (
                  <div className="space-y-2 ultra-fast-fade">
                    <h5 className="font-medium text-xs text-gray-600 uppercase">Registros Excluídos:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {deleteResult.detalhes.disciplinasDocente !== undefined && Number(deleteResult.detalhes.disciplinasDocente) > 0 && (
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span className="text-gray-600">Disciplinas:</span>
                          <span className="font-semibold text-blue-700">
                            {Number(deleteResult.detalhes.disciplinasDocente)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.diretoresTurma !== undefined && Number(deleteResult.detalhes.diretoresTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-amber-50 rounded">
                          <span className="text-gray-600">Direção de Turmas:</span>
                          <span className="font-semibold text-amber-700">
                            {Number(deleteResult.detalhes.diretoresTurma)}
                          </span>
                        </div>
                      )}
                      {deleteResult.detalhes.docenteTurma !== undefined && Number(deleteResult.detalhes.docenteTurma) > 0 && (
                        <div className="flex justify-between p-2 bg-purple-50 rounded">
                          <span className="text-gray-600">Turmas Atribuídas:</span>
                          <span className="font-semibold text-purple-700">
                            {Number(deleteResult.detalhes.docenteTurma)}
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
            <span>Confirmar Exclusão de Docente</span>
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O docente será excluído permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 ultra-fast-fade">
          {/* Informações do Docente */}
          <div className="space-y-2 ultra-fast-fade">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Nome:</span>
              <span className="text-sm font-semibold text-gray-900">{docenteItem.nome}</span>
            </div>
            {docenteItem.email && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">E-mail:</span>
                <span className="text-sm font-semibold text-gray-900">{docenteItem.email}</span>
              </div>
            )}
            {docenteItem.telefone && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Telefone:</span>
                <span className="text-sm font-semibold text-gray-900">{docenteItem.telefone}</span>
              </div>
            )}
            {docenteItem.tb_especialidade && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Especialidade:</span>
                <span className="text-sm font-semibold text-gray-900">{docenteItem.tb_especialidade.designacao}</span>
              </div>
            )}
            {docenteItem.status !== undefined && (
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge
                  variant={docenteItem.status === 1 ? "default" : "secondary"}
                  className={docenteItem.status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                >
                  {docenteItem.status === 1 ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            )}
          </div>

          {/* Alerta */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação irá excluir permanentemente o docente e todas as suas dependências, 
              incluindo atribuições de turmas e avaliações criadas.
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
              'Excluir Docente'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
