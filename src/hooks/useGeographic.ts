import { useState, useEffect, useCallback } from "react";
import GeographicService, {
  Nacionalidade,
  EstadoCivil,
  Provincia,
  Municipio,
  Comuna,
  GeographicHierarchy,
  SearchResult
} from "@/services/geographic.service";

// Hook para nacionalidades
export function useNacionalidades() {
  const [nacionalidades, setNacionalidades] = useState<Nacionalidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchNacionalidades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const nacionalidadesData = await GeographicService.getAllNacionalidades();
      setNacionalidades(nacionalidadesData || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNacionalidades();
  }, [fetchNacionalidades]);

  const getNacionalidadeById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getNacionalidadeById(id);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    nacionalidades,
    loading,
    error,
    refetch: fetchNacionalidades,
    getNacionalidadeById
  };
}

// Hook para estados civis
export function useEstadoCivil() {
  const [estadosCivis, setEstadosCivis] = useState<EstadoCivil[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchEstadosCivis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getAllEstadoCivil();
      setEstadosCivis(response.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEstadosCivis();
  }, [fetchEstadosCivis]);

  const getEstadoCivilById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getEstadoCivilById(id);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    estadosCivis,
    loading,
    error,
    refetch: fetchEstadosCivis,
    getEstadoCivilById
  };
}

// Hook para províncias
export function useProvincias() {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchProvincias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getAllProvincias();
      setProvincias(response.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProvincias();
  }, [fetchProvincias]);

  const getProvinciaById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getProvinciaById(id);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    provincias,
    loading,
    error,
    refetch: fetchProvincias,
    getProvinciaById
  };
}

// Hook para municípios
export function useMunicipios(provinciaId?: number) {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchMunicipios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (provinciaId) {
        response = await GeographicService.getMunicipiosByProvincia(provinciaId);
      } else {
        response = await GeographicService.getAllMunicipios();
      }
      
      setMunicipios(response.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [provinciaId]);

  useEffect(() => {
    fetchMunicipios();
  }, [fetchMunicipios]);

  const getMunicipioById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getMunicipioById(id);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMunicipiosByProvincia = useCallback(async (provId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getMunicipiosByProvincia(provId);
      setMunicipios(response.data || []);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    municipios,
    loading,
    error,
    refetch: fetchMunicipios,
    getMunicipioById,
    getMunicipiosByProvincia
  };
}

// Hook para comunas
export function useComunas(municipioId?: number) {
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchComunas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (municipioId) {
        response = await GeographicService.getComunasByMunicipio(municipioId);
      } else {
        response = await GeographicService.getAllComunas();
      }

      setComunas(response.data || []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [municipioId]);

  useEffect(() => {
    fetchComunas();
  }, [fetchComunas]);

  const getComunaById = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getComunaById(id);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getComunasByMunicipio = useCallback(async (munId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getComunasByMunicipio(munId);
      setComunas(response.data || []);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    comunas,
    loading,
    error,
    refetch: fetchComunas,
    getComunaById,
    getComunasByMunicipio
  };
}

// Hook para hierarquia geográfica completa
export function useGeographicHierarchy() {
  const [hierarchy, setHierarchy] = useState<GeographicHierarchy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchHierarchy = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.getGeographicHierarchy();
      setHierarchy(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHierarchy();
  }, [fetchHierarchy]);

  return {
    hierarchy,
    loading,
    error,
    refetch: fetchHierarchy
  };
}

// Hook para busca geográfica
export function useGeographicSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const search = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await GeographicService.searchGeographic(searchTerm.trim());
      setResults(response.data || []);
    } catch (err) {
      setError(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
}

// Hook principal que combina todas as funcionalidades
export function useGeographic() {
  const nacionalidades = useNacionalidades();
  const estadosCivis = useEstadoCivil();
  const provincias = useProvincias();
  const municipios = useMunicipios();
  const comunas = useComunas();
  const hierarchy = useGeographicHierarchy();
  const search = useGeographicSearch();

  return {
    nacionalidades,
    estadosCivis,
    provincias,
    municipios,
    comunas,
    hierarchy,
    search
  };
}