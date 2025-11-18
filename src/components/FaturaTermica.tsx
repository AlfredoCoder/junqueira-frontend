import React, { useCallback } from 'react';
import { Printer } from 'lucide-react';
import { getDadosFatura, formatarTelefones } from '@/config/empresa.config';

interface FaturaTermicaProps {
  dadosFatura?: {
    numeroFatura: string;
    dataEmissao: string;
    aluno: {
      nome: string;
      curso: string;
      classe: string;
      turma: string;
    };
    servicos: Array<{
      descricao: string;
      quantidade: number;
      precoUnitario: number;
      total: number;
    }>;
    formaPagamento: string;
    subtotal: number;
    iva: number;
    desconto: number;
    totalPagar: number;
    totalPago: number;
    pagoEmSaldo: number;
    saldoAtual: number;
    operador: string;
  };
}

export default function FaturaTermica({ dadosFatura }: FaturaTermicaProps) {
  // Obter dados da empresa
  const dadosEmpresa = getDadosFatura();
  
  // Dados padrão caso não sejam fornecidos
  const dados = dadosFatura || {
    numeroFatura: "FAT_1759555442665",
    dataEmissao: "25/09/2025 00:00:00",
    aluno: {
      nome: "FELICIDADE NDULO MABIALA",
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
    formaPagamento: "DEPÓSITO",
    subtotal: 25000.00,
    iva: 0.00,
    desconto: 0.00,
    totalPagar: 25000.00,
    totalPago: 25000.00,
    pagoEmSaldo: 0.00,
    saldoAtual: 0.00,
    operador: "Angelo"
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-AO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleImprimir = useCallback(() => {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fatura - ${dados.numeroFatura}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 13px;
              font-weight: 600;
              line-height: 1.3;
              margin: 0;
              padding: 6px;
              width: 80mm;
              background: white;
              color: #000;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 6px;
              margin-bottom: 6px;
            }
            .header h2 {
              font-size: 14px;
              font-weight: 900;
              margin: 0 0 3px 0;
              color: #000;
            }
            .header p {
              margin: 1px 0;
              font-size: 11px;
              font-weight: bold;
              color: #000;
            }
            .aluno {
              margin-bottom: 6px;
              font-size: 11px;
            }
            .aluno p {
              margin: 1px 0;
              font-weight: bold;
              color: #000;
            }
            .aluno p strong {
              font-weight: 900;
            }
            .servicos-table {
              width: 100%;
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              margin: 6px 0;
              border-collapse: collapse;
            }
            .servicos-table th,
            .servicos-table td {
              padding: 2px 3px;
              font-size: 10px;
              font-weight: 900;
              color: #000;
              text-align: left;
            }
            .servicos-table th {
              border-bottom: 1px solid #000;
              font-weight: 900;
            }
            .text-right {
              text-align: right;
            }
            .totais {
              font-size: 11px;
              margin: 6px 0;
            }
            .totais p {
              margin: 1px 0;
              font-weight: bold;
              color: #000;
            }
            .total-destaque {
              font-weight: 900;
              color: #000;
            }
            .rodape {
              text-align: center;
              border-top: 2px solid #000;
              padding-top: 6px;
              margin-top: 8px;
              font-size: 10px;
            }
            .rodape p {
              margin: 1px 0;
              font-weight: bold;
              color: #000;
            }
            .selo-pago {
              text-align: center;
              margin-top: 12px;
            }
            .selo-pago span {
              font-weight: 900;
              font-size: 18px;
              color: #000080;
              border: 2px solid #000080;
              padding: 4px 8px;
              border-radius: 4px;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/assets/images/icon.png" alt="Logo" style="width: 35px; height: auto; margin-bottom: 4px;" />
            <h2>${dadosEmpresa.empresa.nome}</h2>
            <p>NIF: ${dadosEmpresa.empresa.nif}</p>
            <p>${dadosEmpresa.empresa.endereco}</p>
            <p>Tlf: ${dadosEmpresa.empresa.telefones.join(' | ')}</p>
            <p>Data: ${dados.dataEmissao}</p>
            <p>Fatura: ${dados.numeroFatura}</p>
          </div>

          <div class="aluno">
            <p><strong>Aluno(a):</strong> ${dados.aluno.nome}</p>
            <p><strong>Consumidor Final</strong></p>
            <p><strong>${dados.aluno.curso}</strong></p>
            <p><strong>${dados.aluno.classe} - ${dados.aluno.turma}</strong></p>
          </div>

          <table class="servicos-table">
            <thead>
              <tr>
                <th style="width: 50%">Serviços</th>
                <th class="text-right" style="width: 15%">Qtd</th>
                <th class="text-right" style="width: 17.5%">P.Unit</th>
                <th class="text-right" style="width: 17.5%">Total</th>
              </tr>
            </thead>
            <tbody>
              ${dados.servicos.map(servico => `
                <tr>
                  <td>${servico.descricao}</td>
                  <td class="text-right">${servico.quantidade}</td>
                  <td class="text-right">${formatarMoeda(servico.precoUnitario)}</td>
                  <td class="text-right">${formatarMoeda(servico.total)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totais">
            <p>Forma de Pagamento: ${dados.formaPagamento}</p>
            <p class="total-destaque">Total: ${formatarMoeda(dados.subtotal)}</p>
            <p>Total IVA: ${formatarMoeda(dados.iva)}</p>
            <p>N.º de Itens: ${dados.servicos.length}</p>
            <p>Desconto: ${formatarMoeda(dados.desconto)}</p>
            <p class="total-destaque">A Pagar: ${formatarMoeda(dados.totalPagar)}</p>
            <p class="total-destaque">Total Pago: ${formatarMoeda(dados.totalPago)}</p>
            <p>Pago em Saldo: ${formatarMoeda(dados.pagoEmSaldo)}</p>
            <p>Saldo Actual: ${formatarMoeda(dados.saldoAtual)}</p>
          </div>

          <div class="rodape">
            <p>Operador: ${dados.operador}</p>
            <p>Emitido em: ${dados.dataEmissao.split(' ')[0]}</p>
            <p>${dadosEmpresa.fiscal.regime}</p>
            <p>Processado pelo computador</p>
          </div>

          <div class="selo-pago">
            <span>PAGO</span>
          </div>
        </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Aguardar o carregamento e imprimir
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }, [dados]);

  return (
    <div className="flex flex-col items-center space-y-4 ultra-fast-fade">
      {/* Botão de Impressão */}
      <button
        onClick={handleImprimir}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors print:hidden"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimir Fatura</span>
      </button>

      {/* Fatura Térmica */}
      <div 
        className="bg-white text-black p-4 border border-gray-300 shadow-lg print:shadow-none print:border-none" 
        style={{ 
          width: "105mm", 
          height: "148mm",
          fontFamily: "'Courier New', monospace",
          fontSize: "10px",
          lineHeight: "1.3"
        }}
      >
        {/* Cabeçalho */}
        <div className="text-center text-sm border-b border-black pb-2 mb-2">
          <img src="/assets/images/icon.png" alt="Logo" style={{ width: "40px", height: "auto", marginBottom: "5px" }} />
          <h2 className="font-bold text-base mb-1">{dadosEmpresa.empresa.nome}</h2>
          <p className="text-xs">NIF: {dadosEmpresa.empresa.nif}</p>
          <p className="text-xs">{dadosEmpresa.empresa.endereco}</p>
          <p className="text-xs">Tlf: {dadosEmpresa.empresa.telefones.join(' | ')}</p>
          <p className="text-xs">Data: {dados.dataEmissao}</p>
          <p className="text-xs">Fatura: {dados.numeroFatura}</p>
        </div>

        {/* Dados do Aluno */}
        <div className="text-xs mb-2 space-y-1 ultra-fast-fade">
          <p><strong>Aluno(a):</strong> {dados.aluno.nome}</p>
          <p>Consumidor Final</p>
          <p>{dados.aluno.curso}</p>
          <p>{dados.aluno.classe} - {dados.aluno.turma}</p>
        </div>

        {/* Tabela de serviços */}
        <table className="w-full text-xs border-t border-b border-black my-2">
          <thead>
            <tr className="text-left border-b border-black">
              <th className="py-1 px-1" style={{ width: "50%" }}>Serviços</th>
              <th className="text-right py-1 px-1" style={{ width: "15%" }}>Qtd</th>
              <th className="text-right py-1 px-1" style={{ width: "17.5%" }}>P.Unit</th>
              <th className="text-right py-1 px-1" style={{ width: "17.5%" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {dados.servicos.map((servico, index) => (
              <tr key={index}>
                <td className="py-1 px-1">{servico.descricao}</td>
                <td className="text-right py-1 px-1">{servico.quantidade}</td>
                <td className="text-right py-1 px-1">{formatarMoeda(servico.precoUnitario)}</td>
                <td className="text-right py-1 px-1">{formatarMoeda(servico.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totais */}
        <div className="text-xs space-y-1 ultra-fast-fade">
          <p>Forma de Pagamento: {dados.formaPagamento}</p>
          <p>Total: {formatarMoeda(dados.subtotal)}</p>
          <p>Total IVA: {formatarMoeda(dados.iva)}</p>
          <p>N.º de Itens: {dados.servicos.length}</p>
          <p>Desconto: {formatarMoeda(dados.desconto)}</p>
          <p>A Pagar: {formatarMoeda(dados.totalPagar)}</p>
          <p>Total Pago: {formatarMoeda(dados.totalPago)}</p>
          <p>Pago em Saldo: {formatarMoeda(dados.pagoEmSaldo)}</p>
          <p>Saldo Actual: {formatarMoeda(dados.saldoAtual)}</p>
        </div>

        {/* Rodapé */}
        <div className="text-center text-xs border-t border-black mt-3 pt-2 space-y-1 ultra-fast-fade">
          <p>Operador: {dados.operador}</p>
          <p>Emitido em: {dados.dataEmissao.split(' ')[0]}</p>
          <p>{dadosEmpresa.fiscal.regime}</p>
          <p>Processado pelo computador</p>
        </div>

        {/* Selo de Pago */}
        <div className="text-center mt-4">
          <span className="text-blue-600 font-bold text-lg">[ PAGO ]</span>
        </div>
      </div>
    </div>
  );
}
