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
          ...prev,
          companyInfo: {
            ...prev.companyInfo,
            nif: response.data.nif || prev.companyInfo.nif,
            name: response.data.nome || prev.companyInfo.name,
            address: response.data.endereco || prev.companyInfo.address,
            city: response.data.cidade || prev.companyInfo.city,
            postalCode: response.data.codigoPostal || prev.companyInfo.postalCode,
            phone: response.data.telefone || prev.companyInfo.phone,
            email: response.data.email || prev.companyInfo.email,
          }
        }));
        
        console.log('✅ Dados da empresa carregados com sucesso');
      }
    } catch (error: any) {
      console.warn('⚠️ Usando dados padrão da empresa (API não disponível)');
      // Usar dados padrão quando API não disponível - não é erro crítico
    } finally {
      setIsLoadingCompany(false);
  };

  const loadStatistics = async (startDate: string, endDate: string) => {
    try {
      console.log('🔄 Carregando estatísticas para:', { startDate, endDate });
      const stats = await SAFTService.getExportStatistics(startDate, endDate);
      console.log('✅ Estatísticas recebidas:', stats);
      setStatistics(stats);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
      setStatistics({
        totalInvoices: 0,
        totalCustomers: 0,
        totalProducts: 0,
        totalPayments: 0,
        totalValue: 0,
        period: {
          startDate,
          endDate
        }
      });
    }
  };

  const checkCryptoKeys = () => {
{{ ... }}
    const hasPrivateKey = localStorage.getItem('saft_private_key');
    const hasPublicKey = localStorage.getItem('saft_public_key');
    setHasKeys(!!(hasPrivateKey && hasPublicKey));
  };

  const generateKeys = async () => {
    try {
      setIsExporting(true);
      setExportProgress(20);
      
      const keyPair = await CryptoService.generateKeyPair();
      
      localStorage.setItem('saft_private_key', keyPair.privateKey);
      localStorage.setItem('saft_public_key', keyPair.publicKey);
      
      setHasKeys(true);
      setExportProgress(0);
      setIsExporting(false);
      
      alert('Chaves criptográficas geradas com sucesso!\n\nIMPORTANTE: Faça backup das suas chaves e registe a chave pública na AGT.');
    } catch (error) {
      console.error('Erro ao gerar chaves:', error);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const reloadStatistics = async () => {
    if (!config.startDate || !config.endDate) return;
    
    try {
      const stats = await SAFTService.getExportStatistics(config.startDate, config.endDate);
      setStatistics(stats);
    } catch (error) {
      console.warn('⚠️ Erro ao recarregar estatísticas');
    }
  };

  const validateConfig = async () => {
    try {
      const validation = await SAFTService.validateExportConfig(config);
      setValidationErrors(validation.errors || []);
      return validation.valid;
    } catch (error) {
      setValidationErrors(['Erro ao validar configuração']);
      return false;
    }
  };

  const handleExport = async () => {
    if (!hasKeys) {
      alert('É necessário gerar chaves criptográficas antes de exportar.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportResult(null);
    setValidationErrors([]);

    try {
      // Validar configuração
      setExportProgress(10);
      const isValid = await validateConfig();
      if (!isValid) {
        setIsExporting(false);
        return;
      }

      // Exportar SAFT
      setExportProgress(30);
      const result = await SAFTService.exportSAFT(config);
      
      setExportProgress(100);
      setExportResult(result);

      if (result.success && result.downloadUrl) {
        // Iniciar download automaticamente
        SAFTService.downloadSAFTFile(result.downloadUrl, result.fileName || 'saft.xml');
      }

    } catch (error: any) {
      console.error('Erro na exportação:', error);
      setExportResult({
        success: false,
        message: error.message || 'Erro desconhecido na exportação',
        errors: [error.message]
      });
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const exportPublicKey = (format: 'pem' | 'txt' = 'pem') => {
    try {
      const publicKey = localStorage.getItem('saft_public_key');
      if (!publicKey) {
        alert('Chave pública não encontrada. Gere as chaves primeiro.');
        return;
      }

      let keyContent: string;
      let fileName: string;
      let mimeType: string;

      if (format === 'pem') {
        keyContent = CryptoService.exportPublicKeyPEM();
        fileName = 'chave_publica_saft.pem';
        mimeType = 'application/x-pem-file';
      } else {
        // Formato TXT mais simples
        keyContent = `CHAVE PÚBLICA SAFT-AO
Sistema: Complexo Abilio Junqueira
Data: ${new Date().toLocaleString('pt-AO')}
Algoritmo: RSA 2048 bits + SHA-256

=== INÍCIO DA CHAVE PÚBLICA ===
${CryptoService.exportPublicKeyPEM()}
=== FIM DA CHAVE PÚBLICA ===

INSTRUÇÕES:
1. Registar esta chave no portal da AGT
2. Aguardar aprovação e número de certificado
3. Inserir número do certificado no sistema
4. Iniciar uso em produção

IMPORTANTE: Manter esta chave segura e fazer backup!`;
        fileName = 'chave_publica_saft.txt';
        mimeType = 'text/plain';
      }

      const blob = new Blob([keyContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      console.log(`✅ Chave pública exportada: ${fileName}`);
    } catch (error) {
      console.error('Erro ao exportar chave pública:', error);
      alert('Erro ao exportar chave pública');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exportação SAFT-AO</h1>
          <p className="text-muted-foreground mt-2">
            Standard Audit File for Tax - Angola (Decreto Executivo 74/19)
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Shield className="w-4 h-4 mr-1" />
          Certificado AGT
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuração Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Período de Exportação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Período de Exportação
              </CardTitle>
              <CardDescription>
                Selecione o período para geração do ficheiro SAFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Data de Início</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={config.startDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, startDate: e.target.value }))}
                    onBlur={() => reloadStatistics()}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={config.endDate}
                    onChange={(e) => setConfig(prev => ({ ...prev, endDate: e.target.value }))}
                    onBlur={() => reloadStatistics()}
                  />
                </div>
              </div>

              {/* Estatísticas do Período */}
              {statistics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{statistics.totalInvoices}</div>
                    <div className="text-sm text-muted-foreground">Faturas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{statistics.totalPayments}</div>
                    <div className="text-sm text-muted-foreground">Pagamentos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{statistics.totalCustomers}</div>
                    <div className="text-sm text-muted-foreground">Clientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Intl.NumberFormat('pt-AO', { 
                        style: 'currency', 
                        currency: 'AOA',
                        minimumFractionDigits: 0 
                      }).format(statistics.totalAmount || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyNIF">NIF da Empresa *</Label>
                  <Input
                    id="companyNIF"
                    value={config.companyInfo.nif}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, nif: e.target.value }
                    }))}
                    placeholder="123456789"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Nome da Empresa *</Label>
                  <Input
                    id="companyName"
                    value={config.companyInfo.name}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, name: e.target.value }
                    }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={config.companyInfo.address}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, address: e.target.value }
                  }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={config.companyInfo.city}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, city: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={config.companyInfo.postalCode || ''}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, postalCode: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações do Software */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informações do Software
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="softwareName">Nome do Software</Label>
                  <Input
                    id="softwareName"
                    value={config.softwareInfo.name}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      softwareInfo: { ...prev.softwareInfo, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="softwareVersion">Versão</Label>
                  <Input
                    id="softwareVersion"
                    value={config.softwareInfo.version}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      softwareInfo: { ...prev.softwareInfo, version: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="certificateNumber">Número do Certificado AGT *</Label>
                  <Input
                    id="certificateNumber"
                    value={config.softwareInfo.certificateNumber}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      softwareInfo: { ...prev.softwareInfo, certificateNumber: e.target.value }
                    }))}
                    placeholder="Número atribuído pela AGT"
                  />
                </div>
                <div>
                  <Label htmlFor="softwareCompanyNIF">NIF da Empresa do Software *</Label>
                  <Input
                    id="softwareCompanyNIF"
                    value={config.softwareInfo.companyNIF}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      softwareInfo: { ...prev.softwareInfo, companyNIF: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Painel Lateral */}
        <div className="space-y-6">
          {/* Segurança Criptográfica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Segurança Criptográfica
              </CardTitle>
              <CardDescription>
                Chaves RSA para assinatura digital
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                {hasKeys ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className={hasKeys ? 'text-green-700' : 'text-red-700'}>
                  {hasKeys ? 'Chaves configuradas' : 'Chaves não configuradas'}
                </span>
              </div>

              {!hasKeys ? (
                <Button onClick={generateKeys} className="w-full" disabled={isExporting}>
                  <Key className="w-4 h-4 mr-2" />
                  Gerar Chaves RSA
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button onClick={() => exportPublicKey('txt')} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Chave (.txt)
                  </Button>
                  <Button onClick={() => exportPublicKey('pem')} variant="outline" className="w-full text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Exportar PEM
                  </Button>
                </div>
              )}

              {hasKeys && (
                <Alert>
                  <Shield className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    Registe a chave pública na AGT para certificação do software.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Opções de Exportação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Dados a Incluir
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCustomers"
                    checked={config.includeCustomers}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      includeCustomers: !!checked 
                    }))}
                  />
                  <Label htmlFor="includeCustomers">Clientes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeProducts"
                    checked={config.includeProducts}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      includeProducts: !!checked 
                    }))}
                  />
                  <Label htmlFor="includeProducts">Produtos/Serviços</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeInvoices"
                    checked={config.includeInvoices}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      includeInvoices: !!checked 
                    }))}
                  />
                  <Label htmlFor="includeInvoices">Faturas</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includePayments"
                    checked={config.includePayments}
                    onCheckedChange={(checked) => setConfig(prev => ({ 
                      ...prev, 
                      includePayments: !!checked 
                    }))}
                  />
                  <Label htmlFor="includePayments">Pagamentos</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão de Exportação */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleExport} 
                className="w-full" 
                size="lg"
                disabled={isExporting || !hasKeys}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exportando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Gerar SAFT-AO
                  </>
                )}
              </Button>

              {isExporting && (
                <div className="mt-4">
                  <Progress value={exportProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    {exportProgress}% concluído
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Erros de Validação */}
      {validationErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Erros de validação:</div>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Resultado da Exportação */}
      {exportResult && (
        <Alert variant={exportResult.success ? "default" : "destructive"}>
          {exportResult.success ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          <AlertDescription>
            <div className="font-medium mb-2">{exportResult.message}</div>
            {exportResult.success && exportResult.fileName && (
              <div className="text-sm">
                Ficheiro: {exportResult.fileName} ({Math.round((exportResult.fileSize || 0) / 1024)} KB)
              </div>
            )}
            {exportResult.errors && exportResult.errors.length > 0 && (
              <ul className="list-disc list-inside space-y-1 mt-2">
                {exportResult.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
