"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  X,
  Briefcase,
  DollarSign,
  Calendar,
  Settings
} from 'lucide-react';
import { useTipoServico, useUpdateTipoServico, useMoedas, useCategorias } from '@/hooks/useFinancialService';
import { ITipoServicoInput } from '@/types/financialService.types';
import { toast } from 'react-toastify';

export default function EditService() {
  const params = useParams();
  const router = useRouter();
  
  const serviceId = parseInt(params.id as string);
  
  // Hooks da API
  const { tipoServico: service, loading, error } = useTipoServico(serviceId);
  const { updateTipoServico, loading: updating, error: updateError } = useUpdateTipoServico();
  const { moedas, loading: moedasLoading } = useMoedas(1, 100);
  const { categorias, loading: categoriasLoading } = useCategorias(1, 100);
  
  const [formData, setFormData] = useState<ITipoServicoInput>({
    designacao: '',
    preco: 0,
    descricao: '',
    codigo_Utilizador: 1, // Será atualizado quando carregar o serviço
    codigo_Moeda: 1,
    tipoServico: 'Propina',
    status: 'Activo',
    aplicarMulta: false,
    aplicarDesconto: false,
    valorMulta: 0,
    categoria: null
  });

  // Preencher formulário quando o serviço carregar
  useEffect(() => {
    if (service) {
      console.log('🔄 Carregando dados do serviço:', service);
      setFormData({
        designacao: service.designacao || '',
        preco: service.preco || 0,
        descricao: service.descricao || '',
        codigo_Utilizador: service.codigo_Utilizador || 1,
        codigo_Moeda: service.codigo_Moeda || 1,
        tipoServico: service.tipoServico || 'Propina',
        status: service.status || 'Activo',
        aplicarMulta: service.aplicarMulta || false,
        aplicarDesconto: service.aplicarDesconto || false,
        valorMulta: service.valorMulta || 0,
        categoria: service.categoria || null
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('📤 Atualizando serviço:', formData);
      const response = await updateTipoServico(serviceId, formData);
      console.log('✅ Serviço atualizado com sucesso:', response);
      toast.success('Serviço atualizado com sucesso!');
      router.push(`/admin/finance-management/services/details/${params.id}`);
    } catch (error) {
      console.error('❌ Erro ao atualizar serviço:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar serviço';
      toast.error(errorMessage);
    }
  };

  const handleBack = useCallback(() => {
    router.back();
  }, []);
  if (loading) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4 loading-spinner"></div>
            <p className="text-muted-foreground">Carregando dados do serviço...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 ultra-fast-fade">
        <div className="text-center py-12">
          <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar serviço</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Serviços
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="bg-background border-b shadow-sm mb-8 rounded-2xl">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Editar Serviço</h1>
                <p className="text-sm text-muted-foreground">
                  Atualizar informações do serviço
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={updating}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                form="service-form"
                disabled={updating}
                className="bg-[#3B6C4D] hover:bg-[#8B4513] text-white"
              >
                {updating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 loading-spinner" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-8 ultra-fast-fade">
        {updateError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao atualizar serviço
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{updateError}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <form id="service-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    value={formData.designacao}
                    onChange={(e) => setFormData({...formData, designacao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: Transporte Escolar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria || ''}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    disabled={categoriasLoading}
                  >
                    <option value="">Selecionar categoria</option>
                    {categorias.map(categoria => (
                      <option key={categoria.codigo} value={categoria.codigo}>
                        {categoria.designacao}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Descrição detalhada do serviço..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações Financeiras */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>Configurações Financeiras</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Preço *
                  </label>
                  <input
                    type="number"
                    value={formData.preco}
                    onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 15000"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Moeda *
                  </label>
                  <select
                    value={formData.codigo_Moeda}
                    onChange={(e) => setFormData({...formData, codigo_Moeda: parseInt(e.target.value)})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    disabled={moedasLoading}
                    required
                  >
                    {moedas.map(moeda => (
                      <option key={moeda.codigo} value={moeda.codigo}>
                        {moeda.designacao}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="aplicarMulta"
                    checked={formData.aplicarMulta}
                    onChange={(e) => setFormData({...formData, aplicarMulta: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded"
                  />
                  <label htmlFor="aplicarMulta" className="text-sm font-medium text-foreground">
                    Aplicar multa por atraso
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="aplicarDesconto"
                    checked={formData.aplicarDesconto}
                    onChange={(e) => setFormData({...formData, aplicarDesconto: e.target.checked})}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-border rounded"
                  />
                  <label htmlFor="aplicarDesconto" className="text-sm font-medium text-foreground">
                    Aplicar desconto
                  </label>
                </div>
              </div>
              {formData.aplicarMulta && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Valor da Multa
                  </label>
                  <input
                    type="number"
                    value={formData.valorMulta}
                    onChange={(e) => setFormData({...formData, valorMulta: parseFloat(e.target.value) || 0})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: 1000"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configurações Adicionais */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-orange-600" />
                <span>Configurações Adicionais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Tipo de Serviço *
                  </label>
                  <select
                    value={formData.tipoServico}
                    onChange={(e) => setFormData({...formData, tipoServico: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="Propina">Propina</option>
                    <option value="Taxa">Taxa</option>
                    <option value="Multa">Multa</option>
                    <option value="Certificado">Certificado</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="Activo">Ativo</option>
                    <option value="Inactivo">Inativo</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
