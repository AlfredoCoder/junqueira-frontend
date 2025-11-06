# Sistema de Cache e Persistência de Dados

## 📋 Resumo

Implementado sistema de cache com persistência usando `sessionStorage` para evitar recarregamentos desnecessários de dados ao navegar entre páginas.

## ✅ Hooks Atualizados com Cache

### 1. **useReports.ts**
- ✅ `useStudentReports()` - Relatórios de alunos
- ✅ `useFinancialReports()` - Relatórios financeiros  
- ✅ `useAcademicReports()` - Relatórios acadêmicos

**Cache Key:** `student-report`, `financial-report`, `academic-report`
**TTL:** 5 minutos

### 2. **useClass.ts**
- ✅ `useClasses()` - Lista de classes

**Cache Key:** `classes-{page}-{limit}-{search}`
**TTL:** 5 minutos

### 3. **useCourse.ts**
- ✅ `useAllCourses()` - Lista de todos os cursos

**Cache Key:** `all-courses-{search}-{includeArchived}`
**TTL:** 5 minutos

## 🎯 Funcionalidades Implementadas

### 1. **Cache Automático**
- Dados são salvos automaticamente no `sessionStorage`
- Cache é verificado antes de fazer novas requisições
- TTL de 5 minutos para expiração automática

### 2. **Prevenção de Requisições Duplicadas**
- Flag `fetchingRef` previne múltiplas requisições simultâneas
- Evita race conditions e requisições desnecessárias

### 3. **Gerenciamento de Componente Montado**
- `isMountedRef` previne atualizações de estado em componentes desmontados
- Evita memory leaks e warnings do React

### 4. **Cache por Filtros**
- Cache considera os filtros aplicados
- Diferentes combinações de filtros geram caches separados
- Garante que dados filtrados sejam mantidos corretamente

## 🔧 Como Funciona

### Fluxo de Busca de Dados

```typescript
1. Usuário acessa página
2. Hook verifica se há cache válido
3. Se SIM: Retorna dados do cache (instantâneo)
4. Se NÃO: Faz requisição à API
5. Salva resposta no cache
6. Retorna dados ao componente
```

### Exemplo de Uso

```typescript
// Antes (sem cache)
const { classes, loading } = useClasses();
// Sempre faz requisição ao montar

// Depois (com cache)
const { classes, loading } = useClasses();
// Primeira vez: faz requisição
// Próximas vezes (< 5 min): usa cache
```

## 📊 Benefícios

### 1. **Performance**
- ⚡ Carregamento instantâneo de dados em cache
- 🚀 Redução de requisições à API
- 💾 Menor uso de banda

### 2. **Experiência do Usuário**
- ✨ Navegação mais fluida entre páginas
- 🎯 Dados persistem ao voltar para páginas visitadas
- ⏱️ Sem loading desnecessário

### 3. **Otimização de Recursos**
- 🔄 Menos carga no servidor
- 💰 Economia de recursos de rede
- 🌐 Melhor uso do navegador

## 🛠️ Hook Genérico: useDataCache

Criado hook reutilizável para qualquer tipo de dado:

```typescript
import { useDataCache } from '@/hooks/useDataCache';

// Exemplo de uso
const { data, loading, error, refetch, revalidate } = useDataCache(
  () => api.getData(),
  {
    key: 'my-data-key',
    ttl: 5 * 60 * 1000, // 5 minutos
    enabled: true
  }
);
```

### Funcionalidades do Hook

- ✅ Cache automático com TTL configurável
- ✅ Invalidação manual de cache
- ✅ Revalidação forçada
- ✅ Verificação de dados obsoletos
- ✅ Gerenciamento de loading e erros

## 📝 Próximos Passos (Opcional)

### Hooks que podem receber cache:

1. **useTurmas** - Lista de turmas
2. **useStudents** - Lista de alunos
3. **usePayments** - Pagamentos
4. **useServices** - Serviços
5. **useDisciplines** - Disciplinas

### Melhorias Futuras:

- [ ] Implementar cache com SWR (Stale-While-Revalidate)
- [ ] Adicionar React Query para gerenciamento avançado
- [ ] Implementar cache offline com IndexedDB
- [ ] Adicionar sincronização em background
- [ ] Implementar invalidação automática por eventos

## 🔍 Monitoramento

### Console Logs
O sistema exibe logs no console para debug:

```
✅ Cache hit para student-report
🔄 Hook useStudentReports: Iniciando geração de relatório...
✅ Hook useStudentReports: Relatório gerado com sucesso
```

### Verificar Cache no DevTools

```javascript
// No console do navegador
sessionStorage.getItem('student-report')
sessionStorage.getItem('classes-1-100-')
sessionStorage.getItem('all-courses--false')
```

## ⚙️ Configuração

### Ajustar TTL (Time To Live)

```typescript
// Em cada hook, modificar:
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos
const CACHE_TTL = 1 * 60 * 1000;  // 1 minuto
const CACHE_TTL = 30 * 60 * 1000; // 30 minutos
```

### Desabilitar Cache (se necessário)

```typescript
// Comentar a verificação de cache
// const cached = getCachedData<T>(cacheKey);
// if (cached) {
//   setData(cached);
//   return;
// }
```

## 🧹 Limpeza de Cache

### Manual (pelo usuário)
- Limpar dados do navegador
- Fechar aba/navegador (sessionStorage)

### Programática

```typescript
// Limpar cache específico
sessionStorage.removeItem('student-report');

// Limpar todo o cache
sessionStorage.clear();
```

## 📚 Referências

- [SessionStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [SWR Documentation](https://swr.vercel.app/)
- [React Query](https://tanstack.com/query/latest)

---

**Implementado em:** 22/10/2025
**Desenvolvedor:** Sistema Jomorais
**Versão:** 1.0.0
