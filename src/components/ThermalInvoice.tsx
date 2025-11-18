import React, { useCallback } from 'react';
import { getDadosFatura } from '@/config/empresa.config';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

export interface ThermalInvoiceData {
  pagamento: {
    codigo: number;
    fatura: string;
    data: string;
    mes: string;
    ano: number;
    preco: number;
    observacao: string;
    aluno: {
      codigo: number;
      nome: string;
      n_documento_identificacao: string;
      email: string;
      telefone: string;
      tb_matriculas?: {
        tb_cursos?: {
          designacao: string;
        };
        tb_confirmacoes?: Array<{
          tb_turmas?: {
            designacao: string;
            tb_classes?: {
              designacao: string;
            };
          };
        }>;
      };
    };
    tipoServico: {
      designacao: string;
    };
    formaPagamento: {
      designacao: string;
    };
    contaMovimentada?: string;
    n_Bordoro?: string;
    mesesPagos?: string[];
  };
  operador?: string;
}

interface ThermalInvoiceProps {
  data: ThermalInvoiceData;
  onPrint?: () => void;
  onDownload?: () => void;
  showActions?: boolean;
}

export default function ThermalInvoice({ 
  data, 
  onPrint, 
  onDownload, 
  showActions = true 
}: ThermalInvoiceProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const handlePrint = useCallback(() => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  }, []);
  // Extrair informações do curso e turma
  const curso = data.pagamento.aluno.tb_matriculas?.tb_cursos?.designacao || '';
  const confirmacao = data.pagamento.aluno.tb_matriculas?.tb_confirmacoes?.[0];
  const turma = confirmacao?.tb_turmas?.designacao || '';
  const classe = confirmacao?.tb_turmas?.tb_classes?.designacao || '';

  return (
    <div className="bg-white">
      {/* Ações de impressão - só aparecem na tela */}
      {showActions && (
        <div className="flex justify-center gap-3 mb-4 print:hidden">
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          {onDownload && (
            <Button
              onClick={onDownload}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      )}

      {/* Fatura térmica */}
      <div 
        className="bg-white text-black p-1 mx-auto border border-gray-300 print:border-0" 
        style={{ 
          width: "80mm", 
          minHeight: "auto", 
          fontFamily: "monospace", 
          fontSize: "13px", 
          lineHeight: "1.2",
          color: "#000000",
          fontWeight: "600" // Intensifica todo o texto
        }}
      >
        {/* Cabeçalho */}
        <div className="text-center border-b border-dashed border-gray-600 pb-1 mb-2">
          <h2 className="font-black text-xl leading-tight mb-0.5" style={{color: "#000", fontWeight: "900"}}>
            Complexo Escolar Privado Abilio junqueira
          </h2>
          <p className="font-bold text-sm" style={{color: "#000"}}>NIF: 000036970ME010</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Talatona, Bairro Mirantes - Rua D - Travessa 12</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Tlf: 923336102, 946309668</p>
          <p className="font-black text-sm" style={{color: "#000"}}>Data: {formatDate(data.pagamento.data)}</p>
        </div>

        {/* Dados do Aluno */}
        <div className="mb-2 space-y-0.5">
          <p className="font-black text-sm" style={{color: "#000", fontWeight: "900"}}>
            <strong>Aluno(a):</strong> {data.pagamento.aluno.nome}
          </p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Consumidor Final</p>
          {curso && <p className="font-bold text-sm" style={{color: "#000"}}>{curso}</p>}
          {classe && turma && <p className="font-bold text-sm" style={{color: "#000"}}>{classe} - {turma}</p>}
          {data.pagamento.aluno.n_documento_identificacao && (
            <p className="font-bold text-sm" style={{color: "#000"}}>Doc: {data.pagamento.aluno.n_documento_identificacao}</p>
          )}
        </div>

        {/* Tabela de serviços */}
        <table className="w-full border-t border-b border-dashed border-gray-600 my-2">
          <thead>
            <tr className="text-left">
              <th className="w-1/2 font-black text-sm py-0.5" style={{color: "#000", fontWeight: "900"}}>Serviços</th>
              <th className="text-right font-black text-sm py-0.5" style={{color: "#000", fontWeight: "900"}}>Qtd</th>
              <th className="text-right font-black text-sm py-0.5" style={{color: "#000", fontWeight: "900"}}>P.Unit</th>
              <th className="text-right font-black text-sm py-0.5" style={{color: "#000", fontWeight: "900"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-0.5 font-bold text-sm" style={{color: "#000"}}>{data.pagamento.tipoServico.designacao}</td>
              <td className="text-right py-0.5 font-bold text-sm" style={{color: "#000"}}>1</td>
              <td className="text-right py-0.5 font-black text-sm" style={{color: "#000", fontWeight: "900"}}>{formatCurrency(data.pagamento.preco)}</td>
              <td className="text-right py-0.5 font-black text-sm" style={{color: "#000", fontWeight: "900"}}>{formatCurrency(data.pagamento.preco)}</td>
            </tr>
          </tbody>
        </table>

        {/* Totais */}
        <div className="space-y-0.5 mb-2">
          <p className="font-bold text-sm" style={{color: "#000"}}>Forma de Pagamento: {data.pagamento.formaPagamento.designacao}</p>
          
          {/* Informações bancárias apenas para depósitos */}
          {data.pagamento.contaMovimentada && (
            <p className="font-bold text-sm" style={{color: "#000"}}>Conta Bancária: {data.pagamento.contaMovimentada}</p>
          )}
          {data.pagamento.n_Bordoro && (
            <p className="font-bold text-sm" style={{color: "#000"}}>Nº Borderô: {data.pagamento.n_Bordoro}</p>
          )}
          
          {/* Meses pagos */}
          {data.pagamento.mesesPagos && data.pagamento.mesesPagos.length > 0 && (
            <p className="font-bold text-sm" style={{color: "#000"}}>Meses: {data.pagamento.mesesPagos.join(', ')}</p>
          )}
          
          <p className="font-black text-sm" style={{color: "#000", fontWeight: "900"}}>Total: {formatCurrency(data.pagamento.preco)}</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Total IVA: 0.00</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>N.º de Itens: {data.pagamento.mesesPagos?.length || 1}</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Desconto: 0.00</p>
          <p className="font-black text-sm" style={{color: "#000", fontWeight: "900"}}>A Pagar: {formatCurrency(data.pagamento.preco)}</p>
          <p className="font-black text-sm" style={{color: "#000", fontWeight: "900"}}>Total Pago: {formatCurrency(data.pagamento.preco)}</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Pago em Saldo: 0.00</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Saldo Actual: 0.00</p>
        </div>

        {/* Observações */}
        {data.pagamento.observacao && (
          <div className="border-t border-dashed border-gray-400 pt-1 mb-2">
            <p className="font-bold text-sm" style={{color: "#000"}}><strong style={{fontWeight: "900"}}>Obs:</strong> {data.pagamento.observacao}</p>
          </div>
        )}

        {/* Rodapé */}
        <div className="text-center border-t border-dashed border-gray-400 pt-1 space-y-0.5">
          <p className="font-bold text-sm" style={{color: "#000"}}>Operador: {data.operador || 'Sistema'}</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Emitido em: {formatDate(data.pagamento.data)}</p>
          <p className="font-black text-sm" style={{color: "#000", fontWeight: "900"}}>Fatura: {data.pagamento.fatura}</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>REGIME SIMPLIFICADO</p>
          <p className="font-bold text-sm" style={{color: "#000"}}>Processado pelo computador</p>
        </div>

        {/* Selo de Pago */}
        <div className="text-center mt-2">
          <span className="font-black text-lg border-2 border-blue-800 px-3 py-1 rounded" style={{color: "#000080", fontWeight: "900", borderColor: "#000080"}}>PAGO</span>
        </div>
      </div>

      {/* Estilos de impressão */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          
          .thermal-invoice, .thermal-invoice * {
            visibility: visible;
          }
          
          .thermal-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            margin: 0 !important;
            padding: 3mm !important;
            font-size: 12px !important;
            line-height: 1.3 !important;
          }
          
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
