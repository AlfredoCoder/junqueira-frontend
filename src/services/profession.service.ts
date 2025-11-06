import api from "@/utils/api.utils";
import { Profession } from "@/types/profession.types";

class ProfessionService {
  /**
   * Buscar todas as profissões
   * @returns Promise com a lista de profissões ordenadas por designação
   */
  static async getAllProfessions(): Promise<Profession[]> {
    try {
      const response = await api.get<Profession[]>("/api/institutional/profissoes");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar profissões:", error);
      throw error;
    }
  }

  /**
   * Buscar profissão por ID
   * @param id - Código da profissão
   * @returns Promise com os dados da profissão
   */
  static async getProfessionById(id: number): Promise<Profession> {
    try {
      const response = await api.get<Profession>(`/api/institutional/profissoes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar profissão com ID ${id}:`, error);
      throw error;
    }
  }
}

export default ProfessionService;
