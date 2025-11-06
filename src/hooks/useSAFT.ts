import { useState, useEffect } from 'react';
import SAFTService from '@/services/saft.service';
import SAFTValidatorService, { IValidationResult } from '@/services/saft-validator.service';
import CryptoService from '@/services/crypto.service';
import { ISAFTExportConfig, ISAFTExportResponse, ISAFTFile } from '@/types/saft.types';

export const useSAFT = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  const exportSAFT = async (config: ISAFTExportConfig): Promise<ISAFTExportResponse> => {
    setIsLoading(true);
    setError(null);
    setExportProgress(0);

    try {
      // Simular progresso durante a exportação
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const result = await SAFTService.exportSAFT(config);
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao exportar SAFT';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
      setTimeout(() => setExportProgress(0), 2000);
    }
  };

  const validateConfig = async (config: ISAFTExportConfig) => {
    try {
      return await SAFTService.validateExportConfig(config);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar configuração');
      return { valid: false, errors: [err.message] };
    }
  };

  const validateSAFTFile = (saftFile: ISAFTFile): IValidationResult => {
    try {
      return SAFTValidatorService.validateSAFTFile(saftFile);
    } catch (err: any) {
      setError(err.message || 'Erro ao validar ficheiro SAFT');
      return {
        valid: false,
        errors: [{ code: 'VALIDATION_ERROR', message: err.message, severity: 'error' as const }],
        warnings: [],
        summary: { totalErrors: 1, totalWarnings: 0, criticalErrors: 1 }
      };
    }
  };

  const getStatistics = async (startDate: string, endDate: string) => {
    try {
      return await SAFTService.getExportStatistics(startDate, endDate);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar estatísticas');
      return null;
    }
  };

  const generateKeys = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const keyPair = await CryptoService.generateKeyPair();
      
      // Salvar chaves no localStorage
      localStorage.setItem('saft_private_key', keyPair.privateKey);
      localStorage.setItem('saft_public_key', keyPair.publicKey);
      
      return keyPair;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao gerar chaves';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPublicKey = () => {
    try {
      const publicKey = localStorage.getItem('saft_public_key');
      if (!publicKey) {
        throw new Error('Chave pública não encontrada');
      }

      const pemKey = CryptoService.exportPublicKeyPEM();
      const blob = new Blob([pemKey], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chave_publica_saft.pem';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao exportar chave pública');
      return false;
    }
  };

  const checkKeys = () => {
    const hasPrivateKey = localStorage.getItem('saft_private_key');
    const hasPublicKey = localStorage.getItem('saft_public_key');
    return !!(hasPrivateKey && hasPublicKey);
  };

  const clearKeys = () => {
    localStorage.removeItem('saft_private_key');
    localStorage.removeItem('saft_public_key');
  };

  const downloadFile = (downloadUrl: string, fileName: string) => {
    try {
      SAFTService.downloadSAFTFile(downloadUrl, fileName);
      return true;
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer download');
      return false;
    }
  };

  const generateValidationReport = (validationResult: IValidationResult): string => {
    return SAFTValidatorService.generateValidationReport(validationResult);
  };

  return {
    isLoading,
    error,
    exportProgress,
    exportSAFT,
    validateConfig,
    validateSAFTFile,
    getStatistics,
    generateKeys,
    exportPublicKey,
    checkKeys,
    clearKeys,
    downloadFile,
    generateValidationReport,
    clearError: () => setError(null)
  };
};

// Hook para configuração padrão do SAFT
export const useDefaultSAFTConfig = () => {
  const [config, setConfig] = useState<ISAFTExportConfig>({
    startDate: '',
    endDate: '',
    includeCustomers: true,
    includeProducts: true,
    includeInvoices: true,
    includePayments: true,
    companyInfo: {
      nif: '',
      name: '',
      address: '',
      city: 'Luanda',
      postalCode: '',
      phone: '',
      email: ''
    },
    softwareInfo: {
      name: 'Sistema Complexo Abilio Junqueira',
      version: '1.0.0',
      certificateNumber: '',
      companyNIF: ''
    }
  });

  useEffect(() => {
    // Definir datas padrão (mês atual)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setConfig(prev => ({
      ...prev,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0]
    }));

    // Carregar informações da empresa se disponível
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const companyData = await SAFTService.getCompanyInfo();
      if (companyData?.data) {
        setConfig(prev => ({
          ...prev,
          companyInfo: {
            nif: companyData.data.nif || prev.companyInfo.nif,
            name: companyData.data.nome || prev.companyInfo.name,
            address: companyData.data.endereco || prev.companyInfo.address,
            city: companyData.data.cidade || prev.companyInfo.city,
            postalCode: companyData.data.codigoPostal || prev.companyInfo.postalCode,
            phone: companyData.data.telefone || prev.companyInfo.phone,
            email: companyData.data.email || prev.companyInfo.email
          }
        }));
      }
    } catch (error) {
      console.warn('Erro ao carregar informações da empresa:', error);
    }
  };

  const updateConfig = (updates: Partial<ISAFTExportConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const updateCompanyInfo = (updates: Partial<ISAFTExportConfig['companyInfo']>) => {
    setConfig(prev => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...updates }
    }));
  };

  const updateSoftwareInfo = (updates: Partial<ISAFTExportConfig['softwareInfo']>) => {
    setConfig(prev => ({
      ...prev,
      softwareInfo: { ...prev.softwareInfo, ...updates }
    }));
  };

  return {
    config,
    updateConfig,
    updateCompanyInfo,
    updateSoftwareInfo,
    setConfig
  };
};
