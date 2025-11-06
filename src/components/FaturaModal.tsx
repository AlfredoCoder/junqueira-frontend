import React from 'react';
import { X } from 'lucide-react';
import FaturaTermica from './FaturaTermica';

interface FaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  dadosPagamento?: {
    codigo: number;
    fatura: string;
    data: string;
    preco: number;
    aluno: {
      nome: string;
      codigo: number;
      curso?: string;
      classe?: string;
      turma?: string;
    };
    tipoServico: {
      designacao: string;
    };
    formaPagamento?: {
      designacao: string;
    };
    observacao?: string;
    operador?: string;
    mesesPagos?: string[];
    servicos?: Array<{
      descricao: string;
      quantidade: number;
      precoUnitario: number;
      total: number;
    }>;
  };
}

export default function FaturaModal({ isOpen, onClose, dadosPagamento }: FaturaModalProps) {
  if (!isOpen || !dadosPagamento) return null;

  // Converter dados do pagamento para o formato da fatura térmica
  const dadosFatura = {
    numeroFatura: dadosPagamento.fatura,
    dataEmissao: new Date(dadosPagamento.data).toLocaleString('pt-BR'),
    aluno: {
      nome: dadosPagamento.aluno.nome,
      curso: dadosPagamento.aluno.curso || "Curso não especificado",
      classe: dadosPagamento.aluno.classe || "Classe não especificada",
      turma: dadosPagamento.aluno.turma || "Turma não especificada"
    },
    servicos: dadosPagamento.servicos || [
      {
        descricao: dadosPagamento.tipoServico.designacao,
        quantidade: 1,
        precoUnitario: dadosPagamento.preco,
        total: dadosPagamento.preco
      }
    ],
    formaPagamento: dadosPagamento.formaPagamento?.designacao || "DINHEIRO",
    subtotal: dadosPagamento.preco,
    iva: 0.00,
    desconto: 0.00,
    totalPagar: dadosPagamento.preco,
    totalPago: dadosPagamento.preco,
    pagoEmSaldo: 0.00,
    saldoAtual: 0.00,
    operador: dadosPagamento.operador || "Sistema"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Fatura Gerada
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Pagamento processado com sucesso!
            </p>
            <p className="text-xs text-gray-500">
              Código do Pagamento: {dadosPagamento.codigo}
            </p>
          </div>

          {/* Fatura Térmica */}
          <FaturaTermica dadosFatura={dadosFatura} />
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
