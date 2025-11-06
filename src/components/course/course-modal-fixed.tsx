"use client";

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit } from 'lucide-react';

interface ICourseInput {
  designacao: string;
  codigo_Status: number;
}

interface ICourse {
  codigo: number;
  designacao: string;
  status: string;
}

interface CourseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ICourseInput) => Promise<void>;
  course?: ICourse | null;
  loading?: boolean;
  message?: { type: 'success' | 'error'; text: string } | null;
}

export function CourseModal({
  open,
  onOpenChange,
  onSubmit,
  course = null,
  loading = false,
  message = null
}: CourseModalProps) {
  const [formData, setFormData] = useState<ICourseInput>({
    designacao: course?.designacao || '',
    codigo_Status: course?.status === 'Activo' ? 1 : 0,
  });

  const isEditing = !!course;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.designacao.trim()) return;
    
    await onSubmit(formData);
  }, [formData, onSubmit]);

  const handleChange = useCallback((field: keyof ICourseInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleCancel = useCallback(() => {
    onOpenChange(false);
    setFormData({
      designacao: '',
      codigo_Status: 1,
    });
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-full bg-blue-100">
              {isEditing ? (
                <Edit className="h-5 w-5 text-blue-600" />
              ) : (
                <Plus className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div>
              <DialogTitle>
                {isEditing ? 'Editar Curso' : 'Novo Curso'}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? 'Edite as informações do curso abaixo.'
                  : 'Preencha as informações para criar um novo curso.'
                }
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {message && (
          <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designacao">
              Nome do Curso <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleChange('designacao', e.target.value)}
              placeholder="Ex: Engenharia Informática"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.codigo_Status.toString()}
              onValueChange={(value) => handleChange('codigo_Status', parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ativo</SelectItem>
                <SelectItem value="0">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.designacao.trim()}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  {isEditing ? <Edit className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Atualizar' : 'Criar'} Curso
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
