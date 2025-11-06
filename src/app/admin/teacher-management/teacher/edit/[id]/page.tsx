'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    formacao: '',
    nivelAcademico: '',
    especialidade: '',
    numeroFuncionario: '',
    status: 'Activo'
  });

  useEffect(() => {
    fetchProfessor();
  }, [teacherId]);

  const fetchProfessor = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professores/${teacherId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFormData({
            nome: data.data.nome || '',
            email: data.data.email || '',
            telefone: data.data.telefone || '',
            formacao: data.data.formacao || '',
            nivelAcademico: data.data.nivelAcademico || '',
            especialidade: data.data.especialidade || '',
            numeroFuncionario: data.data.numeroFuncionario || '',
            status: data.data.status || 'Activo'
          });
        } else {
          toast.error(data.message || 'Erro ao carregar professor');
        }
      } else {
        toast.error('Erro ao carregar professor');
      }
    } catch (error) {
      console.error('Erro ao buscar professor:', error);
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professores/${teacherId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Professor atualizado com sucesso!');
          router.push('/admin/teacher-management/teacher');
        } else {
          toast.error(data.message || 'Erro ao atualizar professor');
        }
      } else {
        toast.error('Erro ao atualizar professor');
      }
    } catch (error) {
      console.error('Erro ao atualizar professor:', error);
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Professor</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome completo"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  placeholder="+244 900 000 000"
                />
              </div>
              <div>
                <Label htmlFor="numeroFuncionario">Número de Funcionário</Label>
                <Input
                  id="numeroFuncionario"
                  value={formData.numeroFuncionario}
                  onChange={(e) => handleInputChange('numeroFuncionario', e.target.value)}
                  placeholder="PROF001"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Formação Acadêmica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="formacao">Formação</Label>
                <Input
                  id="formacao"
                  value={formData.formacao}
                  onChange={(e) => handleInputChange('formacao', e.target.value)}
                  placeholder="Licenciatura em..."
                />
              </div>
              <div>
                <Label htmlFor="nivelAcademico">Nível Acadêmico</Label>
                <Input
                  id="nivelAcademico"
                  value={formData.nivelAcademico}
                  onChange={(e) => handleInputChange('nivelAcademico', e.target.value)}
                  placeholder="Licenciado, Mestre, Doutor..."
                />
              </div>
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={formData.especialidade}
                  onChange={(e) => handleInputChange('especialidade', e.target.value)}
                  placeholder="Área de especialização"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Activo">Ativo</option>
                  <option value="Inactivo">Inativo</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
