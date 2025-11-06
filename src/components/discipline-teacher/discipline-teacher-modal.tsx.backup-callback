"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

import { useCreateDisciplinaDocente, useUpdateDisciplinaDocente } from '@/hooks/useDisciplineTeacher'
import { IDisciplinaDocente, IDisciplinaDocenteInput } from '@/types/disciplineTeacher.types'
import { useAllDocentes } from '@/hooks/useTeacher'
import { useAllCourses } from '@/hooks/useCourse'
import { useDisciplines } from '@/hooks/useDiscipline'

interface DisciplineTeacherModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  disciplineTeacher?: IDisciplinaDocente | null
  onSuccess?: () => void
}

export function DisciplineTeacherModal({
  open,
  onOpenChange,
  disciplineTeacher,
  onSuccess
}: DisciplineTeacherModalProps) {
  const [formData, setFormData] = useState<IDisciplinaDocenteInput>({
    codigoDocente: 0,
    codigoCurso: 0,
    codigoDisciplina: 0,
  })

  // Estados para busca nos selects
  const [docenteSearch, setDocenteSearch] = useState('')
  const [cursoSearch, setCursoSearch] = useState('')
  const [disciplinaSearch, setDisciplinaSearch] = useState('')

  const isEditing = !!disciplineTeacher
  const { createDisciplinaDocente, loading: creating, error: createError } = useCreateDisciplinaDocente()
  const { updateDisciplinaDocente, loading: updating, error: updateError } = useUpdateDisciplinaDocente()

  // Hooks para carregar dados dos selects
  const { docentes, loading: loadingDocentes } = useAllDocentes(docenteSearch)
  const { courses, loading: loadingCursos } = useAllCourses(cursoSearch)
  const { disciplines, loading: loadingDisciplinas } = useDisciplines(1, 1000, disciplinaSearch)

  const loading = creating || updating
  const error = createError || updateError

  // Resetar formulário quando o modal abrir/fechar ou disciplineTeacher mudar
  useEffect(() => {
    if (open && disciplineTeacher) {
      setFormData({
        codigoDocente: disciplineTeacher.codigoDocente || 0,
        codigoCurso: disciplineTeacher.codigoCurso || 0,
        codigoDisciplina: disciplineTeacher.codigoDisciplina || 0,
      })
    } else if (open && !disciplineTeacher) {
      setFormData({
        codigoDocente: 0,
        codigoCurso: 0,
        codigoDisciplina: 0,
      })
    }
  }, [open, disciplineTeacher])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && disciplineTeacher) {
        await updateDisciplinaDocente(disciplineTeacher.codigo, formData)
      } else {
        await createDisciplinaDocente(formData)
      }

      onOpenChange(false)
      onSuccess?.()

      // Limpar formulário após sucesso
      setFormData({
        codigoDocente: 0,
        codigoCurso: 0,
        codigoDisciplina: 0,
      })
    } catch (error) {
      console.error('Erro ao salvar disciplina do docente:', error)
    }
  }

  const handleChange = useCallback((field: keyof IDisciplinaDocenteInput, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = useCallback(() => {
    onOpenChange(false)
    setFormData({
      codigoDocente: 0,
      codigoCurso: 0,
      codigoDisciplina: 0,
    })
    // Limpar buscas
    setDocenteSearch('')
    setCursoSearch('')
    setDisciplinaSearch('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Atribuição de Disciplina' : 'Nova Atribuição de Disciplina'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da atribuição de disciplina ao docente.'
              : 'Preencha as informações para atribuir uma disciplina a um docente.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Docente */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="codigoDocente">
              Docente <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2 ultra-fast-fade">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar docente..."
                  value={docenteSearch}
                  onChange={(e) => setDocenteSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={formData.codigoDocente.toString()}
                onValueChange={(value) => handleChange('codigoDocente', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um docente" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDocentes ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 loading-spinner"></div>
                      <span className="ml-2 text-sm text-gray-500">Carregando...</span>
                    </div>
                  ) : docentes && docentes.length > 0 ? (
                    docentes.map((docente) => (
                      <SelectItem key={docente.codigo} value={docente.codigo.toString()}>
                        {docente.nome || `Docente ID ${docente.codigo}`}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Nenhum docente encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Curso */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="codigoCurso">
              Curso <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2 ultra-fast-fade">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar curso..."
                  value={cursoSearch}
                  onChange={(e) => setCursoSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={formData.codigoCurso.toString()}
                onValueChange={(value) => handleChange('codigoCurso', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCursos ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 loading-spinner"></div>
                      <span className="ml-2 text-sm text-gray-500">Carregando...</span>
                    </div>
                  ) : courses && courses.length > 0 ? (
                    courses.map((course) => (
                      <SelectItem key={course.codigo} value={course.codigo.toString()}>
                        {course.designacao && course.designacao.trim() 
                          ? course.designacao 
                          : `Curso ID ${course.codigo}`}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Nenhum curso encontrado
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Disciplina */}
          <div className="space-y-2 ultra-fast-fade">
            <Label htmlFor="codigoDisciplina">
              Disciplina <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2 ultra-fast-fade">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar disciplina..."
                  value={disciplinaSearch}
                  onChange={(e) => setDisciplinaSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={formData.codigoDisciplina.toString()}
                onValueChange={(value) => handleChange('codigoDisciplina', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {loadingDisciplinas ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 loading-spinner"></div>
                      <span className="ml-2 text-sm text-gray-500">Carregando...</span>
                    </div>
                  ) : disciplines && disciplines.length > 0 ? (
                    disciplines.map((discipline) => (
                      <SelectItem key={discipline.codigo} value={discipline.codigo.toString()}>
                        {discipline.designacao || `Disciplina ID ${discipline.codigo}`}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Nenhuma disciplina encontrada
                    </div>
                  )}
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
              disabled={
                loading || 
                formData.codigoDocente === 0 || 
                formData.codigoCurso === 0 || 
                formData.codigoDisciplina === 0
              }
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white loading-spinner"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Atribuição'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
