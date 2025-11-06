'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  FileText,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import WelcomeHeader from '@/components/layout/WelcomeHeader';

export default function SAFTExportPage() {
  const [config, setConfig] = useState({
    startDate: '',
    endDate: '',
    includeCustomers: true,
    includeProducts: true,
    includeInvoices: true,
    includePayments: true
  });

  const [isExporting, setIsExporting] = useState(false);
  const [statistics, setStatistics] = useState({
    totalInvoices: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalPayments: 0,
    totalValue: 0
  });

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = firstDayOfMonth.toISOString().split('T')[0];
    const endDate = today.toISOString().split('T')[0];

    setConfig(prev => ({ ...prev, startDate, endDate }));
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    // Simular exportação
    setTimeout(() => {
      setIsExporting(false);
      alert('Funcionalidade SAFT em desenvolvimento');
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <WelcomeHeader 
        title="Exportação SAFT-AO" 
        subtitle="Standard Audit File for Tax - Angola" 
      />
      
      <div className="grid gap-6">
        {/* Configuração do Período */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Período de Exportação
            </CardTitle>
            <CardDescription>
              Selecione o período para geração do ficheiro SAFT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Data Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Data Fim</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalInvoices}</div>
                <div className="text-sm text-gray-600">Faturas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.totalCustomers}</div>
                <div className="text-sm text-gray-600">Clientes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statistics.totalProducts}</div>
                <div className="text-sm text-gray-600">Produtos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{statistics.totalPayments}</div>
                <div className="text-sm text-gray-600">Pagamentos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{statistics.totalValue.toLocaleString()} Kz</div>
                <div className="text-sm text-gray-600">Valor Total</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aviso de Desenvolvimento */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Funcionalidade em Desenvolvimento</p>
                <p className="text-sm text-yellow-700">A exportação SAFT-AO será implementada em breve.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão de Exportação */}
        <div className="flex justify-end">
          <Button 
            onClick={handleExport}
            disabled={isExporting || !config.startDate || !config.endDate}
            className="min-w-[200px]"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Gerando SAFT...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Gerar SAFT-AO
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

