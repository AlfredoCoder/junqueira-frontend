"use client";

import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Shield } from 'lucide-react';

export function UserPermissionsDebug() {
  const { permissions, canAccess, user, userInfo, userType, hasFullAccess, loading } = usePermissions();

  if (!user) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Usuário não autenticado
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Carregando permissões...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Usar o novo sistema de permissões
  const permissionItems = [
    { key: 'dashboard', label: 'Dashboard', check: () => canAccess.dashboard() },
    { key: 'gestaoAlunos', label: 'Gestão de Alunos', check: () => canAccess.gestaoAlunos() },
    { key: 'gestaoAcademica', label: 'Gestão Acadêmica', check: () => canAccess.gestaoAcademica() },
    { key: 'lancamentoNotas', label: 'Lançamento de Notas', check: () => canAccess.lancamentoNotas() },
    { key: 'visualizarNotas', label: 'Visualizar Notas', check: () => canAccess.visualizarNotas() },
    { key: 'professores', label: 'Gestão de Professores', check: () => canAccess.professores() },
    { key: 'financeiro', label: 'Financeiro (Geral)', check: () => canAccess.financeiro() },
    { key: 'pagamentos', label: 'Pagamentos', check: () => canAccess.pagamentos() },
    { key: 'relatoriosFinanceiros', label: 'Relatórios Financeiros', check: () => canAccess.relatoriosFinanceiros() },
    { key: 'configuracoes', label: 'Configurações', check: () => canAccess.configuracoes() },
    { key: 'usuarios', label: 'Gerenciar Usuários', check: () => canAccess.usuarios() },
  ];

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Permissões do Usuário
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do usuário */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Informações do Usuário</h3>
          <div className="space-y-1 text-sm ultra-fast-fade">
            <p><strong>Nome:</strong> {user.nome}</p>
            <p><strong>Username:</strong> {(user as any).user || (user as any).username}</p>
            <p><strong>Tipo:</strong> {userInfo?.tipo || (user as any).tipo}</p>
            <p><strong>ID:</strong> {(user as any).codigo || (user as any).id}</p>
          </div>
          <div className="mt-2 space-x-2">
            <Badge variant={hasFullAccess ? "default" : "secondary"}>
              {hasFullAccess ? "Acesso Total" : `Acesso Limitado`}
            </Badge>
            {userInfo && (
              <>
                {userInfo.isAdmin && <Badge variant="destructive">Admin</Badge>}
                {userInfo.isProfessor && <Badge variant="outline">Professor</Badge>}
                {userInfo.isAluno && <Badge variant="outline">Aluno</Badge>}
                {userInfo.isSecretaria && <Badge variant="outline">Secretária</Badge>}
                {userInfo.isDiretor && <Badge variant="outline">Diretor</Badge>}
              </>
            )}
          </div>
        </div>

        {/* Permissões do sistema integrado */}
        {permissions && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Permissões Brutas (Sistema Integrado)</h3>
            <div className="text-xs space-y-1">
              {Object.entries(permissions).map(([modulo, acoes]) => (
                <div key={modulo}>
                  <strong>{modulo}:</strong> [{Array.isArray(acoes) ? acoes.join(', ') : 'N/A'}]
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de permissões */}
        <div>
          <h3 className="font-semibold mb-3">Permissões Funcionais</h3>
          <div className="grid grid-cols-1 gap-2">
            {permissionItems.map(({ key, label, check }) => {
              const hasPermission = check();
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    hasPermission ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  {hasPermission ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
