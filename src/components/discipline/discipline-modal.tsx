"use client"

import React, { useState, useEffect } from 'react'
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

import { useCreateDiscipline, useUpdateDiscipline } from '@/hooks/useDiscipline'
import { IDiscipline, IDisciplineInput } from '@/types/discipline.types'
import { ICourse } from '@/types/course.types'

import { useFilterOptions } from '@/hooks/useFilterOptions'

interface DisciplineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discipline?: IDiscipline | null
  courses: ICourse[]
  onSuccess?: () => void
}

export function DisciplineModal({
  open,
  onOpenChange,
  discipline,
  courses,
  onSuccess
}: DisciplineModalProps) {
  const [formData, setFormData] = useState<IDisciplineInput>({
    designacao: '',
    codigo_Curso: 0,
  })

  const isEditing = !!discipline
  const { createDiscipline, loading: creating, error: createError } = useCreateDiscipline()
  const { updateDiscipline, loading: updating, error: updateError } = useUpdateDiscipline(discipline?.codigo || 0)

  const { statusOptions } = useFilterOptions()

  const loading = creating || updating
  const error = createError || updateError

  // Resetar formulário quando o modal abrir/fechar ou disciplina mudar
  useEffect(() => {
    if (open && discipline) {
      setFormData({
        designacao: discipline.designacao || '',
        codigo_Curso: discipline.codigo_Curso || 0,
        status: discipline.status || 1,
        cadeiraEspecifica: discipline.cadeiraEspecifica || 0,
      })
    } else if (open && !discipline) {
      setFormData({
        designacao: '',
        codigo_Curso: 0,
        status: 1,
        cadeiraEspecifica: 0,
      })
    }
  }, [open, discipline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && discipline) {
        await updateDiscipline(formData)
      } else {
        await createDiscipline(formData)
      }

      onOpenChange(false)
      onSuccess?.()

      // Limpar formulário após sucesso
      setFormData({
        designacao: '',
        codigo_Curso: 0,
        status: 1,
        cadeiraEspecifica: 0,
      })
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error)
    }
  }

  const handleChange = useCallback((field: keyof IDisciplineInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = useCallback(() => {
    onOpenChange(false)
    setFormData({
      designacao: '',
      codigo_Curso: 0,
      status: 1,
      cadeiraEspecifica: 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da disciplina abaixo.'
              : 'Preencha as informações para criar uma nova disciplina.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="designacao">
              Nome da Disciplina <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleChange('designacao', e.target.value)}
              placeholder="Digite o nome da disciplina"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="codigo_Curso">
              Curso <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.codigo_Curso.toString()}
              onValueChange={(value) => handleChange('codigo_Curso', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.codigo} value={course.codigo.toString()}>
                    {course.designacao && course.designacao.trim()
                      ? course.designacao
                      : `Curso ID ${course.codigo}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                value={formData.status?.toString() || "1"}
                onValueChange={(value) => handleChange('status', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions
                    .filter(option => option.value !== "all")
                    .map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 ultra-fast-fade">
              <Label htmlFor="cadeiraEspecifica">
                Cadeira Específica
              </Label>
              <Select
                value={formData.cadeiraEspecifica?.toString() || "0"}
                onValueChange={(value) => handleChange('cadeiraEspecifica', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Geral</SelectItem>
                  <SelectItem value="1">Específica</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              disabled={loading || !formData.designacao.trim() || formData.codigo_Curso === 0}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white loading-spinner"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Disciplina'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}