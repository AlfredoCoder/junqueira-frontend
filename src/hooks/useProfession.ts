import { useState, useEffect, useCallback } from "react";
import ProfessionService from "@/services/profession.service";
import { Profession } from "@/types/profession.types";

/**
 * Hook personalizado para gerenciar profissões
 * @returns Objeto com profissões, estados de loading/error e funções auxiliares
 */
export function useProfessions() {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  /**
   * Buscar todas as profissões
   * @returns Lista de profissões
   */
  const fetchProfessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProfessionService.getAllProfessions();
      setProfessions(response.data || []);
    } catch (err) {
      setError(err);
      console.error("Erro ao carregar profissões:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Buscar profissão por ID
   * @param id - Código da profissão
   * @returns Dados da profissão
   */
  const getProfessionById = useCallback(async (id: number): Promise<Profession | null> => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfessionService.getProfessionById(id);
      return data;
    } catch (err) {
      setError(err);
      console.error(`Erro ao buscar profissão ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar profissões automaticamente ao montar o componente
  useEffect(() => {
    fetchProfessions();
  }, [fetchProfessions]);

  return {
    professions,
    loading,
    error,
    refetch: fetchProfessions,
    getProfessionById,
  };
}

/**
 * Hook simplificado para buscar uma profissão específica
 * @param id - Código da profissão
 * @returns Objeto com dados da profissão e estados de loading/error
 */
export function useProfession(id: number | null) {
  const [profession, setProfession] = useState<Profession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchProfession = useCallback(async () => {
    if (!id) {
      setProfession(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await ProfessionService.getProfessionById(id);
      setProfession(data);
    } catch (err) {
      setError(err);
      console.error(`Erro ao carregar profissão ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProfession();
  }, [fetchProfession]);

  return {
    profession,
    loading,
    error,
    refetch: fetchProfession,
  };
}
