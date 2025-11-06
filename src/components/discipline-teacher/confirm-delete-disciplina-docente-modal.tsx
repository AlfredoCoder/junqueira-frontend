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
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { IDisciplinaDocente } from '@/types/disciplineTeacher.types';

interface ConfirmDeleteDisciplinaDocenteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  disciplinaDocenteItem: IDisciplinaDocente | null;
  loading?: boolean;
  error?: string | null;
  deleteResult?: {
    success?: boolean;
    message?: string;
  } | null;
}

export function ConfirmDeleteDisciplinaDocenteModal({
  open,
  onOpenChange,
  onConfirm,
  disciplinaDocenteItem,
  loading = false,
  error = null,
  deleteResult = null,
}: ConfirmDeleteDisciplinaDocenteModalProps) {
  
  // Se houve sucesso na exclusão
  if (deleteResult?.success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <DialogTitle className="text-green-600">Atribuição Excluída com Sucesso!</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 ultra-fast-fade">
            {/* Informações da Atribuição Excluída */}
            <div className="space-y-3 ultra-fast-fade">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700">
                  {deleteResult.message || 'Atribuição de disciplina excluída com sucesso'}
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
            Confirmar Exclusão da Atribuição
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta atribuição de disciplina ao docente?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 ultra-fast-fade">
          {/* Informações da Atribuição */}
          <div className="space-y-3 border rounded-lg p-4 bg-gray-50 ultra-fast-fade">
            <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
              Detalhes da Atribuição
            </h4>
            
            {disciplinaDocenteItem?.tb_docente && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Docente:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {disciplinaDocenteItem.tb_docente.nome}
                </span>
              </div>
            )}
            
            {disciplinaDocenteItem?.tb_disciplinas && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Disciplina:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {disciplinaDocenteItem.tb_disciplinas.designacao}
                </span>
              </div>
            )}
            
            {disciplinaDocenteItem?.tb_cursos && (
              <div className="flex justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-600">Curso:</span>
                <span className="text-sm font-semibold text-gray-900">
                  {disciplinaDocenteItem.tb_cursos.designacao}
                </span>
              </div>
            )}
          </div>

          {/* Alerta */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação irá remover permanentemente a atribuição desta disciplina ao docente.
              O docente não estará mais autorizado a lecionar esta disciplina neste curso.
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
