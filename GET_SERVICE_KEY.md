# 🔑 Como Obter a Service Account Key

## Passo 1: Aceder ao Firebase Console

Abra este link no seu navegador:

**<https://console.firebase.google.com/project/editora-graca/settings/serviceaccounts/adminsdk>**

## Passo 2: Gerar Nova Chave Privada

1. Na página "Service accounts", verá a secção **"Firebase Admin SDK"**
2. Selecione **"Node.js"** como linguagem (se ainda não estiver selecionado)
3. Clique no botão **"Generate new private key"** (Gerar nova chave privada)
4. Confirme clicando em **"Generate key"** no pop-up

## Passo 3: Salvar o Ficheiro

1. O navegador irá baixar um ficheiro JSON (ex: `editora-graca-firebase-adminsdk-xxxxx.json`)
2. **RENOMEIE** o ficheiro para: `serviceAccountKey.json`
3. **MOVA** o ficheiro para a raiz do projeto: `c:\www\editoragraca-novo\serviceAccountKey.json`

## Passo 4: Verificar

O ficheiro deve estar em:

```
c:\www\editoragraca-novo\
├── serviceAccountKey.json  ← AQUI
├── package.json
├── src/
└── ...
```

## ⚠️ IMPORTANTE: Segurança

Este ficheiro contém credenciais SENSÍVEIS!

- ❌ **NUNCA** faça commit deste ficheiro para Git
- ✅ Já está adicionado ao `.gitignore`
- ✅ Use apenas localmente

## Passo 5: Avise-me

Quando tiver o ficheiro `serviceAccountKey.json` na raiz do projeto, escreva:

**"Ficheiro pronto"** ou **"Pronto"**

E executarei a importação automaticamente! 🚀
