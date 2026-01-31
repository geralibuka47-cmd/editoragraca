# 🚀 Guia de Deploy para Produção

## 📋 Pré-requisitos

Antes do deploy, verifique:

✅ **Build local funciona**

```bash
npm run build
```

✅ **Testes locais passaram**

- Login/Registro ✅
- Listagem de livros ✅
- Dashboard admin ✅
- CRUD completo ✅

✅ **Regras Firebase aplicadas**

- Firestore Rules ✅
- Storage Rules ✅

---

## 🌐 Opção 1: Deploy para Vercel (Recomendado)

### Passo 1: Criar Conta Vercel

1. Aceder a: <https://vercel.com>
2. Fazer login com GitHub
3. Importar repositório do projeto

### Passo 2: Configurar Projeto

**Settings → General:**

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Passo 3: Variáveis de Ambiente

**Settings → Environment Variables:**

Adicionar TODAS as variáveis do `.env`:

```env
VITE_FIREBASE_API_KEY=AIzaSyBRrRtWr79QZ9fM97vLfGaJLUiFXImX5B8
VITE_FIREBASE_AUTH_DOMAIN=editora-graca.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=editora-graca
VITE_FIREBASE_STORAGE_BUCKET=editora-graca.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=23315043977
VITE_FIREBASE_APP_ID=1:23315043977:web:8725df24c88dca9150d858
VITE_FIREBASE_MEASUREMENT_ID=G-DFLWXF6BLP
```

⚠️ **Importante:** Aplicar para **Production**, **Preview** e **Development**

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (1-2 min)
3. Vercel fornecerá URL: `https://editora-graca.vercel.app`

---

## 🔷 Opção 2: Deploy para Netlify

### Passo 1: Criar Conta Netlify

1. Aceder a: <https://netlify.com>
2. Fazer login com GitHub
3. Clique em **"Add new site"** → **"Import an existing project"**

### Passo 2: Configurar Build

**Build settings:**

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** (deixar vazio)

### Passo 3: Variáveis de Ambiente

**Site settings → Environment variables:**

Adicionar as mesmas variáveis Firebase:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... todas as outras
```

### Passo 4: Deploy

1. Clique em **"Deploy site"**
2. Aguarde build
3. Netlify fornece URL: `https://editora-graca.netlify.app`

---

## 🔐 Segurança Pós-Deploy

### 1. Configurar Domínio Autorizado no Firebase

**Firebase Console → Authentication → Settings → Authorized domains:**

Adicionar o domínio do deploy:

- `editora-graca.vercel.app` (ou Netlify)
- Se tiver domínio custom: `www.editoragraca.com`

### 2. Atualizar CORS no Firebase Storage

**Firebase Console → Storage → Rules:**

Já aplicadas anteriormente, mas verificar se estão ativas.

### 3. Configurar Redirect Rules (SPAs)

#### Vercel - criar `vercel.json`

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

#### Netlify - criar `netlify.toml`

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 📊 Configurar Firebase Analytics

### Passo 1: Ativar Analytics

**Firebase Console → Analytics → Dashboard:**

1. Clique em **"Enable Google Analytics"**
2. Escolher conta Google Analytics ou criar nova
3. Aguardar ativação (alguns minutos)

### Passo 2: Verificar Integração

O código já está preparado em `firebase.ts`:

```typescript
export const analytics = getAnalytics(app);
```

Após o primeiro acesso ao site em produção, dados começarão a aparecer no Analytics.

---

## 🧪 Testes Pós-Deploy

### Checklist Completo

#### 1. Homepage

- [ ] Página carrega sem erros
- [ ] Livros aparecem no catálogo
- [ ] Imagens carregam corretamente
- [ ] Links funcionam

#### 2. Autenticação

- [ ] Registo de novos utilizadores
- [ ] Login com email/senha
- [ ] Logout
- [ ] Reset de senha

#### 3. Catálogo

- [ ] Listagem de livros
- [ ] Detalhes do livro
- [ ] Filtros/pesquisa (se houver)

#### 4. Admin (login como admin)

- [ ] Dashboard carrega
- [ ] Criar novo livro
- [ ] Editar livro existente
- [ ] Ver utilizadores
- [ ] Gerir encomendas

#### 5. Performance

- [ ] First Contentful Paint < 2s
- [ ] Sem erros no console
- [ ] Mobile responsivo

---

## 📈 Monitorização e Logs

### 1. Firebase Console

**Monitorizar:**

- **Authentication:** Número de utilizadores, logins
- **Firestore:** Leituras/Escritas, custos
- **Storage:** Uso de espaço
- **Analytics:** Visitas, eventos

### 2. Vercel/Netlify Analytics

**Verificar:**

- Tempo de build
- Frequência de deploys
- Erros de build
- Bandwidth usage

### 3. Browser Console Errors

Testar em produção e verificar console:

```
- Nenhum erro Firebase
- Nenhum 404 para assets
- Nenhum erro de CORS
```

---

## 🔄 CI/CD Automático

### Git Push → Auto Deploy

**Já configurado automaticamente:**

1. Fazer alterações no código
2. Commit e push para GitHub:

   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push origin main
   ```

3. Vercel/Netlify detecta e faz deploy automático!

**Branches:**

- `main` → Deploy para produção
- `develop` → Deploy para preview (opcional)

---

## ⚠️ Troubleshooting Comum

### Build Falha no Deploy

**Erro:** `Module not found`
**Solução:** Verificar se todos os imports estão corretos

**Erro:** `Environment variable not found`
**Solução:** Verificar variáveis no painel do Vercel/Netlify

### Firebase Errors em Produção

**Erro:** `Permission denied`
**Solução:** Verificar Firestore Rules no Firebase Console

**Erro:** `Auth domain not authorized`
**Solução:** Adicionar domínio em Firebase Auth → Authorized domains

### Página Branca após Deploy

**Causa:** Rotas SPA não configuradas
**Solução:** Adicionar `vercel.json` ou `netlify.toml` (ver acima)

---

## 📝 Checklist Final

Antes de anunciar o site:

- [ ] DNS configurado (se domínio custom)
- [ ] HTTPS ativo (automático no Vercel/Netlify)
- [ ] Todas as páginas acessíveis
- [ ] Admin funcional
- [ ] Firebase Analytics ativo
- [ ] Backup de dados feito
- [ ] Documentação atualizada

---

## 🎉 Deploy Concluído

Seu site está no ar em:

- Vercel: `https://editora-graca.vercel.app`
- Netlify: `https://editora-graca.netlify.app`

**Próximos passos:**

1. Testar todas as funcionalidades
2. Monitorar Analytics
3. Coletar feedback de utilizadores
4. Iterar sobre melhorias

**Parabéns pela migração para Firebase! 🚀🔥**
