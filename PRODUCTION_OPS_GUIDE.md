# Guia de Operações e Monitoramento: Editora Graça

Este documento descreve como manter, monitorar e verificar a aplicação Editora Graça em ambiente de produção.

## 1. Monitoramento de Erros e Alertas (Sentry)

O Sentry foi integrado para capturar erros em tempo real. Siga estes passos para configurar alertas:

### Configuração de Alertas

1. Vá para o seu projeto no **Sentry Dashboard**.
2. No menu lateral, clique em **Alerts**.
3. Clique em **Create Alert Rule**.
4. Recomendo criar dois tipos de alertas:
   - **Issues (Issue Alert)**: Notificar via e-mail quando um novo tipo de erro for detectado.
   - **Metric Alerts**: Notificar se a taxa total de erros exceder um limite (ex: 1% das sessões).

### Visualização de Erros

- Explore a aba **Issues** para ver o stack trace exato, o navegador do usuário e o caminho onde o erro ocorreu.
- Use o **Replay** (se configurado) para assistir a uma "gravação" do que o usuário fez antes do erro.

## 2. Monitoramento de Performance (Firebase)

O Firebase Performance Monitoring captura automaticamente métricas críticas como:

- **LCP (Largest Contentful Paint)**: Rapidez com que o conteúdo principal carrega.
- **FID (First Input Delay)**: Rapidez com que o site responde ao primeiro clique.
- **Network Requests**: Tempo de resposta das chamadas ao Firestore e Auth.

### Verificação

1. No Console do Firebase, vá para **Release & Monitor > Performance**.
2. Aguarde as primeiras 24 horas após o deploy para ver os dados agregados.
3. Use o dashboard para identificar páginas lentas ou falhas em APIs específicas.

## 3. Dashboards de Analytics

### Firebase Analytics

- Verifique a aba **Analytics > Dashboard**.
- Monitore **User Engagement** e **Conversion Events** (ex: finalização de compra).
- Você pode criar audiências específicas (ex: "Autores ativos") para entender o comportamento de cada grupo.

## 4. Checklist de Verificação em Produção

Após realizar o deploy inicial, execute estes testes manualmente:

| Funcionalidade | O que testar | Resultado Esperado |
| :--- | :--- | :--- |
| **Login/Registo** | Criar nova conta e fazer login. | Sucesso e redirecionamento correto. |
| **Catálogo** | Navegar pela lista de livros e abrir detalhes. | Imagens carregam e detalhes aparecem. |
| **Carrinho** | Adicionar um livro ao carrinho. | Contador no Navbar atualiza instantaneamente. |
| **Admin** | Aceder ao `/admin` (com conta adm). | Dashboard carrega e exibe estatísticas. |
| **Imagens** | Verificar se capas e fotos de perfil carregam. | Sem erros 403 (Security Rules ok). |
| **Performance** | Abrir o site em modo incógnito no telemóvel. | Carregamento rápido (< 2s). |

## 5. Regras de Segurança (Firestore & Storage) [IMPORTANTE]

Como migramos para o Firebase, as regras de segurança são fundamentais para proteger os dados. Certifique-se de que os ficheiros `firestore.rules` e `storage.rules` estão sincronizados com o servidor.

### Como aplicar as regras

Se tiver o Firebase CLI instalado:

```bash
firebase deploy --only firestore:rules,storage
```

*Caso contrário, copie o conteúdo dos ficheiros e cole diretamente nos separadores "Rules" das consolas Firestore e Storage no site do Firebase.*

## 6. Processo de Deploy (Resumo)

### Fluxo de Trabalho Recomendado

1. **Desenvolvimento**: Faça alterações locais e teste com `npm run dev`.
2. **Build Test**: Execute `npm run build` periodicamente para garantir que o bundle está saudável.
3. **Draft Deploy**: No Vercel, use as branch previews para validar mudanças antes de unir à `main`.
4. **Produção**: O merge na branch `main` dispara automaticamente o deploy para o domínio oficial.

### Manutenção de Dependências

- Execute `npm audit` mensalmente para verificar vulnerabilidades.
- Mantenha o SDK do Firebase e Sentry updated para as últimas versões estáveis.
