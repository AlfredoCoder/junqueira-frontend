import { toast } from "react-toastify"
import { ITransfer, ITransferInput, ITransferListResponse } from '@/types/transfer.types'
import api from '@/utils/api.utils';

class TransferService {
  // Listar transferências com paginação e busca
  async getTransfers(page = 1, limit = 10, search = ""): Promise<ITransferListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    })

    const response = await api.get(`/api/student-management/transferencias?${params}`);
    return response.data;
  }

  // Buscar transferência por ID
  async getTransferById(id: number): Promise<ITransfer> {
    const response = await api.get(`/api/student-management/transferencias/${id}`);
    return response.data.data;
  }

  // Criar nova transferência
  async createTransfer(data: ITransferInput): Promise<ITransfer> {
    try {
      const response = await api.post('/api/student-management/transferencias', data);
      toast.success("Transferência criada com sucesso!");
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao criar transferência";
      toast.error(errorMessage);
      throw error;
    }
  }

  // Atualizar transferência
  async updateTransfer(id: number, data: ITransferInput): Promise<ITransfer> {
    try {
      const response = await api.put(`/api/student-management/transferencias/${id}`, data);
      toast.success("Transferência atualizada com sucesso!");
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao atualizar transferência";
      toast.error(errorMessage);
      throw error;
    }
  }

  // Excluir transferência
  async deleteTransfer(id: number): Promise<void> {
    try {
      await api.delete(`/api/student-management/transferencias/${id}`);
      toast.success("Transferência excluída com sucesso!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao excluir transferência";
      toast.error(errorMessage);
      throw error;
    }
  }
}

const transferService = new TransferService();
export default transferService;
