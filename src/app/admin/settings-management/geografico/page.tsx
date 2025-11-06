"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MapPin,
  Save,
  Plus,
  Edit,
  Trash2,
  Search,
  Globe,
  Building,
  Home,
  Users,
} from 'lucide-react';

interface Provincia {
  id: string;
  nome: string;
  codigo: string;
  municipios: Municipio[];
}

interface Municipio {
  id: string;
  nome: string;
  codigo: string;
  comunas: Comuna[];
}

interface Comuna {
  id: string;
  nome: string;
  codigo: string;
  bairros: string[];
}

export default function GeograficoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('');

  const [provincias] = useState<Provincia[]>([
    {
      id: '1',
      nome: 'Luanda',
      codigo: 'LUA',
      municipios: [
        {
          id: '1',
          nome: 'Luanda',
          codigo: 'LUA-01',
          comunas: [
            {
              id: '1',
              nome: 'Ingombota',
              codigo: 'ING',
              bairros: ['Maianga', 'Kinaxixi', 'Alvalade', 'Maculusso']
            },
            {
              id: '2',
              nome: 'Rangel',
              codigo: 'RAN',
              bairros: ['Rangel', 'Operário', 'Sambizanga', 'Ngola Kiluanje']
            }
          ]
        },
        {
          id: '2',
          nome: 'Cacuaco',
          codigo: 'CAC',
          comunas: [
            {
              id: '3',
              nome: 'Cacuaco',
              codigo: 'CAC-01',
              bairros: ['Cacuaco', 'Sequele', 'Funda', 'Kikolo']
            }
          ]
        }
      ]
    },
    {
      id: '2',
      nome: 'Benguela',
      codigo: 'BEN',
      municipios: [
        {
          id: '3',
          nome: 'Benguela',
          codigo: 'BEN-01',
          comunas: [
            {
              id: '4',
              nome: 'Benguela',
              codigo: 'BEN-C01',
              bairros: ['Centro', 'Compão', 'Calombotão', 'Praia Morena']
            }
          ]
        }
      ]
    },
    {
      id: '3',
      nome: 'Huambo',
      codigo: 'HUA',
      municipios: [
        {
          id: '4',
          nome: 'Huambo',
          codigo: 'HUA-01',
          comunas: [
            {
              id: '5',
              nome: 'Huambo',
              codigo: 'HUA-C01',
              bairros: ['Centro', 'Comala', 'Benfica', 'Palanca']
            }
          ]
        }
      ]
    }
  ]);

  const [novaEntidade, setNovaEntidade] = useState({
    tipo: 'provincia',
    nome: '',
    codigo: '',
    parent: ''
  });

  const getSelectedMunicipios = () => {
    if (!selectedProvincia) return [];
    const provincia = provincias.find(p => p.id === selectedProvincia);
    return provincia?.municipios || [];
  };

  const getSelectedComunas = () => {
    if (!selectedMunicipio) return [];
    const provincia = provincias.find(p => p.id === selectedProvincia);
    const municipio = provincia?.municipios.find(m => m.id === selectedMunicipio);
    return municipio?.comunas || [];
  };

  const getTotalMunicipios = () => {
    return provincias.reduce((total, provincia) => total + provincia.municipios.length, 0);
  };

  const getTotalComunas = () => {
    return provincias.reduce((total, provincia) => 
      total + provincia.municipios.reduce((subTotal, municipio) => 
        subTotal + municipio.comunas.length, 0), 0);
  };

  const getTotalBairros = () => {
    return provincias.reduce((total, provincia) => 
      total + provincia.municipios.reduce((subTotal, municipio) => 
        subTotal + municipio.comunas.reduce((subSubTotal, comuna) => 
          subSubTotal + comuna.bairros.length, 0), 0), 0);
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 ultra-fast-fade">
            <div className="space-y-3 ultra-fast-fade">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Configurações Geográficas
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Localização</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Configure e gerencie as divisões administrativas de Angola: 
                províncias, municípios, comunas e bairros.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Localização
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#D2B48C]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Globe className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">18</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-blue-600">Províncias</p>
            <p className="text-3xl font-bold text-gray-900">{provincias.length}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Building className="h-3 w-3 text-green-500" />
              <span className="font-bold text-xs text-green-600">164</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-green-600">Municípios</p>
            <p className="text-3xl font-bold text-gray-900">{getTotalMunicipios()}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#F5DEB3] shadow-sm">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MapPin className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-xs text-yellow-600">618</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Comunas</p>
            <p className="text-3xl font-bold text-gray-900">{getTotalComunas()}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Home className="h-3 w-3 text-purple-500" />
              <span className="font-bold text-xs text-purple-600">2.5k+</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Bairros</p>
            <p className="text-3xl font-bold text-gray-900">{getTotalBairros()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adicionar Nova Localização */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Nova Localização</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo
              </label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={novaEntidade.tipo}
                onChange={(e) => setNovaEntidade(prev => ({ ...prev, tipo: e.target.value }))}
              >
                <option value="provincia">Província</option>
                <option value="municipio">Município</option>
                <option value="comuna">Comuna</option>
                <option value="bairro">Bairro</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nome
              </label>
              <Input
                value={novaEntidade.nome}
                onChange={(e) => setNovaEntidade(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome da localização"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Código
              </label>
              <Input
                value={novaEntidade.codigo}
                onChange={(e) => setNovaEntidade(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Código (ex: LUA)"
              />
            </div>

            {novaEntidade.tipo !== 'provincia' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Localização Pai
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md">
                  <option value="">Selecionar...</option>
                  {/* Aqui seria populado dinamicamente baseado no tipo */}
                </select>
              </div>
            )}

            <div className="pt-4">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navegação Geográfica */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Navegação Geográfica</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar localização..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Seleção de Província */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Províncias</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provincias.map((provincia) => (
                    <div
                      key={provincia.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProvincia === provincia.id
                          ? 'border-[#F9CD1D] bg-[#F9CD1D]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setSelectedProvincia(provincia.id);
                        setSelectedMunicipio('');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{provincia.nome}</p>
                          <p className="text-sm text-gray-600">{provincia.codigo}</p>
                        </div>
                        <Badge variant="outline">
                          {provincia.municipios.length} municípios
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seleção de Município */}
              {selectedProvincia && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Municípios</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {getSelectedMunicipios().map((municipio) => (
                      <div
                        key={municipio.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedMunicipio === municipio.id
                            ? 'border-[#F9CD1D] bg-[#F9CD1D]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedMunicipio(municipio.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm text-gray-900">{municipio.nome}</p>
                            <p className="text-xs text-gray-600">{municipio.codigo}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {municipio.comunas.length} comunas
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seleção de Comuna */}
              {selectedMunicipio && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Comunas</h3>
                  <div className="space-y-3 ultra-fast-fade">
                    {getSelectedComunas().map((comuna) => (
                      <div key={comuna.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{comuna.nome}</p>
                            <p className="text-sm text-gray-600">{comuna.codigo}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Bairros:</p>
                          <div className="flex flex-wrap gap-2">
                            {comuna.bairros.map((bairro, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {bairro}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
