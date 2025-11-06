"use client"

import React, { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

import { useCreateClass, useUpdateClass } from '@/hooks/useClass'
import { IClass } from '@/types/class.types'

import { useStatus } from '@/hooks/useStatusControl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'

// Tipo específico para o formulário (todos os campos obrigatórios)
interface IClassFormInput {
  designacao: string
  status: number
  notaMaxima: number
  exame: boolean
}

// Schema de validação
const classSchema = yup.object().shape({
  designacao: yup
    .string()
    .required('Nome da classe é obrigatório')
    .max(30, 'Nome da classe deve ter no máximo 30 caracteres')
    .trim(),
  status: yup
    .number()
    .required('Status é obrigatório')
    .default(1),
  notaMaxima: yup
    .number()
    .required('Nota máxima é obrigatória')
    .min(15, 'Nota máxima deve ser no mínimo 15')
    .default(20),
  exame: yup
    .boolean()
    .required('Campo exame é obrigatório')
    .default(false),
})

interface ClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classItem?: IClass | null
  onSuccess?: () => void
}

export function ClassModal({
  open,
  onOpenChange,
  classItem,
  onSuccess
}: ClassModalProps) {
  const isEditing = !!classItem
  
  // Hooks da API
  const { createClass, isLoading: creating, error: createError } = useCreateClass()
  const { updateClass, isLoading: updating, error: updateError } = useUpdateClass()
  const { status: statusList, loading: loadingStatus } = useStatus(1, 100, '')

  const loading = creating || updating
  const error = createError || updateError

  // React Hook Form
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IClassFormInput>({
    resolver: yupResolver(classSchema),
    defaultValues: {
      designacao: '',
      status: 1,
      notaMaxima: 20,
      exame: false,
    },
  })

  // Resetar formulário quando o modal abrir/fechar ou classe mudar
  useEffect(() => {
    if (open && classItem) {
      reset({
        designacao: classItem.designacao || '',
        status: classItem.status || 1,
        notaMaxima: classItem.notaMaxima || 20,
        exame: classItem.exame || false,
      })
    } else if (open && !classItem) {
      reset({
        designacao: '',
        status: 1,
        notaMaxima: 20,
        exame: false,
      })
    }
  }, [open, classItem, reset])

  const onSubmit = async (data: IClassFormInput) => {
    try {
      if (isEditing && classItem) {
        await updateClass(classItem.codigo, data)
      } else {
        await createClass(data)
      }

      onOpenChange(false)
      onSuccess?.()

      // Limpar formulário após sucesso
      reset({
        designacao: '',
        status: 1,
        notaMaxima: 20,
        exame: false,
      })
    } catch (error) {
      console.error('Erro ao salvar classe:', error)
    }
  }

  const handleCancel = useCallback(() => {
    onOpenChange(false)
    reset({
      designacao: '',
      status: 1,
      notaMaxima: 20,
      exame: false,
    })
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Classe' : 'Nova Classe'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da classe abaixo.'
              : 'Preencha as informações para criar uma nova classe.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="designacao">
              Nome da Classe <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="designacao"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="designacao"
                  placeholder="Digite o nome da classe (ex: 1ª Classe, 7ª Classe)"
                  maxLength={100}
                />
              )}
            />
            {errors.designacao && (
              <p className="text-sm text-red-600">{errors.designacao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="notaMaxima">
                Nota Máxima
              </Label>
              <Controller
                name="notaMaxima"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="notaMaxima"
                    type="number"
                    min="1"
                    max="100"
                    placeholder="20"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 20)}
                  />
                )}
              />
              {errors.notaMaxima && (
                <p className="text-sm text-red-600">{errors.notaMaxima.message}</p>
              )}
            </div>

            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="status">
                Status
              </Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || "1"}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    disabled={loadingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingStatus ? "Carregando..." : "Selecione o status"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingStatus ? (
                        <SelectItem value="1" disabled>Carregando...</SelectItem>
                      ) : statusList && statusList.length > 0 ? (
                        statusList.map((status) => (
                          <SelectItem key={status.codigo} value={status.codigo.toString()}>
                            {status.designacao}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="1">Ativa</SelectItem>
                          <SelectItem value="0">Inativa</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="exame"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="exame"
                  checked={field.value}
                  onCheckedChange={(checked: boolean) => field.onChange(checked)}
                />
              )}
            />
            <Label htmlFor="exame" className="text-sm font-medium">
              Classe com exame final
            </Label>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter>
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
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white loading-spinner"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Classe'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}