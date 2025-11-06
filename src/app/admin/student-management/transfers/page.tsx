"use client";

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';
import { WelcomeHeader } from '@/components/dashboard';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  MapPin, 
  User,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Transfer {
  id: number;
  studentName: string;
  studentNumber: string;
  currentSchool: string;
  destinationSchool: string;
  transferDate: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada' | 'Concluída';
  reason: string;
}

export default function TransfersPage() {
  // Estados otimizados
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState<string | null>(null);
  
  // Debounce para busca
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Carregar dados reais
  const loadTransfers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Tentar carregar do backend
      try {
        const response = await fetch('${process.env.NEXT_PUBLIC_API_URL}/api/transfers');
        if (response.ok) {
          const data = await response.json();
          setTransfers(data.data || []);
        } else {
          // Se não há dados, usar array vazio
          setTransfers([]);
        }
      } catch (err) {
        console.log('API de transferências não disponível');
        setTransfers([]);
      }
      
    } catch (error) {
      console.error('Erro ao carregar transferências:', error);
      setError('Erro ao carregar dados');
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados na montagem
  useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

  // Filtrar transferências com useMemo
  const filteredTransfers = useMemo(() => {
    if (!searchTerm.trim()) return transfers;
    
    const term = searchTerm.toLowerCase();
    return transfers.filter(transfer => 
      transfer.studentName.toLowerCase().includes(term) ||
      transfer.studentNumber.toLowerCase().includes(term) ||
      transfer.destinationSchool.toLowerCase().includes(term)
    );
  }, [transfers, searchTerm]);

  // Handlers otimizados
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleNewTransfer = useCallback(() => {
    // Navegar para página de nova transferência
    window.location.href = '/admin/student-management/transfers/add';
  }, []);

  const handleViewTransfer = useCallback((transferId: number) => {
    // Navegar para visualização da transferência
    window.location.href = `/admin/student-management/transfers/view/${transferId}`;
  }, []);

  const handleEditTransfer = useCallback((transferId: number) => {
    // Navegar para edição da transferência
    window.location.href = `/admin/student-management/transfers/edit/${transferId}`;
  }, []);

  // Função para obter cor do status
  const getStatusBadge = useCallback((status: string) => {
    const statusMap = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Aprovada': 'bg-green-100 text-green-800',
      'Rejeitada': 'bg-red-100 text-red-800',
      'Concluída': 'bg-blue-100 text-blue-800'
    };
    
    return statusMap[status as keyof typeof statusMap] || statusMap['Pendente'];
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  }, []);

  // Loading state otimizado
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <WelcomeHeader
          title="Gestão de Transferências"
          description="Gerencie transferências de alunos entre escolas."
        />
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <FileText className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Erro ao carregar dados</p>
                <p className="text-sm text-gray-600 mt-1">{error}</p>
              </div>
              <Button onClick={loadTransfers} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <WelcomeHeader
        title="Gestão de Transferências"
        description="Gerencie transferências de alunos entre escolas. Acompanhe solicitações e processos de mudança."
        titleBtnRight="Nova Transferência"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={handleNewTransfer}
      />

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por aluno, número ou escola destino..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={loadTransfers} variant="outline">
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transferências
            {filteredTransfers.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredTransfers.length} {filteredTransfers.length === 1 ? 'transferência' : 'transferências'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransfers.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">
                {searchTerm ? 'Nenhuma transferência encontrada para a busca.' : 'Nenhuma transferência encontrada.'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {searchTerm ? 'Tente ajustar os termos de busca.' : 'Comece criando uma nova transferência.'}
              </p>
              {searchTerm ? (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                >
                  Limpar Busca
                </Button>
              ) : (
                <Button onClick={handleNewTransfer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Transferência
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Escola Atual</TableHead>
                    <TableHead>Escola Destino</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransfers.map((transfer) => (
                    <TableRow key={transfer.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="font-medium">{transfer.studentName}</p>
                          <p className="text-sm text-gray-500">Nº {transfer.studentNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          {transfer.currentSchool}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-blue-400 mr-2" />
                          {transfer.destinationSchool}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(transfer.transferDate)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(transfer.status)}>
                          {transfer.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTransfer(transfer.id)}
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTransfer(transfer.id)}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
