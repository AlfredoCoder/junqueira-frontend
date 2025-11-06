import api from "@/utils/api.utils";

// Tipos para as entidades geográficas
export interface Nacionalidade {
  codigo: number;
  designacao: string;
  // Campos compatíveis com a interface antiga para não quebrar o código existente
  id?: number;
  nome?: string;
}

export interface EstadoCivil {
  id: number;
  nome: string;
}

export interface Provincia {
  codigo?: number;
  designacao?: string;
  // Campos compatíveis com a interface antiga
  id: number;
  nome: string;
}

export interface Municipio {
  codigo?: number;
  designacao?: string;
  provincia_id: number;
  // Campos compatíveis com a interface antiga
  id: number;
  nome: string;
  provincia?: Provincia;
}

export interface Comuna {
  codigo?: number;
  designacao?: string;
  municipio_id: number;
  // Campos compatíveis com a interface antiga
  id: number;
  nome: string;
  municipio?: Municipio;
}

export interface GeographicHierarchy {
  provincias: (Provincia & {
    municipios: (Municipio & {
      comunas: Comuna[];
    })[];
  })[];
}

export interface SearchResult {
  type: 'provincia' | 'municipio' | 'comuna';
  id: number;
  nome: string;
  hierarchy?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default class GeographicService {

  // ===============================
  // NACIONALIDADES
  // ===============================

  static async getAllNacionalidades(): Promise<Nacionalidade[]> {
    try {
      const response = await api.get("/api/geographic/nacionalidades");

      // A API retorna um array direto ou um objeto com propriedade data?
      const data = Array.isArray(response.data) ? response.data : response.data.data;

      // Mapear os dados para incluir campos compatíveis
      return data.map((item: any) => ({
        codigo: item.codigo,
        designacao: item.designacao,
        id: item.codigo, // Compatibilidade
        nome: item.designacao // Compatibilidade
      }));
    } catch (error) {
      console.error("Erro ao buscar nacionalidades:", error);
      throw error;
    }
  }

  static async getNacionalidadeById(id: number): Promise<ApiResponse<Nacionalidade>> {
    try {
      const response = await api.get(`/api/geographic/nacionalidades/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar nacionalidade ${id}:`, error);
      throw error;
    }
  }

  // ===============================
  // ESTADO CIVIL
  // ===============================

  static async getAllEstadoCivil(): Promise<ApiResponse<EstadoCivil[]>> {
    try {
      const response = await api.get("/api/geographic/estado-civil");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estados civis:", error);
      throw error;
    }
  }

  static async getEstadoCivilById(id: number): Promise<ApiResponse<EstadoCivil>> {
    try {
      const response = await api.get(`/api/geographic/estado-civil/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar estado civil ${id}:`, error);
      throw error;
    }
  }

  // ===============================
  // PROVÍNCIAS
  // ===============================

  static async getAllProvincias(): Promise<ApiResponse<Provincia[]>> {
    try {
      const response = await api.get("/api/geographic/provincias");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar províncias:", error);
      throw error;
    }
  }

  static async getProvinciaById(id: number): Promise<ApiResponse<Provincia>> {
    try {
      const response = await api.get(`/api/geographic/provincias/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar província ${id}:`, error);
      throw error;
    }
  }

  // ===============================
  // MUNICÍPIOS
  // ===============================

  static async getAllMunicipios(): Promise<ApiResponse<Municipio[]>> {
    try {
      const response = await api.get("/api/geographic/municipios");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar municípios:", error);
      throw error;
    }
  }

  static async getMunicipioById(id: number): Promise<ApiResponse<Municipio>> {
    try {
      const response = await api.get(`/api/geographic/municipios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar município ${id}:`, error);
      throw error;
    }
  }

  static async getMunicipiosByProvincia(provinciaId: number): Promise<ApiResponse<Municipio[]>> {
    try {
      const response = await api.get(`/api/geographic/provincias/${provinciaId}/municipios`);
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao buscar municípios da província ${provinciaId}:`, error);
      throw error;
    }
  }

  // ===============================
  // COMUNAS
  // ===============================

  static async getAllComunas(): Promise<ApiResponse<Comuna[]>> {
    try {
      const response = await api.get("/api/geographic/comunas");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar comunas:", error);
      throw error;
    }
  }

  static async getComunaById(id: number): Promise<ApiResponse<Comuna>> {
    try {
      const response = await api.get(`/api/geographic/comunas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comuna ${id}:`, error);
      throw error;
    }
  }

  static async getComunasByMunicipio(municipioId: number): Promise<ApiResponse<Comuna[]>> {
    try {
      const response = await api.get(`/api/geographic/municipios/${municipioId}/comunas`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar comunas do município ${municipioId}:`, error);
      throw error;
    }
  }

  // ===============================
  // OPERAÇÕES ESPECIAIS
  // ===============================

  static async getGeographicHierarchy(): Promise<ApiResponse<GeographicHierarchy>> {
    try {
      const response = await api.get("/api/geographic/hierarchy");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar hierarquia geográfica:", error);
      throw error;
    }
  }

  static async searchGeographic(searchTerm: string): Promise<ApiResponse<SearchResult[]>> {
    try {
      const response = await api.get("/api/geographic/search", {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao realizar busca geográfica:", error);
      throw error;
    }
  }
}