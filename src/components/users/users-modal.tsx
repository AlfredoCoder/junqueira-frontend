"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserPlus, UserCog, Eye, EyeOff } from 'lucide-react'
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers'
import { UserType } from '@/types/auth.types'

interface Usuario {
  codigo: number;
  nome: string;
  user: string;
  passe?: string;
  codigo_Tipo_Utilizador: number;
  estadoActual: string;
  dataCadastro: string;
  loginStatus: string;
  tb_tipos_utilizador?: {
    codigo: number;
    designacao: string;
  };
}

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: Usuario | null
  onSuccess?: () => void
  userTypes?: UserType[]
}

export function UserModal({ 
  open, 
  onOpenChange, 
  user = null,
  onSuccess,
  userTypes = []
}: UserModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    user: '',
    passe: '',
    codigo_Tipo_Utilizador: 0,
    estadoActual: 'ACTIVO'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { createUser, loading: creating } = useCreateUser()
  const { updateUser, loading: updating } = useUpdateUser()

  const isEditMode = !!user
  const loading = creating || updating

  // Resetar formulário quando modal abrir/fechar ou usuário mudar
  useEffect(() => {
    if (open) {
      if (user) {
        setFormData({
          nome: user.nome,
          user: user.user,
          passe: '',
          codigo_Tipo_Utilizador: user.codigo_Tipo_Utilizador,
          estadoActual: user.estadoActual
        })
      } else {
        setFormData({
          nome: '',
          user: '',
          passe: '',
          codigo_Tipo_Utilizador: 0,
          estadoActual: 'ACTIVO'
        })
      }
      setErrors({})
      setShowPassword(false)
    }
  }, [open, user])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.user.trim()) {
      newErrors.user = 'Nome de usuário é obrigatório'
    }

    if (!isEditMode && !formData.passe) {
      newErrors.passe = 'Senha é obrigatória'
    }

    if (formData.passe && formData.passe.length < 4) {
      newErrors.passe = 'Senha deve ter no mínimo 4 caracteres'
    }

    if (!formData.codigo_Tipo_Utilizador || formData.codigo_Tipo_Utilizador === 0) {
      newErrors.codigo_Tipo_Utilizador = 'Tipo de usuário é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (isEditMode) {
        // Atualizar usuário
        const updateData: {
          nome: string;
          user: string;
          codigo_Tipo_Utilizador: number;
          estadoActual: string;
          passe?: string;
        } = {
          nome: formData.nome,
          user: formData.user,
          codigo_Tipo_Utilizador: formData.codigo_Tipo_Utilizador,
          estadoActual: formData.estadoActual
        }

        // Só incluir senha se foi preenchida
        if (formData.passe) {
          updateData.passe = formData.passe
        }

        await updateUser(user!.codigo, updateData)
      } else {
        // Criar novo usuário
        await createUser(formData)
      }

      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
    }
  }

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-blue-100">
              {isEditMode ? (
                <UserCog className="h-5 w-5 text-blue-600" />
              ) : (
                <UserPlus className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <DialogTitle className="text-blue-900">
              {isEditMode ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {isEditMode
              ? 'Atualize as informações do usuário abaixo.'
              : 'Preencha os dados para criar um novo usuário no sistema.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Nome */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="nome">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              placeholder="Digite o nome completo"
              className={errors.nome ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          {/* Nome de Usuário */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="user">
              Nome de Usuário <span className="text-red-500">*</span>
            </Label>
            <Input
              id="user"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              placeholder="Digite o nome de usuário"
              className={errors.user ? 'border-red-500' : ''}
              disabled={loading}
            />
            {errors.user && (
              <p className="text-sm text-red-500">{errors.user}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="passe">
              Senha {!isEditMode && <span className="text-red-500">*</span>}
              {isEditMode && <span className="text-xs text-gray-500">(deixe vazio para manter a senha atual)</span>}
            </Label>
            <div className="relative">
              <Input
                id="passe"
                type={showPassword ? 'text' : 'password'}
                value={formData.passe}
                onChange={(e) => setFormData({ ...formData, passe: e.target.value })}
                placeholder={isEditMode ? 'Digite nova senha (opcional)' : 'Digite a senha'}
                className={errors.passe ? 'border-red-500 pr-10' : 'pr-10'}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.passe && (
              <p className="text-sm text-red-500">{errors.passe}</p>
            )}
          </div>

          {/* Tipo de Usuário */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="tipo">
              Tipo de Usuário <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.codigo_Tipo_Utilizador.toString()}
              onValueChange={(value) => 
                setFormData({ ...formData, codigo_Tipo_Utilizador: parseInt(value) })
              }
              disabled={loading}
            >
              <SelectTrigger className={errors.codigo_Tipo_Utilizador ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                {userTypes.length > 0 ? (
                  userTypes.map((tipo) => (
                    <SelectItem key={tipo.codigo} value={tipo.codigo.toString()}>
                      {tipo.designacao}
                    </SelectItem>
                  ))
                ) : (
                  <>
                    <SelectItem value="6">Administrador</SelectItem>
                    <SelectItem value="2">Operador</SelectItem>
                    <SelectItem value="9">Assistente Administrativo</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.codigo_Tipo_Utilizador && (
              <p className="text-sm text-red-500">{errors.codigo_Tipo_Utilizador}</p>
            )}
          </div>

          {/* Estado */}
          {isEditMode && (
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estadoActual}
                onValueChange={(value) => 
                  setFormData({ ...formData, estadoActual: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVO">ACTIVO</SelectItem>
                  <SelectItem value="INACTIVO">INACTIVO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </form>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Salvando...' : isEditMode ? 'Atualizar' : 'Criar Usuário'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
