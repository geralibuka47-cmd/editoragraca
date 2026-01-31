# 📦 Como Configurar o Storage Bucket

![Configuração Storage](file:///C:/Users/nilto/.gemini/antigravity/brain/6aad7683-a132-4a89-891f-147d356a4406/uploaded_media_1769600966412.png)

## ✅ Passo a Passo

### 1️⃣ Opções de Bucket

**Manter como está:**

- ✅ Referência do bucket: `gs://editora-graca.firebasestorage.app`
- ✅ Classe de armazenamento: **Regional**

### 2️⃣ Local sem custos financeiros ✅

**Selecione esta opção** (já está selecionada)

**Configuração:**

- **Local:** Escolha **europe-west1** ou **europe-west3** (Europa)
  - Se não estiver disponível, mantenha **US-CENTRAL1** (funciona bem)
- **Frequência de acesso:** **Standard** ✅

### 3️⃣ Clicar em "Continuar"

Depois clique no botão azul **"Continuar"** no canto inferior direito.

---

## 📋 Configuração Recomendada

```
Local sem custos financeiros: ✅ (selecionado)
Local: europe-west1 (ou US-CENTRAL1)
Frequência de acesso: Standard
```

---

## ⚠️ Importante

- ✅ **Não precisa** selecionar "Todos os locais" (mais caro)
- ✅ **Regional** é suficiente para a aplicação
- ✅ **Standard** é ideal para frequência normal de acesso

---

## 🚀 Próximo Passo

1. Clique em **"Continuar"**
2. Na próxima página (Regras de segurança), **cole** o conteúdo do ficheiro [`storage.rules`](file:///c:/www/editoragraca-novo/storage.rules)
3. Depois escreva **"Storage configurado"**
