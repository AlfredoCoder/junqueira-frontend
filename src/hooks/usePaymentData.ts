import { useState, useCallback, useEffect, useRef } from 'react';
import api from '@/utils/api.utils';

export interface IAnoLectivo {
  codigo: number;
  designacao: string;
  mesInicial: string;
  mesFinal: string;
  anoInicial: string;
  anoFinal: string;
}

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Função para extrair ano letivo da string do tipo de serviço
export const extractAnoLetivoFromString = (designacao: string): { anoLetivo?: string; anoInicial?: number; anoFinal?: number } => {
  // Padrões para diferentes formatos de ano letivo
  const patterns = [
    /(\d{4}\/\d{4})/g,           // 2024/2025
    /(\d{4}-\d{4})/g,           // 2024-2025
    /(\d{2}\/\d{2})/g,          // 22/23
    /(\d{4}\/\d{2})/g,          // 2024/25
  ];

  for (const pattern of patterns) {
    const match = designacao.match(pattern);
    if (match) {
      const anoLetivo = match[0];
      let anoInicial: number;
      let anoFinal: number;

      if (anoLetivo.includes('/')) {
        const [inicio, fim] = anoLetivo.split('/');
        if (inicio.length === 2) {
          // Formato 22/23 - assumir 20xx
          anoInicial = 2000 + parseInt(inicio);
          anoFinal = 2000 + parseInt(fim);
        } else if (fim.length === 2) {
          // Formato 2024/25
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(inicio.substring(0, 2) + fim);
        } else {
          // Formato 2024/2025
          anoInicial = parseInt(inicio);
          anoFinal = parseInt(fim);
        }
      } else {
        // Formato com hífen 2024-2025
        const [inicio, fim] = anoLetivo.split('-');
        anoInicial = parseInt(inicio);
        anoFinal = parseInt(fim);
      }

      return {
        anoLetivo,
        anoInicial,
        anoFinal
      };
    }
  }

  return {};
};

// Função para verificar se um tipo de serviço corresponde a um ano letivo
export const matchesAnoLetivo = (tipoServico: ITipoServico, anoLectivoSelecionado: IAnoLectivo): boolean => {
  const { anoInicial: tipoAnoInicial, anoFinal: tipoAnoFinal } = tipoServico;
  
  if (!tipoAnoInicial || !tipoAnoFinal) {
    // Se não tem ano na string, é considerado compatível (serviço genérico)
    return true;
  }

  const anoLectivoInicial = parseInt(anoLectivoSelecionado.anoInicial);
  const anoLectivoFinal = parseInt(anoLectivoSelecionado.anoFinal);

  return tipoAnoInicial === anoLectivoInicial && tipoAnoFinal === anoLectivoFinal;
};

// Função para encontrar o ano letivo mais atual
export const findMostRecentAnoLetivo = (anosLectivos: IAnoLectivo[]): IAnoLectivo | null => {
  if (anosLectivos.length === 0) return null;
  
  return anosLectivos.reduce((latest, current) => {
    const latestYear = parseInt(latest.anoInicial);
    const currentYear = parseInt(current.anoInicial);
    return currentYear > latestYear ? current : latest;
  });
};

// Função auxiliar para verificar se uma designação contém uma abreviação específica
const contemAbreviacao = (designacao: string, abreviacao: string): boolean => {
  const regex = new RegExp(`\\b${abreviacao.replace('.', '\\.')}\\b`, 'i');
  return regex.test(designacao) || designacao.toUpperCase().includes(abreviacao.toUpperCase().replace('.', ''));
};

// Lista de abreviações para todos os cursos
const ABREVIACOES_CURSOS = {
  'ANALISES CLINICAS': ['A.C', 'AC', 'ANALISES', 'ANÁLISES', 'ANALÍSES CLÍNICAS', 'ANALISES CLINICAS', 'ANALÍSES', 'CLÍNICAS'],
  'ENFERMAGEM GERAL': ['E.G', 'EG', 'ENFERMAGEM', 'ENFERMAGEM GERAL'],
  'FARMACIA': ['F.M', 'FM', 'FARMACIA', 'FARMÁCIA'],
  'CIENCIAS ECONOMICAS JURIDICAS': ['C.E.J', 'CEJ', 'ECONOMICAS', 'JURIDICAS'],
  'CIENCIAS FISICAS BIOLOGICAS': ['C.F.B', 'CFB', 'FISICAS', 'BIOLOGICAS'],
  'GERAL': ['GERAL', 'ENSINO GERAL', 'PRIMARIO', 'PRIMÁRIA', 'BÁSICO']
};

// Função para detectar curso na string do tipo de serviço
const detectarCursoNaTipoServico = (designacao: string, cursoAluno: string): boolean => {
  const designacaoUpper = designacao.toUpperCase();
  const abreviacoes = ABREVIACOES_CURSOS[cursoAluno as keyof typeof ABREVIACOES_CURSOS];
  
  if (!abreviacoes) return false;
  
  // Analisa letra por letra e sentido semântico
  for (const abrev of abreviacoes) {
    if (designacaoUpper.includes(abrev)) {
      return true;
    }
  }
  
  return false;
};

// Função para extrair número da classe da string
const extrairNumeroClasse = (texto: string): string | null => {
  const match = texto.match(/(\d+)ª/);
  const resultado = match ? match[1] + 'ª' : null;
  return resultado;
};

// Função para extrair ano letivo da string
const extrairAnoLetivo = (texto: string): string | null => {
  // Procura padrões como 2024/2025, 2024-2025, 2024 / 2025
  const match = texto.match(/(\d{4})\s*[\/\-]\s*(\d{4})/);
  let resultado = null;
  
  if (match) {
    // Normalizar sempre para formato 2024/2025
    resultado = `${match[1]}/${match[2]}`;
  }
  
  return resultado;
};

// Função para mapear COMPLETO da turma (curso, classe, ano)
export const mapearTurmaCompleta = (turma: string) => {
  // Extrair ano letivo
  const anoLetivo = extrairAnoLetivo(turma);
  // Extrair classe
  const classe = extrairNumeroClasse(turma);
  
  // Extrair curso
  const curso = mapearCursoPorTurma(turma);
  
  return {
    curso,
    classe,
    anoLetivo,
    turmaOriginal: turma
  };
};

// Função para mapear curso baseado na turma
export const mapearCursoPorTurma = (turma: string): string => {
  const turmaUpper = turma.toUpperCase();
  
  // Mapeamento robusto que considera variações com e sem pontos
  
  // 1. Análises Clínicas (A.C, AC, A C)
  if (contemAbreviacao(turma, 'A.C') || 
      contemAbreviacao(turma, 'AC') ||
      (turmaUpper.includes('AC') && !turmaUpper.includes('FARMAC')) ||
      turmaUpper.includes('ANALISES') || 
      turmaUpper.includes('ANÁLISES')) {
    return 'ANALISES CLINICAS';
  }
  
  // 2. Enfermagem Geral (E.G, EG, E G)
  if (contemAbreviacao(turma, 'E.G') || 
      contemAbreviacao(turma, 'EG') ||
      turmaUpper.includes('ENFERMAGEM')) {
    return 'ENFERMAGEM GERAL';
  }
  
  // 3. Farmácia (F.M, FM, F M)
  if (contemAbreviacao(turma, 'F.M') || 
      contemAbreviacao(turma, 'FM') ||
      turmaUpper.includes('FARMAC') || 
      turmaUpper.includes('FARMÁCIA')) {
    return 'FARMACIA';
  }
  
  // 4. Ciências Econômicas Jurídicas (C.E.J, CEJ, C E J)
  if (contemAbreviacao(turma, 'C.E.J') || 
      contemAbreviacao(turma, 'CEJ') ||
      turmaUpper.includes('ECONOMICAS') ||
      turmaUpper.includes('JURIDICAS')) {
    return 'CIENCIAS ECONOMICAS JURIDICAS';
  }
  
  // 5. Ciências Físicas Biológicas (C.F.B, CFB, C F B)
  if (contemAbreviacao(turma, 'C.F.B') || 
      contemAbreviacao(turma, 'CFB') ||
      turmaUpper.includes('FISICAS') ||
      turmaUpper.includes('BIOLOGICAS')) {
    return 'CIENCIAS FISICAS BIOLOGICAS';
  }
  
  return 'GERAL'; // Fallback
};

// Função para extrair classe da turma
export const extrairClasseDaTurma = (turma: string): string => {
  const match = turma.match(/(\d+)ª/);
  const classe = match ? `${match[1]}ª` : '';
  return classe;
};

// Função SIMPLES para encontrar tipo de serviço
export const findBestTipoServicoForAluno = (
  tiposServico: ITipoServico[], 
  anoLectivoSelecionado: IAnoLectivo | null,
  dadosAluno?: any,
  tipoServicoTurma?: ITipoServico | null
): ITipoServico | null => {
  if (!dadosAluno?.dadosAcademicos?.turma) return null;

  const turma = dadosAluno.dadosAcademicos.turma;
  
  // Extrair dados da turma
  const curso = mapearCursoPorTurma(turma);
  const classe = extrairNumeroClasse(turma);
  const anoTurma = extrairAnoLetivo(turma);
  
  // Definir ano para buscar
  const anoBuscar = anoLectivoSelecionado ? 
    `${anoLectivoSelecionado.anoInicial}/${anoLectivoSelecionado.anoFinal}` : 
    anoTurma;
  
  // Buscar tipo de serviço - VALIDAR TUDO ANTES DE RETORNAR
  const candidatos = [];
  
  for (const tipo of tiposServico) {
    const nome = tipo.designacao.toUpperCase();
    
    // 1. Deve ser PROPINA
    if (!nome.includes('PROPINA')) continue;
    
    // 2. Verificar CURSO - ESPECIAL PARA GERAL
    let temCurso = false;
    if (curso === 'GERAL') {
      // Para curso GERAL, priorizar pela CLASSE apenas
      // Aceitar qualquer tipo de serviço que não seja específico de outro curso
      const temOutroCurso = Object.keys(ABREVIACOES_CURSOS)
        .filter(c => c !== 'GERAL')
        .some(outroCurso => detectarCursoNaTipoServico(nome, outroCurso));
      
      temCurso = !temOutroCurso; // Se não tem outro curso específico, é válido para GERAL
    } else {
      temCurso = detectarCursoNaTipoServico(nome, curso);
    }
    
    // 3. Verificar CLASSE
    const classeNoTipo = extrairNumeroClasse(nome);
    const temClasse = classeNoTipo === classe;
    
    // 4. Verificar ANO LETIVO
    const anoNoTipo = extrairAnoLetivo(nome);
    let temAno = false;
    
    if (anoBuscar) {
      // Se há ano para buscar, deve coincidir exatamente
      temAno = anoNoTipo === anoBuscar;
    } else {
      // Se não há ano para buscar, só aceitar genéricos (sem ano)
      temAno = !anoNoTipo;
    }
    
    // SÓ ADICIONA SE TUDO ESTIVER CORRETO
    if (temCurso && temClasse && temAno) {
      candidatos.push(tipo);
    }
  }
  
  // Retornar o melhor candidato (maior preço)
  if (candidatos.length > 0) {
    const melhor = candidatos.reduce((best, current) => 
      current.preco > best.preco ? current : best
    );
    return melhor;
  }
  
  // FALLBACK: Se não encontrou com ano específico, buscar sem ano (genéricos)
  if (anoBuscar) {
    const genericosCandidatos = [];
    const genericosCursoClasse = []; // Prioridade 1: mesmo curso e classe
    const genericosCurso = [];       // Prioridade 2: mesmo curso, classe diferente
    
    for (const tipo of tiposServico) {
      const nome = tipo.designacao.toUpperCase();
      
      if (!nome.includes('PROPINA')) continue;
      
      // Aplicar mesma lógica especial para GERAL
      let temCurso = false;
      if (curso === 'GERAL') {
        const temOutroCurso = Object.keys(ABREVIACOES_CURSOS)
          .filter(c => c !== 'GERAL')
          .some(outroCurso => detectarCursoNaTipoServico(nome, outroCurso));
        
        temCurso = !temOutroCurso;
      } else {
        temCurso = detectarCursoNaTipoServico(nome, curso);
      }
      const classeNoTipo = extrairNumeroClasse(nome);
      const temClasse = classeNoTipo === classe;
      
      // Deve ser genérico (sem ano)
      const anoNoTipo = extrairAnoLetivo(nome);
      const eGenerico = !anoNoTipo;
      
      if (eGenerico) {
        if (temCurso && temClasse) {
          // PRIORIDADE 1: Mesmo curso E mesma classe
          genericosCursoClasse.push(tipo);
        } else if (temCurso) {
          // PRIORIDADE 2: Mesmo curso, classe diferente
          genericosCurso.push(tipo);
        } else {
          // PRIORIDADE 3: Outros genéricos
          genericosCandidatos.push(tipo);
        }
      }
    }
    
    // Selecionar por ordem de prioridade
    let candidatosFinais: ITipoServico[] = [];
    let tipoSelecionado = '';
    
    if (genericosCursoClasse.length > 0) {
      candidatosFinais = genericosCursoClasse;
      tipoSelecionado = 'CURSO+CLASSE';
    } else if (genericosCurso.length > 0) {
      candidatosFinais = genericosCurso;
      tipoSelecionado = 'SÓ CURSO';
    } else if (genericosCandidatos.length > 0) {
      candidatosFinais = genericosCandidatos;
      tipoSelecionado = 'OUTROS';
    }
    
    if (candidatosFinais.length > 0) {
      // Entre os candidatos da mesma prioridade, escolher o de maior preço
      const melhor = candidatosFinais.reduce((best, current) => 
        current.preco > best.preco ? current : best
      );
      return melhor;
    }
  }
  
  return null;
};

// Hook para buscar confirmação mais recente do aluno
export const useConfirmacaoMaisRecente = () => {
  const [confirmacao, setConfirmacao] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usar useRef para cache para evitar dependências circulares
  const cacheRef = useRef<{ alunoId: number | null; data: any }>({ 
    alunoId: null, 
    data: null 
  });

  const fetchConfirmacaoMaisRecente = useCallback(async (alunoId: number) => {
    // Verificar cache para evitar requisições desnecessárias
    if (cacheRef.current.alunoId === alunoId && cacheRef.current.data) {
      console.log(`🔄 [useConfirmacaoMaisRecente] Cache hit para aluno ${alunoId}`);
      setConfirmacao(cacheRef.current.data);
      return cacheRef.current.data;
    }

    // Verificar se já está carregando para o mesmo aluno
    if (loading) {
      console.log(`⏳ [useConfirmacaoMaisRecente] Já carregando para aluno ${alunoId}, ignorando...`);
      return null;
    }

    console.log(`🔍 [useConfirmacaoMaisRecente] Fazendo nova requisição para aluno ${alunoId}`);
    setLoading(true);
    setError(null);
    
    try {
      // Tentar múltiplos endpoints para encontrar confirmações do aluno
      let confirmacoes: any[] = [];
      
      // Opção 1: Endpoint específico de confirmações por aluno
      try {
        const response1 = await api.get(`/api/student-management/confirmations?alunoId=${alunoId}`);
        if (response1.data.success && response1.data.data?.length > 0) {
          confirmacoes = response1.data.data;
        }
      } catch (err) {
        // Endpoint específico não disponível, tentando alternativa
      }
      
      // Opção 2: Buscar via dados completos do aluno (fallback)
      if (confirmacoes.length === 0) {
        try {
          const response2 = await api.get(`/api/payment-management/aluno/${alunoId}/completo`);
          if (response2.data.success && response2.data.data) {
            const alunoCompleto = response2.data.data;
            
            // Extrair confirmações da estrutura do aluno completo
            const matriculas = alunoCompleto.tb_matriculas;
            if (matriculas?.tb_confirmacoes?.length > 0) {
              confirmacoes = matriculas.tb_confirmacoes;
            } else if (Array.isArray(matriculas)) {
              // Se matriculas é um array, buscar confirmações em cada matrícula
              confirmacoes = matriculas.flatMap(matricula => 
                matricula.tb_confirmacoes || []
              ).filter(Boolean);
            }
          }
        } catch (err) {
          // Erro ao buscar via aluno completo
        }
      }
      
      if (confirmacoes.length > 0) {
        // Ordenar por ano letivo mais recente
        const confirmacoesSorted = confirmacoes.sort((a: any, b: any) => {
          // Tentar diferentes estruturas de ano letivo
          const anoA = parseInt(
            a.anoLetivo?.anoInicial || 
            a.tb_anos_lectivos?.anoInicial || 
            a.codigo_Ano_lectivo || 
            '0'
          );
          const anoB = parseInt(
            b.anoLetivo?.anoInicial || 
            b.tb_anos_lectivos?.anoInicial || 
            b.codigo_Ano_lectivo || 
            '0'
          );
          return anoB - anoA; // Mais recente primeiro
        });
        
        const confirmacaoMaisRecente = confirmacoesSorted[0];
        
        // Atualizar cache e estado
        cacheRef.current = { alunoId, data: confirmacaoMaisRecente };
        setConfirmacao(confirmacaoMaisRecente);
        return confirmacaoMaisRecente;
      } else {
        setConfirmacao(null);
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar confirmação do aluno';
      setError(errorMessage);
      setConfirmacao(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar recriação

  const clearCache = useCallback(() => {
    cacheRef.current = { alunoId: null, data: null };
    setConfirmacao(null);
    setError(null);
  }, []);

  return {
    confirmacao,
    loading,
    error,
    fetchConfirmacaoMaisRecente,
    clearCache
  };
};

export interface ITipoServico {
  codigo: number;
  designacao: string;
  preco: number;
  anoLetivo?: string; // Ano letivo extraído da string
  anoInicial?: number; // Ano inicial extraído
  anoFinal?: number; // Ano final extraído
}

export interface IFormaPagamento {
  codigo: number;
  designacao: string;
}

export interface IAluno {
  codigo: number;
  nome: string;
  n_documento_identificacao: string;
  email: string;
  telefone: string;
  dadosAcademicos?: {
    classe: string;
    turma: string;
  };
}

// Hook para buscar tipos de serviço
export const useTiposServico = () => {
  const [tiposServico, setTiposServico] = useState<ITipoServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiposServico = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/tipos-servico');
      if (response.data.success) {
        // Processar tipos de serviço para extrair informações de ano letivo
        const processedTiposServico = response.data.data.map((tipo: ITipoServico) => {
          const anoInfo = extractAnoLetivoFromString(tipo.designacao);
          return {
            ...tipo,
            ...anoInfo
          };
        });
        setTiposServico(processedTiposServico);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipos de serviço');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipos de serviço';
      setError(errorMessage);
      // Dados mockados como fallback
      setTiposServico([
        { codigo: 1, designacao: 'Propina', preco: 15000 },
        { codigo: 2, designacao: 'Confirmação de Matrícula', preco: 5000 },
        { codigo: 3, designacao: 'Cartão de Estudante', preco: 2000 },
        { codigo: 4, designacao: 'Certificado', preco: 3000 },
        { codigo: 5, designacao: 'Outros Serviços', preco: 1000 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiposServico();
  }, []);

  return {
    tiposServico,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para filtrar tipos de serviço por ano letivo
export const useTiposServicoFiltrados = (anoLectivoSelecionado: IAnoLectivo | null) => {
  const { tiposServico, loading, error, fetchTiposServico } = useTiposServico();
  const [tiposServicoFiltrados, setTiposServicoFiltrados] = useState<ITipoServico[]>([]);

  useEffect(() => {
    if (!anoLectivoSelecionado) {
      // Se não há ano letivo selecionado, mostrar todos
      setTiposServicoFiltrados(tiposServico);
      return;
    }

    // Filtrar tipos de serviço que correspondem ao ano letivo selecionado
    const tiposFiltrados = tiposServico.filter((tipo: ITipoServico) => {
      return matchesAnoLetivo(tipo, anoLectivoSelecionado);
    });

    // Se não encontrou tipos específicos para o ano, incluir tipos genéricos (sem ano na string)
    const tiposGenericos = tiposServico.filter((tipo: ITipoServico) => !tipo.anoInicial && !tipo.anoFinal);
    
    // Combinar tipos específicos com genéricos, priorizando específicos
    const tiposFinais = tiposFiltrados.length > 0 ? tiposFiltrados : [...tiposFiltrados, ...tiposGenericos];
    
    setTiposServicoFiltrados(tiposFinais);
  }, [tiposServico, anoLectivoSelecionado]);

  return {
    tiposServico: tiposServicoFiltrados,
    loading,
    error,
    fetchTiposServico
  };
};

// Hook para formas de pagamento
export const useFormasPagamento = () => {
  const [formasPagamento, setFormasPagamento] = useState<IFormaPagamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFormasPagamento = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/formas-pagamento');
      if (response.data.success) {
        setFormasPagamento(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar formas de pagamento');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar formas de pagamento';
      setError(errorMessage);
      // Dados mockados como fallback
      setFormasPagamento([
        { codigo: 1, designacao: 'Dinheiro' },
        { codigo: 2, designacao: 'Transferência Bancária' },
        { codigo: 3, designacao: 'Multicaixa' },
        { codigo: 4, designacao: 'Cheque' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormasPagamento();
  }, []);

  return { formasPagamento, loading, error, refetch: fetchFormasPagamento };
};

// Hook para buscar alunos (para o select de alunos)
export const useAlunosSearch = () => {
  const [alunos, setAlunos] = useState<IAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAlunos = async (search: string = '', limit: number = 50) => {
    if (!search.trim()) {
      setAlunos([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        search: search.trim(),
        limit: limit.toString(),
        page: '1'
      });

      const response = await api.get(`/api/payment-management/alunos-confirmados?${params}`);
      if (response.data.success) {
        setAlunos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar alunos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar alunos';
      setError(errorMessage);
      setAlunos([]);
    } finally {
      setLoading(false);
    }
  };

  const clearAlunos = () => {
    setAlunos([]);
    setError(null);
  };

  return { 
    alunos, 
    loading, 
    error, 
    searchAlunos,
    clearAlunos
  };
};

// Hook para buscar categorias (usando as mesmas do sistema de serviços)
export const useCategorias = () => {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategorias = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar as mesmas categorias do sistema de serviços financeiros
      const categoriasServicos = [
        { codigo: 1, designacao: 'Propina', requerMeses: true },
        { codigo: 2, designacao: 'Matricula', requerMeses: false },
        { codigo: 3, designacao: 'Confirmacao', requerMeses: false },
        { codigo: 4, designacao: 'Uniformes', requerMeses: false },
        { codigo: 5, designacao: 'Folhas de prova', requerMeses: false },
        { codigo: 6, designacao: 'Declaracao', requerMeses: false },
        { codigo: 7, designacao: 'Certificado', requerMeses: false },
        { codigo: 8, designacao: 'Diploma', requerMeses: false },
        { codigo: 9, designacao: 'Cartao de escola', requerMeses: false },
        { codigo: 10, designacao: 'Justifativo', requerMeses: false },
        { codigo: 11, designacao: 'Boletim de notas', requerMeses: false },
        { codigo: 12, designacao: 'Saidas extra escolares', requerMeses: false }
      ];
      
      setCategorias(categoriasServicos);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar categorias';
      setError(errorMessage);
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  return { categorias, loading, error, fetchCategorias };
};

// Hook para buscar tipos de serviços compatíveis
export const useTiposServicosCompativeis = () => {
  const [tiposServicos, setTiposServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alunoInfo, setAlunoInfo] = useState<any>(null);

  const fetchTiposCompativeis = useCallback(async (alunoId: number, categoria?: number) => {
    if (!alunoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = categoria ? `?categoria=${categoria}` : '';
      const response = await api.get(`/api/payment-management/tipos-servicos-compatibles/${alunoId}${params}`);
      
      if (response.data.success) {
        setTiposServicos(response.data.data);
        setAlunoInfo(response.data.alunoInfo);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipos de serviços');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipos de serviços';
      setError(errorMessage);
      setTiposServicos([]);
      setAlunoInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTipos = useCallback(() => {
    setTiposServicos([]);
    setAlunoInfo(null);
    setError(null);
  }, []);

  return { 
    tiposServicos, 
    loading, 
    error, 
    alunoInfo,
    fetchTiposCompativeis,
    clearTipos
  };
};

// Hook para buscar propina automática
export const usePropinaAutomatica = () => {
  const [propina, setPropina] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alunoInfo, setAlunoInfo] = useState<any>(null);

  const fetchPropinaAutomatica = useCallback(async (alunoId: number) => {
    if (!alunoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/propina-automatica`);
      
      if (response.data.success) {
        setPropina(response.data.data.propina);
        setAlunoInfo(response.data.data.alunoInfo);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar propina automática');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar propina automática';
      setError(errorMessage);
      setPropina(null);
      setAlunoInfo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearPropina = useCallback(() => {
    setPropina(null);
    setAlunoInfo(null);
    setError(null);
  }, []);

  return { 
    propina, 
    loading, 
    error, 
    alunoInfo,
    fetchPropinaAutomatica,
    clearPropina
  };
};

// Constantes úteis
export const MESES_ANO_LECTIVO = [
  'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
  'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO', 'JULHO'
];

export const MESES_OPTIONS = MESES_ANO_LECTIVO.map(mes => ({
  value: mes,
  label: mes.charAt(0) + mes.slice(1).toLowerCase()
}));

export const ANOS_OPTIONS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() + i - 5;
  return { value: year, label: year.toString() };
});

// Hook para buscar dados completos do aluno
export const useAlunoCompleto = () => {
  const [aluno, setAluno] = useState<IAluno | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunoCompleto = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/completo`);
      if (response.data.success) {
        setAluno(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do aluno');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar dados do aluno';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearAluno = () => {
    setAluno(null);
    setError(null);
  };

  return {
    aluno,
    loading,
    error,
    fetchAlunoCompleto,
    clearAluno
  };
};

// Hook para buscar tipo de serviço específico da turma do aluno
export const useTipoServicoTurmaAluno = () => {
  const [tipoServico, setTipoServico] = useState<ITipoServico | null>(null);
  const [dadosAluno, setDadosAluno] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoServicoTurma = async (alunoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/tipo-servico-turma`);
      if (response.data.success) {
        setTipoServico(response.data.data);
        setDadosAluno(null); // Não há dados do aluno nesta resposta
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar tipo de serviço da turma');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar tipo de serviço da turma';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearTipoServico = () => {
    setTipoServico(null);
    setDadosAluno(null);
    setError(null);
  };

  return {
    tipoServico,
    dadosAluno,
    loading,
    error,
    fetchTipoServicoTurma,
    clearTipoServico
  };
};

// Hook para buscar meses pendentes do aluno
export const useMesesPendentesAluno = () => {
  const [mesesPendentes, setMesesPendentes] = useState<string[]>([]);
  const [mesesPagos, setMesesPagos] = useState<string[]>([]);
  const [proximoMes, setProximoMes] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMesesPendentes = async (alunoId: number, codigoAnoLectivo?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = codigoAnoLectivo ? `?codigoAnoLectivo=${codigoAnoLectivo}` : '';
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/meses-pendentes${params}`);
      if (response.data.success) {
        const data = response.data.data;
        setMesesPendentes(data.mesesPendentes || []);
        setMesesPagos(data.mesesPagos || []);
        setProximoMes(data.proximoMes || null);
        setMensagem(data.mensagem || null);
        
        return data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar meses pendentes');
      }
    } catch (err: any) {
      // Se for erro 400, pode ser que o aluno não esteja matriculado no ano
      if (err.response?.status === 400) {
        setMesesPendentes([]);
        setMesesPagos([]);
        setProximoMes(null);
        return {
          mesesPendentes: [],
          mesesPagos: [],
          totalMeses: 0,
          mesesPagosCount: 0,
          mesesPendentesCount: 0,
          proximoMes: null,
          dividasAnteriores: [],
          temDividas: false,
          mensagem: 'Aluno não encontrado no ano letivo especificado'
        };
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar meses pendentes';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearMesesPendentes = useCallback(() => {
    setMesesPendentes([]);
    setMesesPagos([]);
    setProximoMes(null);
    setMensagem(null);
    setLoading(false);
    setError(null);
  }, []);

  const refreshMesesPendentes = useCallback(async (alunoId: number, codigoAnoLectivo?: number) => {
    // Força uma nova busca limpando o cache primeiro
    clearMesesPendentes();
    await fetchMesesPendentes(alunoId, codigoAnoLectivo);
  }, [fetchMesesPendentes, clearMesesPendentes]);

  return {
    mesesPendentes,
    mesesPagos,
    proximoMes,
    mensagem,
    loading,
    error,
    fetchMesesPendentes,
    clearMesesPendentes,
    refreshMesesPendentes
  };
};

// Hook para buscar anos letivos
export const useAnosLectivos = () => {
  const [anosLectivos, setAnosLectivos] = useState<IAnoLectivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnosLectivos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/api/payment-management/anos-lectivos');
      if (response.data.success) {
        setAnosLectivos(response.data.data);
      } else {
        throw new Error(response.data.message || 'Erro ao buscar anos letivos');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar anos letivos';
      setError(errorMessage);
      // Dados mockados como fallback
      setAnosLectivos([
        { codigo: 1, designacao: '2024/2025', anoInicial: '2024', anoFinal: '2025', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' },
        { codigo: 2, designacao: '2025/2026', anoInicial: '2025', anoFinal: '2026', mesInicial: 'SETEMBRO', mesFinal: 'JULHO' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnosLectivos();
  }, []);

  return {
    anosLectivos,
    loading,
    error,
    fetchAnosLectivos
  };
};

// Hook para buscar propina específica da classe do aluno no ano letivo
export const usePropinaClasse = () => {
  const [propinaClasse, setPropinaClasse] = useState<ITipoServico | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPropinaClasse = async (alunoId: number, anoLectivoId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/api/payment-management/aluno/${alunoId}/propina-classe/${anoLectivoId}`);
      if (response.data.success) {
        setPropinaClasse(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar propina da classe');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao buscar propina da classe';
      setError(errorMessage);
      setPropinaClasse(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearPropinaClasse = () => {
    setPropinaClasse(null);
    setError(null);
  };

  return {
    propinaClasse,
    loading,
    error,
    fetchPropinaClasse,
    clearPropinaClasse
  };
};

// Hook para validar número de borderô
export const useValidateBordero = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateBordero = useCallback(async (bordero: string, excludeId?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = excludeId ? `?excludeId=${excludeId}` : '';
      const response = await api.post(`/api/payment-management/validate-bordero${params}`, {
        bordero
      });
      
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Número de borderô inválido');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao validar borderô';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []); // Sem dependências para evitar recriação

  return {
    validateBordero,
    loading,
    error
  };
};
