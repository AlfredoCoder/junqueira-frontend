"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { IDiretorTurma } from '@/types/directorTurma.types';

interface ConfirmDeleteDiretorTurmaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  diretorTurmaItem: IDiretorTurma | null;
  loading?: boolean;
  error?: string | null;
  deleteResult?: {
    success?: boolean;
    message?: string;
  } | null;
}

export function ConfirmDeleteDiretorTurmaModal({
  open,
  onOpenChange,
  onConfirm,
  diretorTurmaItem,
  loading = false,
  error = null,
  deleteResult = null,
}: ConfirmDeleteDiretorTurmaModalProps) {
  
  // Se houve sucesso na exclusão
  if (deleteResult?.success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <DialogTitle className="text-green-600">Diretor de Turma Removido com Sucesso!</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 ultra-fast-fade">
            {/* Informações do Diretor Removido */}
            <div className="space-y-3 ultra-fast-fade">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  {deleteResult.message || 'Diretor de turma removido com sucesso'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="w-full">
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Modal de confirmação
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Confirmar Remoção do Diretor de Turma
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja remover esta atribuição de diretor de turma?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 ultra-fast-fade">
          {/* Informações do Diretor de Turma */}
          <div className="space-y-3 border rounded-lg p-4 bg-gray-50 ultra-fast-fade">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Detalhes do Diretor de Turma
            </h4>
            
            {diretorTurmaItem?.tb_docente && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Docente:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {diretorTurmaItem.tb_docente.nome}
                </span>
              </div>
            )}

            {diretorTurmaItem?.tb_docente?.contacto && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Contacto:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {diretorTurmaItem.tb_docente.contacto}
                </span>
              </div>
            )}
            
            {diretorTurmaItem?.tb_turmas && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Turma:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {diretorTurmaItem.tb_turmas.designacao}
                </Badge>
              </div>
            )}
            
            {diretorTurmaItem?.designacao && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Designação:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {diretorTurmaItem.designacao}
                </span>
              </div>
            )}
          </div>

          {/* Alerta */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação irá remover permanentemente a atribuição deste docente como diretor da turma.
              O docente não terá mais responsabilidades de direção sobre esta turma.
            </p>
          </div>

          {/* Erro */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin loading-spinner" />
                Removendo...
              </>
            ) : (
              'Confirmar Remoção'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
