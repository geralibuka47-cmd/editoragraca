# 🔐 Configuração: Firebase Storage Rules

## 📋 Aplicar Regras de Segurança do Storage

### Passo 1: Aceder ao Firebase Console

**URL:** <https://console.firebase.google.com/project/editora-graca/storage/rules>

### Passo 2: Copiar as Regras

Abra o ficheiro [`storage.rules`](file:///c:/www/editoragraca-novo/storage.rules) e copie **TODO** o conteúdo.

### Passo 3: Colar no Firebase Console

1. No Firebase Console, na página **Storage → Rules**
2. **SUBSTITUA** todo o conteúdo existente
3. **Cole** as novas regras do ficheiro `storage.rules`
4. Clique em **"Publish"** (Publicar)

---

## 🔒 Resumo das Regras de Storage

### 📚 Book Covers (`/book-covers/`)

- ✅ **Leitura:** Pública (todos)
- ✏️ **Upload:** Admin e Autores
- 📏 **Limite:** 5MB
- 📄 **Tipo:** Imagens apenas
- 🗑️ **Eliminar:** Apenas Admin

### 👤 Profile Pictures (`/profile-pictures/`)

- ✅ **Leitura:** Pública (todos)
- ✏️ **Upload:** Utilizador autenticado (sua própria foto)
- 📏 **Limite:** 2MB
- 📄 **Tipo:** Imagens apenas
- 🗑️ **Eliminar:** Próprio ou Admin

### 📄 Manuscripts (`/manuscripts/`)

- ✅ **Leitura:** Apenas Admin
- ✏️ **Upload:** Utilizador autenticado
- 📏 **Limite:** 50MB
- 📄 **Tipo:** PDF ou DOCX
- 🗑️ **Eliminar:** Apenas Admin

### 💳 Payment Proofs (`/payment-proofs/`)

- ✅ **Leitura:** Apenas Admin
- ✏️ **Upload:** Utilizador autenticado
- 📏 **Limite:** 5MB
- 📄 **Tipo:** Imagens ou PDF
- 🗑️ **Eliminar:** Apenas Admin

### 🖼️ Blog Images (`/blog-images/`)

- ✅ **Leitura:** Pública (todos)
- ✏️ **Upload:** Apenas Admin
- 📏 **Limite:** 5MB
- 📄 **Tipo:** Imagens apenas
- 🗑️ **Eliminar:** Apenas Admin

### 📁 Public Folder (`/editora-public/`)

- ✅ **Leitura:** Pública (todos)
- ✏️ **Modificar:** Apenas Admin

---

## ⚠️ Importante

- As regras incluem **validação de tipo de ficheiro** e **tamanho máximo**
- Ficheiros não permitidos serão **rejeitados automaticamente**
- **Fallback:** Tudo que não está explicitamente permitido é **negado**

---

## ✅ Verificação

Após aplicar as regras, teste:

1. **Upload de capa de livro** (como admin) ✅
2. **Upload de foto de perfil** (como utilizador) ✅
3. **Upload de manuscrito** (como utilizador) ✅
4. **Rejeição** de ficheiros muito grandes ❌

---

## 🚀 Próximo Passo

Quando as regras estiverem aplicadas, escreva **"Storage configurado"** para iniciar os testes!
