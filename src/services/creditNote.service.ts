// services/creditNote.service.ts
import api from '@/utils/api.utils';
import {
  ICreditNote,
  ICreditNoteInput,
  ICreditNoteResponse,
  ICreditNoteListResponse,
} from '@/types/creditNote.types';

class CreditNoteService {
  private baseURL = '/api/payment-management/notas-credito';

  async getAll(page: number = 1, limit: number = 10, search: string = ''): Promise<ICreditNoteListResponse> {
    const response = await api.get<ICreditNoteListResponse>(this.baseURL, {
      params: { page, limit, search },
    });
    return response.data;
  }

  async getById(id: number): Promise<ICreditNote> {
    const response = await api.get<ICreditNoteResponse>(`${this.baseURL}/${id}`);
    return response.data.data;
  }

  async create(data: ICreditNoteInput): Promise<ICreditNote> {
    const response = await api.post<ICreditNoteResponse>(this.baseURL, data);
    return response.data.data;
  }

  async update(id: number, data: Partial<ICreditNoteInput>): Promise<ICreditNote> {
    const response = await api.put<ICreditNoteResponse>(`${this.baseURL}/${id}`, data);
    return response.data.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.baseURL}/${id}`);
  }
}

export default new CreditNoteService();
