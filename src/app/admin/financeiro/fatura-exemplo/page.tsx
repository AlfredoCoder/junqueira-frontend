"use client";

import React, { useState } from 'react';
import FaturaTermica from '@/components/FaturaTermica';
import FaturaModal from '@/components/FaturaModal';

export default function FaturaExemploPage() {
  const [showModal, setShowModal] = useState(false);

  // Dados de exemplo para a fatura
  const dadosFaturaExemplo = {
    numeroFatura: "FAT_1759555442665",
    dataEmissao: "04/10/2025 07:18:16",
    aluno: {
      nome: "ABRÃO GOMES BUMBA MACAIA",
      curso: "Enfermagem Geral",
      classe: "13ª Classe",
      turma: "13ª E.G. VESP."
    },
    servicos: [
      {
        descricao: "PROPINA 13ª CLASSE E.G",
        quantidade: 1,
        precoUnitario: 25000.00,
        total: 25000.00
      },
      {
        descricao: "TAXA DE MATRÍCULA",
        quantidade: 1,
        precoUnitario: 5000.00,
        total: 5000.00
      }
    ],
    formaPagamento: "TRANSFERÊNCIA BANCÁRIA",
    subtotal: 30000.00,
    iva: 0.00,
    desconto: 2000.00,
    totalPagar: 28000.00,
    totalPago: 28000.00,
    pagoEmSaldo: 0.00,
    saldoAtual: 0.00,
    operador: "Alfredo"
  };

  // Dados de exemplo para o modal
  const dadosPagamentoExemplo = {
    codigo: 66475,
    fatura: "FAT_1759555442665",
    data: "2025-10-04T07:18:16.000Z",
    preco: 25000,
    aluno: {
      nome: "ABRÃO GOMES BUMBA MACAIA",
      codigo: 1226
    },
    tipoServico: {
      designacao: "PROPINA 13ª CLASSE E.G"
    },
    formaPagamento: {
      designacao: "TRANSFERÊNCIA BANCÁRIA"
    },
    observacao: "Pagamento de propina",
    operador: "Alfredo"
  };

  return (
    <div className="container mx-auto p-6 space-y-8 ultra-fast-fade">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Componente de Fatura Térmica
        </h1>
        <p className="text-gray-600">
          Exemplo de fatura escolar em formato de papel térmico (80mm)
        </p>
      </div>

      {/* Botões de Demonstração */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Mostrar Modal com Fatura
        </button>
      </div>

      {/* Seção de Demonstração */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Visualização da Fatura Térmica
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Esta é uma representação visual de como a fatura aparecerá quando impressa em papel térmico de 80mm.
        </p>
        
        <div className="flex justify-center">
          <FaturaTermica dadosFatura={dadosFaturaExemplo} />
        </div>
      </div>

      {/* Informações Técnicas */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Características Técnicas
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Layout:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Largura fixa: 80mm (padrão térmico)</li>
              <li>• Fonte monoespaçada (Courier New)</li>
              <li>• Linhas divisórias para separação</li>
              <li>• Layout responsivo para impressão</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Funcionalidades:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Impressão otimizada (window.print)</li>
              <li>• Dados dinâmicos via props</li>
              <li>• Formatação automática de moeda</li>
              <li>• Múltiplos serviços na tabela</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exemplo de Código */}
      <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Exemplo de Uso:</h3>
        <pre className="text-sm">
{`import FaturaTermica from '@/components/FaturaTermica';

const dadosFatura = {
  numeroFatura: "FAT_1759555442665",
  dataEmissao: "04/10/2025 07:18:16",
  aluno: {
    nome: "ABRÃO GOMES BUMBA MACAIA",
    curso: "Enfermagem Geral",
    classe: "13ª Classe",
    turma: "13ª E.G. VESP."
  },
  servicos: [
    {
      descricao: "PROPINA 13ª CLASSE E.G",
      quantidade: 1,
      precoUnitario: 25000.00,
      total: 25000.00
    }
  ],
  formaPagamento: "TRANSFERÊNCIA BANCÁRIA",
  // ... outros campos
};

<FaturaTermica dadosFatura={dadosFatura} />`}
        </pre>
      </div>

      {/* Modal de Fatura */}
      <FaturaModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        dadosPagamento={dadosPagamentoExemplo}
      />
    </div>
  );
}
