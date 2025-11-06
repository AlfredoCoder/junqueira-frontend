import api from "@/utils/api.utils";

export default class UsersService {

  /**
   * Busca todos os usuários legados com paginação
   * @param {number} page - número da página (default: 1)
   * @param {number} limit - quantidade por página (default: 10)
   * @returns {Promise<{success: boolean, message: string, meta: object, data: Array}>}
   */
  static async getAllUsersLegacy(page = 1, limit = 10) {
    try {
      const response = await api.get("/api/users/legacy", {
        params: { page, limit }, // manda paginação via query
      });

      return response.data; // já vem estruturado conforme o backend
    } catch (error) {
      console.error("Erro ao buscar usuários legados:", error);
      throw error;
    }
  }

  static async getUserLegacyById(id: number) {
    try {
      const response = await api.get(`/api/users/legacy/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário legado com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Criar novo usuário legado
   */
  static async createLegacyUser(userData: any) {
    try {
      const response = await api.post("/api/users/legacy", userData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário legado:", error);
      throw error;
    }
  }

  /**
   * Atualizar usuário legado
   */
  static async updateLegacyUser(id: number, userData: any) {
    try {
      const response = await api.put(`/api/users/legacy/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar usuário legado com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Deletar usuário legado
   */
  static async deleteLegacyUser(id: number) {
    try {
      const response = await api.delete(`/api/users/legacy/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar usuário legado com ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Desativar usuário legado
   */
  static async deactivateLegacyUser(id: number) {
    try {
      const response = await api.patch(`/api/users/legacy/${id}/deactivate`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao desativar usuário legado com ID ${id}:`, error);
      throw error;
    }
  }
}
