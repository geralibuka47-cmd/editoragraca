# Guia de Deploy Vercel: Editora Graça

Siga estas instruções para realizar o deploy inicial e configurar o painel da Vercel corretamente.

## 1. Configurações de Build (Build Settings)

Ao importar o projeto no dashboard da Vercel, certifique-se de que as seguintes configurações estão definidas:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build` ou `vite build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 2. Variáveis de Ambiente (Environment Variables)

Este passo é crucial para o funcionamento do Firebase e Sentry. Adicione estas chaves na aba **Settings > Environment Variables**:

| Key | Value |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | *(Sua chave do Firebase)* |
| `VITE_FIREBASE_AUTH_DOMAIN` | `editoragraca.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `editoragraca` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `editoragraca.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | *(Seu ID)* |
| `VITE_FIREBASE_APP_ID` | *(Seu App ID)* |
| `VITE_FIREBASE_MEASUREMENT_ID` | *(Seu ID de Analytics)* |
| `VITE_SENTRY_DSN` | *(Sua URL do Sentry)* |

> [!TIP]
> Marque todas as opções (Production, Preview, Development) para estas variáveis se quiser que o ambiente de teste também funcione.

## 3. Deploy Inicial

1. Após configurar as variáveis, clique em **Deploy**.
2. A Vercel executará o comando de build que otimizamos (reduzindo o bundle em 80%).
3. Caso ocorra algum erro de "Module not found", verifique se todas as dependências foram enviadas ao Git.

## 4. Testes de Produção (Checklist)

Assim que o site estiver "Live", realize estes testes:

1. **Carregamento**: Site deve abrir em menos de 2 segundos.
2. **Navegação**: Clique em "Livros", "Blog" e "Serviços" para garantir que o roteamento está funcionando.
3. **Firebase Auth**: Tente fazer login. Se falhar, verifique se o seu domínio (ex: `editoragraca.vercel.app`) está na **lista branca (Authorized Domains)** do Firebase Console.
4. **Firestore**: Verifique se os livros aparecem. Se não, as regras de segurança podem estar a bloquear.

## 5. Coleta de Dados

- Acesse o Console do Firebase > Analytics e veja se o "Realtime" detecta sua visita.
- Acesse o Sentry e veja se não há novos erros registados.
