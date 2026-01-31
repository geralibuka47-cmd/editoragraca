# 🚨 Solução: Importação Manual via Firebase Console

Como o script automático está a falhar devido a permissões, a solução **MAIS SIMPLES** é importar manualmente via Firebase Console.

## 📋 Método Recomendado: Importação Manual

### Passo 1: Criar Coleções no Firestore

1. Aceda a: <https://console.firebase.google.com/project/editora-graca/firestore>
2. Clique em **"Start collection"** (Iniciar coleção)
3. Crie as seguintes coleções (**UMA DE CADA VEZ**):

#### Coleção: `users`

- **Collection ID**: `users`
- Clique em **"Next"**
- **Document ID**: `50cb5949-2b61-44ef-8aa3-5a2ea338179c`
- Adicione os campos:

  ```
  name: "Administrador Editora Graça"
  email: "geraleditoragraca@gmail.com"
  role: "adm"
  createdAt: (timestamp) 2026-01-14
  ```

- Clique em **"Save"**

#### Repita para os outros utilizadores

**Utilizador 2:**

- Document ID: `166b65e6-a5e8-406d-b9c9-87802ad1326e`
- name: "Nilton"
- email: "<niltongraca47@gmail.com>"
- role: "leitor"
- createdAt: (timestamp) 2026-01-16

**Utilizador 3:**

- Document ID: `d846b3dd-4a07-4f6b-a012-ede28f65114a`
- name: "Caponzo"
- email: "<caponzograca924@gmail.com>"
- role: "leitor"
- createdAt: (timestamp) 2026-01-16

### Passo 2: Adicionar o Livro

1. Criar coleção **`books`**
2. **Document ID**: `cb6f065b-5347-4466-b9cb-1cbb7ec433c3`
3. Campos:

```
title: "Palavras Não Ditas"
author: "Ngunga"
price: 0
stock: 0
category: "Poesia"
coverUrl: "https://editoragracaa.wordpress.com/wp-content/uploads/2025/10/palavras.png"
description: "Em Palavras Não Ditas..."
format: "digital"
digitalFileUrl: "https://editoragracaa.wordpress.com/wp-content/uploads/2025/10/palavras-nao-ditas-ebook.pdf"
createdAt: (timestamp) 2026-01-16
```

---

## ⚡ Alternativa: Script com Firebase Admin SDK

Se preferir automatizar (requer mais configuração):

### Requisitos

1. Baixar **Service Account Key** do Firebase:
   - Firebase Console → Project Settings → Service Accounts
   - Clique em "Generate New Private Key"
   - Salvar como `serviceAccountKey.json`

2. Instalar Firebase Admin:

```bash
npm install firebase-admin
```

1. Executar script especial (criarei se quiser)

---

## 🎯 Qual método prefere?

**A) Manual** (15-20 min, garantido a funcionar)
**B) Admin SDK** (precisa baixar Service Account Key primeiro)

Digite **A** ou **B** para continuar.
