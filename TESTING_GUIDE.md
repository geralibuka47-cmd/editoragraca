# 🧪 Guia de Testes: Migração Firebase

O servidor está a correr em: **<http://localhost:5173>**

Siga esta checklist para testar se a migração Firebase está a funcionar corretamente.

---

## ✅ Checklist de Testes

### 1️⃣ Página Inicial (HomePage)

**Testes:**

- [ ] A página carrega sem erros
- [ ] O livro "Palavras Não Ditas" aparece no catálogo
- [ ] A capa do livro é exibida corretamente
- [ ] Ao clicar no livro, abre os detalhes

**Erros esperados:** ❌ Nenhum  
**Console:** Abra DevTools (F12) e verifique se não há erros vermelhos

---

### 2️⃣ Autenticação - Login

**Testes:**

- [ ] Clique em "Entrar" no menu
- [ ] Tente fazer login com:
  - **Email:** `geraleditoragraca@gmail.com`
  - **Senha:** (sua senha de admin)
- [ ] Login deve funcionar
- [ ] Após login, o nome "Administrador Editora Graça" aparece no menu
- [ ] O menu mostra opção "Painel Admin"

**Erros esperados:** ❌ Nenhum  
**Console:** Verifique se aparece confirmação de autenticação Firebase

---

### 3️⃣ Dashboard Admin

**Testes:**

- [ ] Acesse "Painel Admin"
- [ ] A aba "Livros" mostra "Palavras Não Ditas"
- [ ] Clique em "Editar" no livro
- [ ] Modal de edição abre corretamente
- [ ] Tente adicionar um novo livro (apenas testar o formulário, não precisa salvar)

**Erros esperados:** ❌ Nenhum  
**Console:** Verifique chamadas ao Firestore (deve aparecer `@firebase/firestore`)

---

### 4️⃣ Catálogo de Livros

**Testes:**

- [ ] Vá para a página "Catálogo"
- [ ] O livro "Palavras Não Ditas" aparece
- [ ] Clique no livro
- [ ] Modal com detalhes abre
- [ ] Informações corretas: Autor "Ngunga", Categoria "Poesia"
- [ ] Botão de download aparece (é grátis)

**Erros esperados:** ❌ Nenhum

---

### 5️⃣ Logout e Re-login

**Testes:**

- [ ] Clique em "Sair"
- [ ] Redireciona para homepage
- [ ] Faça login novamente
- [ ] Login funciona sem problemas

---

### 6️⃣ Registro de Novo Utilizador (Opcional)

**Testes:**

- [ ] Clique em "Registar" (se disponível)
- [ ] Crie uma conta teste
- [ ] Registo deve funcionar
- [ ] Novo utilizador é salvo no Firestore

**Para verificar:** Firebase Console → Firestore → `users` → Novo documento criado

---

## 🔍 Verificar no Firebase Console

Acesse: <https://console.firebase.google.com/project/editora-graca/firestore>

### Verificações

1. **Coleção `users`:**
   - ✅ 3 documentos existentes
   - ✅ Se registou novo utilizador, deve ter +1

2. **Coleção `books`:**
   - ✅ 1 documento: "Palavras Não Ditas"
   - ✅ Se criou novo livro, deve ter +1

3. **Coleção `bookViews`:**
   - ✅ 10+ documentos (aumenta ao visualizar livros)

---

## ❌ Problemas Comuns

### Erro: "Permission Denied"

**Causa:** Regras de segurança não foram aplicadas  
**Solução:** Aplicar `firestore.rules` no Firebase Console

### Erro: "Failed to fetch"

**Causa:** Credenciais Firebase incorretas no `.env`  
**Solução:** Verificar `VITE_FIREBASE_*` no `.env`

### Login não funciona

**Causa:** Utilizador não existe no Firebase Authentication  
**Solução:**

1. Firebase Console → Authentication → Users
2. Adicionar utilizador manualmente OU
3. Usar registro para criar novo

---

## 📊 Resultado Esperado

### ✅ SUCESSO se

- ✅ Página carrega sem erros
- ✅ Login funciona
- ✅ Livros aparecem no catálogo
- ✅ Dashboard admin funciona
- ✅ Dados são lidos/escritos no Firestore

### ❌ FALHA se

- ❌ Erros 403/Permission Denied
- ❌ Livros não carregam
- ❌ Login não funciona
- ❌ Console cheio de erros

---

## 📝 Relatório de Testes

Após testar, responda:

1. **Homepage funciona?** Sim/Não
2. **Login funciona?** Sim/Não
3. **Livros aparecem?** Sim/Não
4. **Admin dashboard funciona?** Sim/Não
5. **Console tem erros?** Sim/Não (se sim, quais?)

---

## 🚀 Próximos Passos

Se **TODOS** os testes passarem:

- ✅ Migração Firebase **COMPLETA**
- ✅ Remover código Supabase
- ✅ Deploy para produção

Se **algum teste falhar**:

- ❌ Reportar erros
- ❌ Debug e correção necessária
