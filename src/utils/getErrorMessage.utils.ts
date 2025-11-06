import { AxiosError } from "axios";

// Função auxiliar para extrair mensagem de erro da API
export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message as string;
  }
  return defaultMessage;
};