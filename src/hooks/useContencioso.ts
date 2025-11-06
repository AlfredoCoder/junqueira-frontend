import { useState, useEffect, useCallback } from 'react';
import api from '@/utils/api.utils';

interface StatusContencioso {
  emContencioso: boolean;
  mesesContenciosos: string[];
  diasRestantes: number;
  podeVerNotas: boolean;
}

export const useStatusContencioso = (codigoAluno?: number) => {
  const [statusContencioso, setStatusContencioso] = useState<StatusContencioso>({
    emContencioso: false,
    mesesContenciosos: [],
    diasRestantes: 0,
    podeVerNotas: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calcularStatusContencioso = useCallback((mesesPendentes: string[]) => {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.getMonth(); // 0-11 (Janeiro = 0, Dezembro = 11)
    const anoAtual = hoje.getFullYear();
    
    // Mapeamento de meses para números
    const mesesMap: { [key: string]: number } = {
      'JANEIRO': 0, 'FEVEREIRO': 1, 'MARÇO': 2, 'ABRIL': 3,
      'MAIO': 4, 'JUNHO': 5, 'JULHO': 6, 'AGOSTO': 7,
      'SETEMBRO': 8, 'OUTUBRO': 9, 'NOVEMBRO': 10, 'DEZEMBRO': 11
    };
    
    const mesesContenciosos: string[] = [];
    let emContencioso = false;
    let diasRestantes = 0;
    
    // Verificar cada mês pendente
    mesesPendentes.forEach(mes => {
      const numeroMes = mesesMap[mes.toUpperCase()];
      if (numeroMes !== undefined) {
        
        // Determinar o ano do mês baseado no ano letivo 2025/2026
        let anoDoMes = anoAtual;
        if (numeroMes >= 8) { // Setembro a Dezembro = 2025
          anoDoMes = 2025;
        } else { // Janeiro a Julho = 2026
          anoDoMes = 2026;
        }
        
        // Criar data do dia 15 do mês em questão
        const dataLimite = new Date(anoDoMes, numeroMes, 15);
        
        // Se a data limite já passou, está em contencioso
        if (hoje > dataLimite) {
          mesesContenciosos.push(mes);
          emContencioso = true;
        }
        // Se é o mês atual e ainda não passou do dia 15
        else if (numeroMes === mesAtual && anoDoMes === anoAtual && diaAtual <= 15) {
          diasRestantes = 15 - diaAtual;
        }
      }
    });
    
    return {
      emContencioso,
      mesesContenciosos,
      diasRestantes,
      podeVerNotas: !emContencioso // Se está em contencioso, não pode ver notas
    };
  }, []);

  const verificarStatusContencioso = useCallback(async (alunoId: number) => {
    if (!alunoId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Buscar ano letivo mais recente
      const anosResponse = await api.get('/api/payment-management/anos-lectivos');
      if (!anosResponse.data.success || anosResponse.data.data.length === 0) {
        throw new Error('Nenhum ano letivo encontrado');
      }
      
      const anoMaisRecente = anosResponse.data.data[0];
      
      // Buscar meses pendentes do aluno
      const mesesResponse = await api.get(`/api/payment-management/aluno/${alunoId}/meses-pendentes?codigoAnoLectivo=${anoMaisRecente.codigo}`);
      
      if (mesesResponse.data.success) {
        const mesesPendentes = mesesResponse.data.data.mesesPendentes || [];
        const status = calcularStatusContencioso(mesesPendentes);
        setStatusContencioso(status);
      } else {
        // Se não conseguir buscar, assumir que não está em contencioso
        setStatusContencioso({
          emContencioso: false,
          mesesContenciosos: [],
          diasRestantes: 0,
          podeVerNotas: true
        });
      }
    } catch (err: any) {
      console.error('Erro ao verificar status de contencioso:', err);
      setError(err.message || 'Erro ao verificar status');
      // Em caso de erro, permitir acesso às notas
      setStatusContencioso({
        emContencioso: false,
        mesesContenciosos: [],
        diasRestantes: 0,
        podeVerNotas: true
      });
    } finally {
      setLoading(false);
    }
  }, [calcularStatusContencioso]);

  useEffect(() => {
    if (codigoAluno) {
      verificarStatusContencioso(codigoAluno);
    }
  }, [codigoAluno, verificarStatusContencioso]);

  return {
    statusContencioso,
    loading,
    error,
    verificarStatusContencioso,
    calcularStatusContencioso
  };
};

export default useStatusContencioso;
