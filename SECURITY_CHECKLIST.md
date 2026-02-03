# 🛡️ Checklist de Segurança: Editora Graça

Siga estes passos antes de colocar o site em produção para garantir a máxima segurança.

## 1. Regras de Segurança (CRÍTICO)

A segurança dos seus dados depende de as regras estarem ativas no servidor do Firebase.

- [ ] **Firestore Rules**: Verifique se o conteúdo de [`firestore.rules`](file:///c:/www/editoragraca-novo/firestore.rules) foi publicado no Firebase Console.
- [ ] **Storage Rules**: Verifique se o conteúdo de [`storage.rules`](file:///c:/www/editoragraca-novo/storage.rules) foi publicado no Firebase Console.
- [ ] **Teste de Acesso**: Tente aceder à página `/admin` sem estar logado. O site deve redirecionar para `/login`.

## 2. Autenticação e Provedores

- [ ] **Google OAuth**: No Console do Firebase, certifique-se de que o provedor "Google" está ativado.
- [ ] **Domínios Autorizados**: Em Firebase > Authentication > Settings, adicione o seu domínio final (ex: `editoragraca.com.br`) aos domínios autorizados.

## 3. Variáveis de Ambiente

- [ ] **Exposição**: Lembre-se que todas as variáveis que começam com `VITE_` são visíveis no código fonte do navegador. Não coloque chaves secretas (Secret Keys) ou senhas nestas variáveis.
- [ ] **Produção**: Crie um ficheiro `.env.production` com as chaves reais de produção.

## 4. Hosting e Cabeçalhos

O arquivo `index.html` já contém uma **CSP (Content Security Policy)** básica. No entanto, se usar um serviço como Netlify ou Vercel, pode adicionar cabeçalhos extra:

- [ ] **HSTS**: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- [ ] **X-Frame-Options**: `DENY` (para evitar Clickjacking)
- [ ] **X-Content-Type-Options**: `nosniff`

## 5. Auditoria de Dependências

- [ ] Execute `npm audit` no seu terminal para verificar se há pacotes com vulnerabilidades conhecidas.

---
**Status da Auditoria AI:** O código foi revisto e segue as melhores práticas de SPAs modernas (React 19). Não foram detetadas vulnerabilidades de injeção direta (XSS) ou fugas de dados evidentes.
