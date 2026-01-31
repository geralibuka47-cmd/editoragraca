# Firebase Security Rules Configuration Guide

## 🔐 Configurar Regras de Segurança do Firestore

Para permitir a importação de dados e o funcionamento da aplicação, você precisa configurar as regras de segurança no Firebase Console.

### Passo 1: Aceder ao Firebase Console

1. Abra o **Firebase Console**: <https://console.firebase.google.com/>
2. Selecione o projeto: **editora-graca**
3. No menu lateral, clique em **Firestore Database**
4. Clique na aba **Regras** (Rules)

### Passo 2: Copiar as Regras

Copie todo o conteúdo do ficheiro [`firestore.rules`](file:///c:/www/editoragraca-novo/firestore.rules) que está na raiz do projeto.

### Passo 3: Colar no Firebase Console

1. No Firebase Console, **SUBSTITUA** todo o conteúdo existente pelas novas regras
2. Clique em **Publicar** (Publish)

### Passo 4: Regras Temporárias para Importação

**ATENÇÃO**: Para a importação inicial, você precisa de regras TEMPORÁRIAS mais permissivas:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORÁRIO: Permitir todas as operações para importação
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### ⚠️ Processo Recomendado

1. **APLICAR regras temporárias** (acima) para permitir a importação
2. **EXECUTAR o script de importação**: `node scripts/import-to-firebase.js`
3. **TROCAR de volta** para as regras de segurança completas do ficheiro `firestore.rules`
4. **PUBLICAR** novamente

### Passo 5: Verificar

Após aplicar as regras, execute:

```bash
node scripts/import-to-firebase.js
```

Se aparecer "PERMISSION DENIED" novamente, verifique se:

- As regras foram publicadas corretamente
- Não há erros de sintaxe nas regras
- O projeto Firebase está ativo

---

## 📋 Resumo das Regras de Segurança

### Públicas (Leitura Aberta)

- ✅ Livros (`books`)
- ✅ Posts do Blog (`blog`)
- ✅ Depoimentos ativos (`testimonials`)
- ✅ Conteúdo do Site (`siteContent`)
- ✅ Equipa (`team`)
- ✅ Serviços (`services`)
- ✅ Perfis de utilizadores (`users`)

### Autenticação Necessária

- 🔐 Criar encomendas (`orders`)
- 🔐 Favoritar livros (`bookFavorites`)
- 🔐 Comentar no blog (`blogComments`)
- 🔐 Dar like em posts (`blogLikes`)
- 🔐 Submeter manuscritos (`manuscripts`)
- 🔐 Enviar notificações de pagamento (`paymentNotifications`)

### Apenas Administradores

- 🔒 Gerir livros (criar/editar/eliminar)
- 🔒 Gerir posts do blog
- 🔒 Gerir equipa e serviços
- 🔒 Aprovar manuscritos
- 🔒 Confirmar pagamentos
- 🔒 Eliminar utilizadores

### Apenas Autores

- ✍️ Criar/editar seus próprios livros
- ✍️ Ver estatísticas de vendas dos seus livros

---

## 🚨 Importante

- **NUNCA** deixe as regras totalmente abertas (`allow read, write: if true;`) em produção!
- As regras temporárias são **APENAS para a importação inicial**
- Após a importação, **aplique imediatamente** as regras de segurança completas

---

## 📞 Próximos Passos

1. Aplicar regras temporárias
2. Executar importação
3. Aplicar regras de segurança completas
4. Testar a aplicação
