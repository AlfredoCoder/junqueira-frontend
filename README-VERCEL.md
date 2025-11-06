# 🚀 Deploy do Frontend Junqueira na Vercel

## 📋 Pré-requisitos

1. **Conta na Vercel**: https://vercel.com
2. **Backend já deployado**: URL do backend na Vercel
3. **Repositório Git**: GitHub, GitLab, ou Bitbucket

## 🔧 Passos para Deploy

### 1. **Configurar Variáveis de Ambiente na Vercel**
```bash
# No painel da Vercel, adicionar:
NEXT_PUBLIC_API_URL="https://seu-backend.vercel.app"
NODE_ENV="production"
```

### 2. **Deploy Automático**
```bash
# 1. Conectar repositório à Vercel
# 2. Vercel detectará Next.js automaticamente
# 3. Deploy será feito automaticamente
```

### 3. **Configurar Domínio (Opcional)**
```bash
# No painel da Vercel:
# 1. Ir em "Domains"
# 2. Adicionar domínio personalizado
# 3. Configurar DNS conforme instruções
```

## 🔗 URLs Importantes

- **Frontend**: https://seu-frontend.vercel.app
- **Login**: https://seu-frontend.vercel.app/
- **Dashboard**: https://seu-frontend.vercel.app/admin

## ⚙️ Configurações Importantes

### Build
- Framework: Next.js (detectado automaticamente)
- Build Command: `npm run build`
- Output Directory: `.next`

### Performance
- Otimização automática de imagens
- Compressão automática
- CDN global

## 🐛 Troubleshooting

### Erro de Build
```bash
# Verificar se todas as dependências estão no package.json
# Executar localmente:
npm run build
```

### Erro de API
```bash
# Verificar se NEXT_PUBLIC_API_URL está correto
# Testar URL do backend diretamente
```

### Erro de Rota
```bash
# Verificar se todas as páginas estão no diretório correto
# Verificar imports e exports
```

## 🔄 Atualizações

### Deploy Automático
- Push para branch main = deploy automático
- Preview deployments para outras branches
- Rollback fácil através do painel

### Monitoramento
- Analytics integrado
- Logs de função
- Métricas de performance
