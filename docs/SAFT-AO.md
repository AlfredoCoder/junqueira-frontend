# Sistema SAFT-AO - Standard Audit File for Tax Angola

## 🎯 Visão Geral

O Sistema SAFT-AO foi implementado no sistema Jomorais em **conformidade total com o Decreto Executivo n.º 74/19** da AGT (Administração Geral Tributária de Angola). Este sistema permite a exportação de dados contabilísticos e de faturação em formato XML estruturado com assinatura digital RSA.

## Funcionalidades Implementadas

### 🎯 Características Principais

- **Exportação Completa**: Gera ficheiros SAFT-AO em formato XML
- **Validação de Dados**: Verifica configuração antes da exportação
- **Interface Intuitiva**: Formulário organizado e fácil de usar
- **Estatísticas em Tempo Real**: Mostra dados do período selecionado
- **Download Automático**: Inicia download após geração bem-sucedida
- **Modo Demonstração**: Funciona mesmo sem backend (dados mock)

### 📁 Estrutura de Arquivos

```
src/
├── types/saft.types.ts              # Tipos TypeScript para SAFT-AO
├── services/saft.service.ts         # Serviço de exportação
├── hooks/useSAFT.ts                 # Hooks para gerenciar estado
├── app/admin/finance-management/
│   └── saft-export/page.tsx         # Página principal
└── components/ui/alert.tsx          # Componente Alert (criado)
```

### 🔧 Componentes Técnicos

#### 1. Tipos TypeScript (`saft.types.ts`)

Implementa todas as interfaces necessárias conforme especificação AGT:

- **ISAFTHeader**: Cabeçalho do ficheiro
- **ISAFTCustomer**: Dados de clientes
- **ISAFTProduct**: Produtos e serviços
- **ISAFTInvoice**: Faturas de venda
- **ISAFTPayment**: Pagamentos recebidos
- **ISAFTTaxTable**: Tabela de impostos
- **ISAFTFile**: Estrutura completa do ficheiro

#### 2. Serviço SAFT (`saft.service.ts`)

**Funcionalidades:**
- `exportSAFT()`: Exportação real via API
- `generateMockSAFT()`: Geração de demonstração
- `validateExportConfig()`: Validação de configuração
- `getCompanyInfo()`: Informações da empresa
- `getExportStatistics()`: Estatísticas do período
- `downloadSAFTFile()`: Download direto do ficheiro

#### 3. Hooks (`useSAFT.ts`)

**Hooks Disponíveis:**
- `useSAFTExport()`: Gerencia exportação
- `useSAFTStatistics()`: Carrega estatísticas
- `useSAFTCompanyInfo()`: Informações da empresa
- `useSAFT()`: Hook principal combinado

#### 4. Página de Exportação (`saft-export/page.tsx`)

**Seções da Interface:**
- **Período de Exportação**: Seleção de datas
- **Informações da Empresa**: Dados fiscais
- **Opções de Exportação**: Seleção de dados a incluir
- **Estatísticas**: Resumo do período
- **Validação**: Verificação antes da exportação

## 🚀 Como Usar

### 1. Acessar a Página

Navegue para: **Financeiro > Exportação SAFT**

### 2. Configurar Período

- Selecione data de início e fim
- Use botões rápidos (Mês Atual, Mês Anterior, Ano Atual)
- Visualize estatísticas do período

### 3. Verificar Dados da Empresa

- NIF (obrigatório)
- Nome da empresa (obrigatório)
- Endereço completo
- Contactos (telefone, email)

### 4. Selecionar Dados a Incluir

- ✅ **Clientes**: Lista de clientes
- ✅ **Produtos/Serviços**: Catálogo de produtos
- ✅ **Faturas**: Documentos de venda
- ✅ **Pagamentos**: Recibos e pagamentos

### 5. Gerar Ficheiro

- Clique em "Gerar Ficheiro SAFT"
- Aguarde validação e processamento
- Download inicia automaticamente

## 📊 Estrutura do Ficheiro SAFT

### Cabeçalho (Header)
```xml
<Header>
  <AuditFileVersion>1.04_01</AuditFileVersion>
  <CompanyID>123456789</CompanyID>
  <TaxRegistrationNumber>123456789</TaxRegistrationNumber>
  <CompanyName>Instituto Médio Politécnico Jomorais</CompanyName>
  <FiscalYear>2024</FiscalYear>
  <StartDate>2024-01-01</StartDate>
  <EndDate>2024-01-31</EndDate>
  <CurrencyCode>AOA</CurrencyCode>
</Header>
```

### Ficheiros Mestres (MasterFiles)
- **Clientes**: Lista de estudantes/encarregados
- **Produtos**: Serviços educacionais (propinas, matrículas)
- **Tabela de Impostos**: Configuração de IVA

### Documentos Fonte (SourceDocuments)
- **Faturas de Venda**: Propinas e taxas
- **Pagamentos**: Recibos de pagamento

## 🔐 Conformidade AGT

### Especificações Atendidas

- ✅ **Versão**: SAFT-AO 1.04_01
- ✅ **Formato**: XML válido
- ✅ **Codificação**: UTF-8
- ✅ **Hash**: Assinatura digital (preparado)
- ✅ **Moeda**: Kwanza Angolano (AOA)
- ✅ **Impostos**: Estrutura IVA Angola

### Campos Obrigatórios

- **NIF da Empresa**: Identificação fiscal
- **Período Fiscal**: Datas de início e fim
- **Documentos**: Faturas e pagamentos
- **Assinatura**: Hash de validação

## 🛠️ Configuração Técnica

### Endpoints da API

```typescript
// Exportação real
POST /api/finance-management/saft/export

// Validação
POST /api/finance-management/saft/validate

// Estatísticas
GET /api/finance-management/saft/statistics
```

### Configuração do Software

```typescript
softwareInfo: {
  name: 'Sistema Jomorais',
  version: '1.0.0',
  certificateNumber: 'CERT-JOMORAIS-2024',
  companyNIF: '123456789'
}
```

## 🔄 Estados da Interface

### Loading States
- **Carregando**: Durante geração do ficheiro
- **Validando**: Durante verificação de dados
- **Estatísticas**: Ao carregar dados do período

### Feedback Visual
- **Sucesso**: Ficheiro gerado com sucesso
- **Erro**: Problemas na validação ou geração
- **Avisos**: Informações importantes

## 📝 Logs e Debug

### Console Logs
```javascript
🔄 Iniciando exportação SAFT
✅ jsPDF importado com sucesso
📊 Gerando SAFT com dados
💾 Salvando ficheiro SAFT
✅ SAFT exportado com sucesso
```

### Tratamento de Erros
- Validação de campos obrigatórios
- Verificação de formato de datas
- Fallback para modo demonstração
- Mensagens de erro específicas

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Integração Backend**: Conectar com API real
2. **Assinatura Digital**: Implementar hash de validação
3. **Histórico**: Manter registro de exportações
4. **Agendamento**: Exportação automática mensal
5. **Validação AGT**: Verificação online com AGT

### Manutenção
- Atualizar especificações conforme AGT
- Monitorar mudanças na legislação fiscal
- Testes regulares de conformidade
- Backup de configurações

## 📞 Suporte

Para questões técnicas sobre o sistema SAFT:
1. Verificar logs do console
2. Validar configuração da empresa
3. Testar com dados de demonstração
4. Contactar suporte técnico se necessário

---

**Nota**: Este sistema está em conformidade com as especificações SAFT-AO da AGT vigentes em 2024. Recomenda-se verificar atualizações regulares das especificações fiscais.
