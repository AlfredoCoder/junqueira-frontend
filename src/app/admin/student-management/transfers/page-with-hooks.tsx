"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

// Interface simplificada para transferência
interface SimpleTransfer {
  codigo: number;
  alunoNome: string;
  escolaDestino: string;
  motivo: string;
  dataTransferencia: string;
  status: string;
}

// Dados mock para demonstração
const mockTransfers: SimpleTransfer[] = [
  {
    codigo: 1,
    alunoNome: "João Silva",
    escolaDestino: "Escola Secundária do Cazenga",
    motivo: "Mudança de residência",
    dataTransferencia: "2024-01-15",
    status: "Aprovada"
  },
  {
    codigo: 2,
    alunoNome: "Maria Santos",
    escolaDestino: "Instituto Médio Politécnico de Luanda",
    motivo: "Mudança de curso",
    dataTransferencia: "2024-01-20",
    status: "Pendente"
  },
  {
    codigo: 3,
    alunoNome: "Pedro Costa",
    escolaDestino: "Colégio São José",
    motivo: "Motivos familiares",
    dataTransferencia: "2024-01-25",
    status: "Rejeitada"
  }
];

export default function TransfersListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [transfers, setTransfers] = useState<SimpleTransfer[]>(mockTransfers);
  const [loading, setLoading] = useState(false);

  // Filtrar transferências baseado na busca
  const filteredTransfers = transfers.filter(transfer =>
    transfer.alunoNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.escolaDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transfer.motivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleView = useCallback((transfer: SimpleTransfer) => {
    console.log('Visualizar transferência:', transfer);
  }, []);

  const handleEdit = useCallback((transfer: SimpleTransfer) => {
    console.log('Editar transferência:', transfer);
  }, []);

  const handleDelete = useCallback((transfer: SimpleTransfer) => {
    console.log('Excluir transferência:', transfer);
    // Simular exclusão
    setTransfers(prev => prev.filter(t => t.codigo !== transfer.codigo));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aprovada':
        return <Badge className="bg-green-100 text-green-800">Aprovada</Badge>;
      case 'Pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'Rejeitada':
        return <Badge className="bg-red-100 text-red-800">Rejeitada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  return (
    <div className="space-y-6 ultra-fast-fade">
      <WelcomeHeader
        title="Gestão de Transferências de Alunos"
        description="Gerencie todas as transferências de alunos. Visualize informações detalhadas, acompanhe status e mantenha os registros sempre atualizados."
      />

      {/* Filtros */}
      <FilterSearchCard
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        placeholder="Buscar por aluno, escola ou motivo..."
        showAddButton={true}
        addButtonText="Nova Transferência"
        onAddClick={() => console.log('Nova transferência')}
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transfers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transfers.filter(t => t.status === 'Aprovada').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {transfers.filter(t => t.status === 'Pendente').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {transfers.filter(t => t.status === 'Rejeitada').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Transferências */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Transferências ({filteredTransfers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Escola de Destino</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransfers.map((transfer) => (
                  <TableRow key={transfer.codigo}>
                    <TableCell className="font-medium">
                      {transfer.alunoNome}
                    </TableCell>
                    <TableCell>{transfer.escolaDestino}</TableCell>
                    <TableCell>{transfer.motivo}</TableCell>
                    <TableCell>{formatDate(transfer.dataTransferencia)}</TableCell>
                    <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(transfer)}
                          className="instant-hover"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(transfer)}
                          className="instant-hover"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transfer)}
                          className="instant-hover text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransfers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhuma transferência encontrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
