"use client"

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
// Removido import do RadioGroup - usando inputs HTML simples
import { Label } from '@/components/ui/label'
import { AlertTriangle, UserX, UserMinus } from 'lucide-react'

interface AdvancedDeleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (action: 'delete' | 'deactivate') => void
  userName?: string
  loading?: boolean
}

export function AdvancedDeleteModal({ 
  open, 
  onOpenChange, 
  onConfirm, 
  userName = "usuário",
  loading = false
}: AdvancedDeleteModalProps) {
  const [selectedAction, setSelectedAction] = useState<'delete' | 'deactivate'>('deactivate')

  const handleConfirm = useCallback(() => {
    onConfirm(selectedAction)
  }, [onConfirm, selectedAction])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-orange-100">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
            </div>
            <DialogTitle className="text-orange-900">
              Remover Usuário
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 mt-2">
            Escolha como deseja remover o usuário <strong>{userName}</strong> do sistema:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 ultra-fast-fade">
          {/* Opção Desativar */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
            <input
              type="radio"
              id="deactivate"
              name="action"
              value="deactivate"
              checked={selectedAction === 'deactivate'}
              onChange={(e) => setSelectedAction(e.target.value as 'delete' | 'deactivate')}
              className="mt-1 h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <Label htmlFor="deactivate" className="flex items-center space-x-2 cursor-pointer">
                <UserMinus className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Desativar Usuário</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Recomendado</span>
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                O usuário será desativado mas seus dados serão preservados. 
                Pode ser reativado posteriormente se necessário.
              </p>
            </div>
          </div>

          {/* Opção Excluir */}
          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-red-50">
            <input
              type="radio"
              id="delete"
              name="action"
              value="delete"
              checked={selectedAction === 'delete'}
              onChange={(e) => setSelectedAction(e.target.value as 'delete' | 'deactivate')}
              className="mt-1 h-4 w-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 focus:ring-2"
            />
            <div className="flex-1">
              <Label htmlFor="delete" className="flex items-center space-x-2 cursor-pointer">
                <UserX className="h-4 w-4 text-red-600" />
                <span className="font-medium text-red-900">Excluir Permanentemente</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Irreversível</span>
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                O usuário e <strong>todos os seus dados relacionados</strong> serão 
                excluídos permanentemente do sistema. Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant={selectedAction === 'delete' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={loading}
            className={selectedAction === 'deactivate' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            {loading ? 'Processando...' : 
             selectedAction === 'delete' ? 'Excluir Permanentemente' : 'Desativar Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
