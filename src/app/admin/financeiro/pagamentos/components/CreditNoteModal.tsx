'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { X, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { useCreditNotes } from '@/hooks/useCreditNotes';

interface CreditNoteModalProps {
  open: boolean;
  onClose: () => void;
  payment: any;
  onSuccess?: () => void;
}

const CreditNoteModal: React.FC<CreditNoteModalProps> = ({
  open,
  onClose,
  payment,
  onSuccess
}) => {
  const { createCreditNote, loading, error } = useCreditNotes();
  const [formData, setFormData] = useState({
    designacao: '',
    descricao: '',
    valor: '',
    documento: '',
    next: ''
  });

  // Gerar número automático da nota de crédito
  const generateNextNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return `NC AGT${currentYear}/${randomNumber}`;
  };

  // Preencher dados quando o modal abrir
  useEffect(() => {
    if (open && payment) {
      // Encurtar textos para caber nos limites do banco atual
      const designacao = `Anulação ${payment.fatura}`.substring(0, 40);
      const descricao = `Anulação ${payment.mes} - ${payment.aluno?.nome?.substring(0, 20)}`.substring(0, 40);
      
      setFormData({
        designacao,
        descricao,
        valor: payment.preco?.toString() || '0',
        documento: payment.fatura?.substring(0, 40) || '',
        next: generateNextNumber()
      });
    }
  }, [open, payment]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!payment) return;

    try {
      // Criar nota de crédito
      const creditNoteData = {
        designacao: formData.designacao,
        fatura: payment.fatura,
        descricao: formData.descricao,
        valor: formData.valor,
        codigo_aluno: payment.aluno?.codigo || payment.codigo_aluno,
        documento: formData.documento,
        next: formData.next,
        dataOperacao: new Date().toISOString().split('T')[0],
        codigoPagamentoi: payment.codigo
      };

      console.log('Criando nota de crédito:', creditNoteData);

      const result = await createCreditNote(creditNoteData);
      
      console.log('Nota de crédito criada com sucesso:', result);
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (err: any) {
      console.error('Erro ao criar nota de crédito:', err);
      // O erro já está sendo gerenciado pelo hook
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-red-600" />
            <span>Criar Nota de Crédito</span>
          </DialogTitle>
          <DialogDescription>
            Preencha os dados para anular a fatura e reverter o pagamento
          </DialogDescription>
        </DialogHeader>

        {/* Informações do Pagamento */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium text-gray-900 mb-2">Informações do Pagamento</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Aluno:</span>
              <p className="font-medium">{payment.aluno?.nome}</p>
            </div>
            <div>
              <span className="text-gray-600">Documento:</span>
              <p className="font-medium">{payment.aluno?.n_documento_identificacao}</p>
            </div>
            <div>
              <span className="text-gray-600">Serviço:</span>
              <p className="font-medium">{payment.tipoServico?.designacao}</p>
            </div>
            <div>
              <span className="text-gray-600">Mês/Ano:</span>
              <p className="font-medium">{payment.mes}</p>
            </div>
            <div>
              <span className="text-gray-600">Valor:</span>
              <p className="font-medium text-green-600">{formatCurrency(payment.preco)}</p>
            </div>
            <div>
              <span className="text-gray-600">Fatura:</span>
              <p className="font-medium">{payment.fatura}</p>
            </div>
          </div>
        </div>

        {/* Alerta de Aviso */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção:</strong> Esta ação irá anular permanentemente a fatura e reverter o pagamento. 
            Os meses pagos serão revertidos no histórico do aluno. Esta operação não pode ser desfeita.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número da Nota de Crédito */}
          <div>
            <Label htmlFor="next">Número da Nota de Crédito</Label>
            <Input
              id="next"
              value={formData.next}
              onChange={(e) => handleInputChange('next', e.target.value)}
              placeholder="NC AGT2024/1"
              required
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Gerado automaticamente</p>
          </div>

          {/* Designação */}
          <div>
            <Label htmlFor="designacao">Designação</Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleInputChange('designacao', e.target.value.substring(0, 40))}
              placeholder="Motivo da anulação"
              required
              maxLength={40}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.designacao.length}/40 caracteres</p>
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="descricao">Descrição Detalhada</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => handleInputChange('descricao', e.target.value.substring(0, 40))}
              placeholder="Descreva o motivo detalhado da anulação..."
              rows={3}
              required
              maxLength={40}
            />
            <p className="text-xs text-gray-500 mt-1">{formData.descricao.length}/40 caracteres</p>
          </div>

          {/* Valor */}
          <div>
            <Label htmlFor="valor">Valor a Anular</Label>
            <Input
              id="valor"
              value={formData.valor}
              onChange={(e) => handleInputChange('valor', e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              required
              disabled
              className="bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">Valor original do pagamento</p>
          </div>

          {/* Documento */}
          <div>
            <Label htmlFor="documento">Documento de Referência</Label>
            <Input
              id="documento"
              value={formData.documento}
              onChange={(e) => handleInputChange('documento', e.target.value)}
              placeholder="Número da fatura original"
              required
              disabled
              className="bg-gray-100"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 loading-spinner"></div>
                  Processando...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Anular Fatura
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreditNoteModal;
